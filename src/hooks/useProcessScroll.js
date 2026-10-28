import { useCallback, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROCESS_PHASES } from '../vendor/process-choreography'
export { PROCESS_PHASES } from '../vendor/process-choreography'

gsap.registerPlugin(ScrollTrigger)

/** One compact scroll chapter, with a readable natural-flow fallback. */
export default function useProcessScroll(sectionRef, experienceRef, setStep, progressRef) {
  const triggerRef = useRef(null)
  const selectedRef = useRef(0)
  const manualAtRef = useRef(null)

  const selectStep = useCallback(index => {
    const next = Math.max(0, Math.min(3, Math.round(index)))
    const trigger = triggerRef.current
    if (!trigger) return
    const value = PROCESS_PHASES[next]
    if (sectionRef.current?.dataset.processMode === 'natural') {
      // The renderer interpolates the visual pose. Keep the chosen copy readable
      // until another choice; the next real scroll resumes its continuous path.
      manualAtRef.current = { scrollY: window.scrollY, value }
      progressRef.current = value
      experienceRef.current?.style.setProperty('--sp-progress', String(value))
      if (selectedRef.current !== next) { selectedRef.current = next; setStep(next) }
      return
    }
    manualAtRef.current = null
    const position = trigger.start + (trigger.end - trigger.start) * value
    const top = Math.max(0, Math.min(ScrollTrigger.maxScroll(window), position))
    // Copy follows the moving scene; a button does not jump directly to a pose.
    window.scrollTo({ top, behavior: 'smooth' })
  }, [sectionRef, experienceRef, progressRef, setStep])

  useLayoutEffect(() => {
    const section = sectionRef.current
    const experience = experienceRef.current
    if (!section || !experience) return undefined
    const previousMode = section.getAttribute('data-process-mode')
    const previousProgress = experience.style.getPropertyValue('--sp-progress')
    const media = gsap.matchMedia()
    let disposed = false
    const writeProgress = gsap.quickSetter(experience, '--sp-progress')

    const synchronize = self => {
      if (disposed) return
      const natural = section.dataset.processMode === 'natural'
      let progress = Math.max(0, Math.min(1, self.progress))
      if (natural && manualAtRef.current) {
        if (Math.abs(window.scrollY - manualAtRef.current.scrollY) < 2) progress = manualAtRef.current.value
        else manualAtRef.current = null
      }
      progressRef.current = progress
      writeProgress(progress)
      if (natural) return
      let next = selectedRef.current
      while (next < 3 && progress > (PROCESS_PHASES[next] + PROCESS_PHASES[next + 1]) / 2 + 0.012) next++
      while (next > 0 && progress < (PROCESS_PHASES[next - 1] + PROCESS_PHASES[next]) / 2 - 0.012) next--
      if (next !== selectedRef.current) { selectedRef.current = next; setStep(next) }
    }

    media.add({ all: 'all', mobile: '(max-width: 700px)' }, context => {
      const mobile = context.conditions.mobile
      let scopeDisposed = false
      let scope
      let trigger
      let pinned
      let resizeFrame = 0
      let lastWidth = experience.clientWidth
      let lastHeight = experience.clientHeight
      let initialResize = true
      const inset = () => Math.max(14, Math.round(window.innerHeight * 0.06))
      const fits = () => {
        const height = Math.max(experience.clientHeight, experience.scrollHeight)
        return height <= window.innerHeight * 0.88 && height + inset() + 16 <= window.innerHeight
      }
      const rebuild = () => {
        scope?.revert()
        pinned = fits()
        section.dataset.processMode = pinned ? 'pinned' : 'natural'
        // Preserve a readable copy if resizing makes the scene too tall to pin.
        manualAtRef.current = null
        scope = gsap.context(() => {
          trigger = ScrollTrigger.create({
            trigger: experience,
            start: pinned ? () => `top ${inset()}px` : 'top 85%',
            endTrigger: pinned ? experience : experience.querySelector('.sp-visual'),
            end: pinned ? () => `+=${Math.round(window.innerHeight * (mobile ? 1.1 : 1.3))}` : 'top 18%',
            pin: pinned ? experience : false,
            pinSpacing: pinned,
            anticipatePin: pinned ? 1 : 0,
            invalidateOnRefresh: true,
            onUpdate: synchronize,
            onRefresh: synchronize,
          })
          triggerRef.current = trigger
          synchronize(trigger)
        }, section)
      }
      const reassess = () => {
        resizeFrame = 0
        if (disposed || scopeDisposed) return
        if (fits() !== pinned) rebuild()
        ScrollTrigger.refresh()
      }
      const schedule = () => {
        if (!disposed && !scopeDisposed && !resizeFrame) resizeFrame = requestAnimationFrame(reassess)
      }
      rebuild()
      const observer = new ResizeObserver(() => {
        const width = experience.clientWidth
        const height = experience.clientHeight
        if (initialResize) { initialResize = false; lastWidth = width; lastHeight = height; return }
        if (width === lastWidth && height === lastHeight) return
        lastWidth = width
        lastHeight = height
        schedule()
      })
      observer.observe(experience)
      window.addEventListener('resize', schedule, { passive: true })
      document.fonts?.ready.then(() => { if (!disposed && !scopeDisposed) schedule() })
      return () => {
        scopeDisposed = true
        cancelAnimationFrame(resizeFrame)
        observer.disconnect()
        window.removeEventListener('resize', schedule)
        if (triggerRef.current === trigger) triggerRef.current = null
        scope?.revert()
      }
    })
    return () => {
      disposed = true
      media.revert()
      triggerRef.current = null
      manualAtRef.current = null
      if (previousMode === null) section.removeAttribute('data-process-mode')
      else section.setAttribute('data-process-mode', previousMode)
      if (previousProgress) experience.style.setProperty('--sp-progress', previousProgress)
      else experience.style.removeProperty('--sp-progress')
    }
  }, [sectionRef, experienceRef, setStep, progressRef])

  return selectStep
}
