const allowedKeys = ['service', 'placement', 'channel']

// Punto de integración para GA4/GTM; no instala etiquetas ni envía datos externos.
// No incluir nombres, correos, brief, URL de activos o contenido de formularios.
export function trackEvent(event, details = {}) {
  if (typeof window === 'undefined') return
  const fields = Object.fromEntries(allowedKeys.filter(key => typeof details[key] === 'string').map(key => [key, details[key]]))
  const payload = { event, page_path:window.location.pathname, ...fields }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
  window.dispatchEvent(new CustomEvent('securiva:analytics', { detail:payload }))
}

export function observeContactLinks() {
  if (typeof document === 'undefined') return () => {}
  const click = event => {
    const link = event.target.closest?.('a[href]')
    if (!link) return
    const href = link.getAttribute('href')
    if (href?.startsWith('https://wa.me/')) trackEvent('contact_whatsapp_open', { channel:'whatsapp', placement:'direct_link' })
    if (href?.startsWith('mailto:')) trackEvent('contact_email_open', { channel:'email', placement:'direct_link' })
  }
  document.addEventListener('click', click)
  return () => document.removeEventListener('click', click)
}
