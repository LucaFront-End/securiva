import { useCallback, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECURITY_PHASES } from '../vendor/security-choreography';

gsap.registerPlugin(ScrollTrigger);

/** Four real scroll chapters, with pinning only when the complete view fits. */
export default function useArchitectureScroll(sectionRef, experienceRef, setStage, progressRef) {
  const triggerRef = useRef(null);
  const selectedRef = useRef(0);
  const naturalNavigationRef = useRef(null);

  const selectStage = useCallback(index => {
    const next = Math.max(0, Math.min(3, Math.round(index)));
    const trigger = triggerRef.current;
    if (!trigger) return;
    const progress = SECURITY_PHASES[next];
    if (sectionRef.current?.dataset.scrollMode === 'natural') {
      selectedRef.current = next;
      setStage(next);
      // Preserve a continuous path after choosing a pose on a short screen.
      // Further scroll maps from this point to the original path endpoints.
      naturalNavigationRef.current = { raw: trigger.progress, value: progress };
      progressRef.current = progress;
      experienceRef.current?.style.setProperty('--sa-progress', progress);
      return;
    }
    const top = Math.round(Math.max(0, Math.min(ScrollTrigger.maxScroll(window), trigger.start + (trigger.end - trigger.start) * progress)));
    window.scrollTo({ top, behavior: 'smooth' });
    trigger.update();
  }, [setStage, sectionRef, experienceRef, progressRef]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const experience = experienceRef.current;
    if (!section || !experience) return undefined;
    const previousProgress = experience.style.getPropertyValue('--sa-progress');
    const previousMode = section.getAttribute('data-scroll-mode');
    const mm = gsap.matchMedia();
    let disposed = false;

    const activate = next => {
      if (selectedRef.current === next) return;
      selectedRef.current = next;
      setStage(next);
    };
    const setProgress = gsap.quickSetter(experience, '--sa-progress');
    const synchronize = self => {
      const raw = Math.max(0, Math.min(1, self.progress));
      let progress = raw;
      const natural = section.dataset.scrollMode === 'natural';
      const navigation = naturalNavigationRef.current;
      if (natural && navigation) {
        const atEdge = navigation.raw <= .001 || navigation.raw >= .999;
        if (atEdge && Math.abs(raw - navigation.raw) > .001) {
          // An endpoint has no remaining interval on one side. Release it on
          // real scroll instead of trapping a selected start/end pose forever.
          naturalNavigationRef.current = null;
        } else if (atEdge) {
          progress = navigation.value;
        } else {
          progress = raw >= navigation.raw
            ? navigation.value + (1 - navigation.value) * (raw - navigation.raw) / (1 - navigation.raw)
            : navigation.value * raw / navigation.raw;
        }
      }
      progressRef.current = Math.max(0, Math.min(1, progress));
      setProgress(progress);
      // Copy remains readable in short screens; the visual still scrubs.
      if (natural) return;
      let next = selectedRef.current;
      // A small deadband keeps copy from flickering on trackpad reversals.
      while (next < 3 && progress > (SECURITY_PHASES[next] + SECURITY_PHASES[next + 1]) / 2 + .009) next++;
      while (next > 0 && progress < (SECURITY_PHASES[next - 1] + SECURITY_PHASES[next]) / 2 - .009) next--;
      activate(next);
    };

    // Breakpoint scopes clean up their pin spacers. Actual fit is measured too:
    // a viewport height alone cannot predict the height of wrapped copy.
    mm.add({ all: 'all', wide: '(min-width: 701px)' }, () => {
      let context;
      let scopeDisposed = false;
      let trigger;
      let pinning;
      let resizeFrame = 0;
      let initialResize = true;
      let lastWidth = experience.clientWidth;
      let lastHeight = experience.clientHeight;

      const fits = () => {
        const inset = Math.max(14, Math.round(window.innerHeight * 0.08));
        return Math.max(experience.clientHeight, experience.scrollHeight) + inset + 18 <= window.innerHeight;
      };
      const rebuild = () => {
        naturalNavigationRef.current = null;
        context?.revert();
        pinning = fits();
        section.dataset.scrollMode = pinning ? 'pinned' : 'natural';
        context = gsap.context(() => {
          trigger = ScrollTrigger.create({
            trigger: experience,
            start: pinning ? () => `top ${Math.max(14, Math.round(window.innerHeight * 0.08))}px` : 'top 85%',
            endTrigger: pinning ? experience : experience.querySelector('.sa-visual'),
            end: pinning ? () => `+=${Math.round(window.innerHeight * 0.85)}` : 'bottom 20%',
            pin: pinning ? experience : false,
            pinSpacing: pinning,
            anticipatePin: pinning ? 1 : 0,
            invalidateOnRefresh: true,
            onUpdate: synchronize,
            onRefresh: synchronize,
          });
          triggerRef.current = trigger;
          synchronize(trigger);
        }, section);
      };
      const reassess = () => {
        resizeFrame = 0;
        if (disposed || scopeDisposed) return;
        if (fits() !== pinning) rebuild();
        ScrollTrigger.refresh();
      };
      const requestReassessment = () => {
        if (!disposed && !scopeDisposed && !resizeFrame) resizeFrame = window.requestAnimationFrame(reassess);
      };
      rebuild();

      const resizeObserver = new ResizeObserver(() => {
        const width = experience.clientWidth;
        const height = experience.clientHeight;
        if (initialResize) {
          initialResize = false;
          lastWidth = width;
          lastHeight = height;
          return;
        }
        if (width === lastWidth && height === lastHeight) return;
        lastWidth = width;
        lastHeight = height;
        requestReassessment();
      });
      resizeObserver.observe(experience);
      window.addEventListener('resize', requestReassessment, { passive: true });
      document.fonts?.ready.then(() => { if (!disposed && !scopeDisposed) requestReassessment(); });

      return () => {
        scopeDisposed = true;
        resizeObserver.disconnect();
        window.removeEventListener('resize', requestReassessment);
        window.cancelAnimationFrame(resizeFrame);
        if (triggerRef.current === trigger) triggerRef.current = null;
        context?.revert();
      };
    });

    return () => {
      disposed = true;
      naturalNavigationRef.current = null;
      mm.revert();
      triggerRef.current = null;
      if (previousProgress) experience.style.setProperty('--sa-progress', previousProgress);
      else experience.style.removeProperty('--sa-progress');
      if (previousMode === null) section.removeAttribute('data-scroll-mode');
      else section.setAttribute('data-scroll-mode', previousMode);
    };
  }, [sectionRef, experienceRef, setStage, progressRef]);

  return selectStage;
}
