import { useCallback, useEffect, useState } from 'react'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function getSystemReduced() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(reducedMotionQuery).matches
    : false
}

export default function useMotionPreference() {
  const [userChoice, setUserChoice] = useState(null)
  const [systemReduced, setSystemReduced] = useState(getSystemReduced)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const media = window.matchMedia(reducedMotionQuery)
    const updatePreference = (event) => setSystemReduced(event.matches)
    setSystemReduced(media.matches)
    if (media.addEventListener) {
      media.addEventListener('change', updatePreference)
      return () => media.removeEventListener('change', updatePreference)
    }
    media.addListener(updatePreference)
    return () => media.removeListener(updatePreference)
  }, [])

  const motionEnabled = userChoice ?? !systemReduced
  const toggleMotion = useCallback(() => {
    setUserChoice((choice) => !(choice ?? !systemReduced))
  }, [systemReduced])

  return { motionEnabled, toggleMotion }
}
