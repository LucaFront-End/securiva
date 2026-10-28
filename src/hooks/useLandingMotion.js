import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const motionAllowed = 'all';
const desktopMotion = '(min-width: 901px) and (pointer: fine)';
const stackedCardsMotion = '(min-width: 1101px) and (min-height: 700px) and (pointer: fine)';
const pointerMotion = '(hover: hover) and (pointer: fine)';

/** Scroll choreography and local pointer feedback, scoped to the landing. */
export default function useLandingMotion(appRef, setActiveStep, motionEnabled = true) {
  useEffect(() => {
    const root = appRef.current;
    if (!root) return undefined;

    const select = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    const header = root.querySelector('.site-header');
    const headerWasScrolled = header?.classList.contains('is-scrolled');
    const processContainer = root.querySelector('.process-steps');
    const processCards = processContainer ? Array.from(processContainer.querySelectorAll('.process-step')) : [];
    let activeStep = -1;

    // Sticky positions are clamped in viewport space. Read normal-flow sizes
    // instead, so refreshing midway through the stack keeps its boundaries.
    const getFlowOffset = index => {
      if (!processContainer) return 0;
      const containerStyle = window.getComputedStyle(processContainer);
      let offset = Number.parseFloat(containerStyle.paddingTop) || 0;
      const rowGap = Number.parseFloat(containerStyle.rowGap) || 0;
      for (let position = 0; position <= index; position++) {
        const card = processCards[position];
        if (!card) break;
        const style = window.getComputedStyle(card);
        offset += Number.parseFloat(style.marginBlockStart) || 0;
        if (position === index) return offset;
        offset += card.offsetHeight + (Number.parseFloat(style.marginBlockEnd) || 0) + rowGap;
      }
      return offset;
    };

    const activateStep = index => {
      if (activeStep === index) return;
      activeStep = index;
      setActiveStep(index);
    };
    const refreshStep = () => {
      if (!processContainer || !processCards.length) return;
      let current = 0;
      const line = window.innerHeight * 0.55;
      const containerTop = processContainer.getBoundingClientRect().top;
      processCards.forEach((_, index) => {
        if (containerTop + getFlowOffset(index) <= line) current = index;
      });
      activateStep(current);
    };

    // This observer drives CSS animation-play-state. It never drives scrolling
    // or runs a continuous JavaScript loop.
    const surfaceDemos = select('.surface-demo');
    const previousMotionAttributes = new Map(surfaceDemos.map(element => [element, element.getAttribute('data-motion-view')]));
    let motionObserver;
    if ('IntersectionObserver' in window) {
      surfaceDemos.forEach(element => element.setAttribute('data-motion-view', 'false'));
      motionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.target.setAttribute('data-motion-view', String(entry.isIntersecting)));
      }, { rootMargin: '80px', threshold: 0 });
      surfaceDemos.forEach(element => motionObserver.observe(element));
    } else {
      surfaceDemos.forEach(element => element.setAttribute('data-motion-view', 'true'));
    }

    const ctx = gsap.context(() => {
      if (header) {
        const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY >= 100);
        updateHeader();
        ScrollTrigger.create({ start: 100, end: 'max', onToggle: updateHeader });
      }

      processCards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: processContainer,
          start: () => `top+=${getFlowOffset(index)} 55%`,
          end: () => `top+=${getFlowOffset(index) + card.offsetHeight} 55%`,
          invalidateOnRefresh: true,
          onEnter: () => activateStep(index),
          onEnterBack: () => activateStep(index),
        });
      });

      if (motionEnabled) mm.add(motionAllowed, () => {
        const heroItems = select('.hero-reveal');
        if (heroItems.length) {
          gsap.from(heroItems, {
            y: 32, opacity: 0, duration: 1, stagger: 0.09,
            delay: 0.08, ease: 'power3.out', clearProps: 'opacity,transform',
          });
        }

        select('[data-reveal]')
          .filter(element => !element.closest('.process-step, .report-showcase, .report-motion-stage'))
          .forEach(element => {
            gsap.from(element, {
              y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
              clearProps: 'opacity,transform',
              scrollTrigger: { trigger: element, start: 'top 91%', once: true },
            });
          });

        const words = select('.manifesto-word');
        const manifesto = root.querySelector('.manifesto-copy');
        if (words.length && manifesto) {
          gsap.fromTo(words, { opacity: 0.18 }, {
            opacity: 1, stagger: 0.1, ease: 'none',
            scrollTrigger: { trigger: manifesto, start: 'top 85%', end: 'bottom 45%', scrub: 0.6 },
          });
        }
        const manifestoEnd = root.querySelector('.manifesto-end');
        if (manifestoEnd && manifesto) {
          gsap.to(manifestoEnd, {
            '--reveal-line': 1, ease: 'none',
            scrollTrigger: { trigger: manifesto, start: 'top 65%', end: 'bottom 45%', scrub: 0.5 },
          });
        }

        const tickerTrack = root.querySelector('.ticker-track');
        const ticker = root.querySelector('.ticker');
        if (tickerTrack && ticker) {
          gsap.to(tickerTrack, {
            xPercent: -18, ease: 'none',
            scrollTrigger: { trigger: ticker, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
        }
      });

      if (motionEnabled) mm.add(desktopMotion, () => {
        const hero = root.querySelector('.hero');
        const heroCopy = root.querySelector('.hero-copy');
        const heroArt = root.querySelector('.hero-art');
        if (hero && heroCopy) {
          gsap.to(heroCopy, {
            y: 70, opacity: 0.2, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 30%', scrub: 0.7 },
          });
        }
        if (hero && heroArt) {
          gsap.to(heroArt, {
            y: -35, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 30%', scrub: 0.7 },
          });
        }

        const serviceDepth = root.querySelector('.service-depth');
        const servicesLayout = root.querySelector('.services-layout');
        if (serviceDepth && servicesLayout) {
          gsap.fromTo(serviceDepth, {
            transformPerspective: 1100, transformOrigin: '50% 50%',
            rotationX: 10, rotationY: -7, y: 45, scale: 0.95,
          }, {
            rotationX: 0, rotationY: 0, y: 0, scale: 1, ease: 'none',
            scrollTrigger: { trigger: servicesLayout, start: 'top 85%', end: 'top 25%', scrub: 0.8 },
          });
        }

        const agency = root.querySelector('.agency-section');
        const reportStage = root.querySelector('.report-motion-stage');
        if (agency && reportStage) {
          gsap.fromTo(reportStage, {
            transformPerspective: 1200, transformOrigin: '50% 50%',
            rotationX: 18, rotationY: -12, y: 90, scale: 0.86,
          }, {
            rotationX: 0, rotationY: 0, y: -15, scale: 1, ease: 'none',
            scrollTrigger: { trigger: agency, start: 'top 85%', end: 'center center', scrub: 0.8 },
          });
        }
        if (agency) {
          [['.report-back-one', 8, -4], ['.report-back-two', 13, 5]].forEach(([selector, from, to]) => {
            const sheet = root.querySelector(selector);
            if (!sheet) return;
            gsap.fromTo(sheet, { rotation: from }, {
              rotation: to, ease: 'none',
              scrollTrigger: { trigger: agency, start: 'top 85%', end: 'center center', scrub: 0.8 },
            });
          });
        }

        const finalCta = root.querySelector('.final-cta');
        const watermark = root.querySelector('.cta-watermark');
        if (finalCta && watermark) {
          gsap.fromTo(watermark, { yPercent: 20 }, {
            yPercent: 0, ease: 'none',
            scrollTrigger: { trigger: finalCta, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          });
        }
      });

      if (motionEnabled) mm.add(stackedCardsMotion, () => {
        processCards.slice(0, -1).forEach((card, index) => {
          gsap.fromTo(card, { scale: 1, transformOrigin: '50% 0%' }, {
            scale: 0.95, ease: 'none',
            scrollTrigger: {
              trigger: processContainer,
              start: () => `top+=${getFlowOffset(index + 1)} 65%`,
              end: () => `top+=${getFlowOffset(index + 1)} 185px`,
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      if (motionEnabled) mm.add(pointerMotion, () => {
        const targetSelector = '.button, .credential-card, .surface-demo, .final-cta';
        const properties = ['--light-x', '--light-y', '--magnet-x', '--magnet-y'];
        const originalProperties = new Map();
        let activeTargets = new Set();
        let pointerFrame = 0;
        let pointerTarget;
        let pointerX = 0;
        let pointerY = 0;

        const remember = element => {
          if (originalProperties.has(element)) return;
          originalProperties.set(element, properties.map(name => [name, element.style.getPropertyValue(name), element.style.getPropertyPriority(name)]));
        };
        const restore = element => {
          originalProperties.get(element)?.forEach(([name, value, priority]) => {
            if (value) element.style.setProperty(name, value, priority);
            else element.style.removeProperty(name);
          });
        };

        const flushPointer = () => {
          pointerFrame = 0;
          const targets = [];
          let current = pointerTarget instanceof Element ? pointerTarget : null;
          while (current && current !== root) {
            if (current.matches(targetSelector)) targets.push(current);
            current = current.parentElement;
          }
          const nextTargets = new Set(targets);
          // Batch layout reads before writes; a nested button and its CTA can
          // both receive local light without competing for transforms.
          const positions = targets.map(element => ({ element, bounds: element.getBoundingClientRect() }));
          activeTargets.forEach(element => { if (!nextTargets.has(element)) restore(element); });
          positions.forEach(({ element, bounds }) => {
            if (!bounds.width || !bounds.height) return;
            remember(element);
            const x = pointerX - bounds.left;
            const y = pointerY - bounds.top;
            element.style.setProperty('--light-x', `${gsap.utils.clamp(0, 100, x / bounds.width * 100).toFixed(2)}%`);
            element.style.setProperty('--light-y', `${gsap.utils.clamp(0, 100, y / bounds.height * 100).toFixed(2)}%`);
            if (element.matches('.button')) {
              element.style.setProperty('--magnet-x', `${gsap.utils.clamp(-7, 7, (x - bounds.width / 2) * 0.08).toFixed(2)}px`);
              element.style.setProperty('--magnet-y', `${gsap.utils.clamp(-7, 7, (y - bounds.height / 2) * 0.08).toFixed(2)}px`);
            }
          });
          activeTargets = nextTargets;
        };
        const movePointer = event => {
          if (event.pointerType === 'touch') return;
          pointerTarget = event.target;
          pointerX = event.clientX;
          pointerY = event.clientY;
          if (!pointerFrame) pointerFrame = window.requestAnimationFrame(flushPointer);
        };
        const leavePointer = () => {
          window.cancelAnimationFrame(pointerFrame);
          pointerFrame = 0;
          pointerTarget = undefined;
          activeTargets.forEach(restore);
          activeTargets.clear();
        };

        root.addEventListener('pointermove', movePointer, { passive: true });
        root.addEventListener('pointerleave', leavePointer);
        return () => {
          root.removeEventListener('pointermove', movePointer);
          root.removeEventListener('pointerleave', leavePointer);
          leavePointer();
          originalProperties.forEach((_, element) => restore(element));
          originalProperties.clear();
        };
      });
    }, root);

    refreshStep();
    ScrollTrigger.addEventListener('refresh', refreshStep);
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    const content = root.querySelector('main') || root;
    let contentHeight;
    let contentWidth;
    let contentResizeFrame = 0;
    const contentResizeObserver = 'ResizeObserver' in window ? new ResizeObserver(() => {
      // client dimensions ignore the transform choreography. Only flow changes
      // (FAQ expansion, tab copy, responsive wrapping) invalidate the triggers.
      const height = content.clientHeight;
      const width = content.clientWidth;
      if (contentHeight === undefined) {
        contentHeight = height;
        contentWidth = width;
        return;
      }
      if (height === contentHeight && width === contentWidth) return;
      contentHeight = height;
      contentWidth = width;
      if (!contentResizeFrame) {
        contentResizeFrame = window.requestAnimationFrame(() => {
          contentResizeFrame = 0;
          ScrollTrigger.refresh();
        });
      }
    }) : undefined;
    contentResizeObserver?.observe(content);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      window.cancelAnimationFrame(contentResizeFrame);
      contentResizeObserver?.disconnect();
      ScrollTrigger.removeEventListener('refresh', refreshStep);
      motionObserver?.disconnect();
      previousMotionAttributes.forEach((value, element) => {
        if (value === null) element.removeAttribute('data-motion-view');
        else element.setAttribute('data-motion-view', value);
      });
      mm.revert();
      ctx.revert();
      if (header) header.classList.toggle('is-scrolled', Boolean(headerWasScrolled));
    };
  }, [appRef, setActiveStep, motionEnabled]);
}
