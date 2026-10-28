import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check, Copy, Download, Mail, MessageCircle, X } from 'lucide-react'
import { CONTACT_EMAIL, CONTACT_WHATSAPP } from '../config'

const services = ['Pentesting', 'White label', 'Private Bug Bounty']

function buildBrief(form) {
  const data = new FormData(form)
  return [
    'SECURIVA — Brief de proyecto',
    '',
    `Nombre: ${String(data.get('name')).trim()}`,
    `Correo: ${String(data.get('email')).trim()}`,
    `Empresa: ${String(data.get('company')).trim() || 'No indicada'}`,
    `Servicio: ${data.get('service')}`,
    '',
    'Qué necesito proteger:',
    String(data.get('description')).trim(),
  ].join('\n')
}

export default function ContactDialog({ open, onClose, initialService }) {
  const dialogRef = useRef(null)
  const formRef = useRef(null)
  const resultRef = useRef(null)
  const id = useId()
  const [service, setService] = useState('Pentesting')
  const [brief, setBrief] = useState('')
  const [channel, setChannel] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const email = CONTACT_EMAIL.trim()
  const whatsapp = CONTACT_WHATSAPP.replace(/\D/g, '')

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) {
      setBrief('')
      setCopyStatus('')
      setService(services.includes(initialService) ? initialService : 'Pentesting')
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, initialService])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])

  useEffect(() => {
    if (brief) resultRef.current?.focus({ preventScroll: true })
  }, [brief])

  const whatsappUrl = (text) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`
  const mailUrl = (text) => `mailto:${email}?subject=${encodeURIComponent('Hablemos de mi proyecto · SECURIVA')}&body=${encodeURIComponent(text)}`

  function submit(event) {
    event.preventDefault()
    const text = buildBrief(event.currentTarget)
    const preferred = event.nativeEvent.submitter?.value || (whatsapp ? 'whatsapp' : email ? 'email' : 'brief')
    setBrief(text)
    setChannel(preferred)
    setCopyStatus('')
    if (preferred === 'whatsapp' && whatsapp) {
      window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer')
    } else if (preferred === 'email' && email) {
      window.location.href = mailUrl(text)
    }
  }

  async function copyBrief() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(brief)
      setCopyStatus('Brief copiado')
    } catch {
      const focusedElement = document.activeElement
      const textarea = document.createElement('textarea')
      textarea.value = brief
      textarea.readOnly = true
      textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;'
      dialogRef.current.append(textarea)
      textarea.select()
      let copied = false
      try { copied = document.execCommand('copy') } catch { /* The download remains available. */ }
      textarea.remove()
      focusedElement?.focus({ preventScroll: true })
      setCopyStatus(copied ? 'Brief copiado' : 'No se pudo copiar. Descarga el brief.')
    }
  }

  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'brief-securiva.txt'
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function backdropClick(event) {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="contact-dialog"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClose={() => { if (open) onClose() }}
      onClick={backdropClick}
    >
      <div className="dialog-topline">
        <span className="eyebrow">INICIEMOS UNA CONVERSACIÓN</span>
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Cerrar contacto"><X size={20} aria-hidden="true" /></button>
      </div>
      <h2 id={`${id}-title`}>La seguridad empieza<br />con una conversación.</h2>
      <p id={`${id}-description`} className="dialog-description">Cuéntanos qué necesitas proteger. El primer paso es entender tu proyecto.</p>

      <form ref={formRef} className="contact-form" onSubmit={submit} hidden={Boolean(brief)} style={brief ? { display: 'none' } : undefined}>
        <div className="form-grid">
          <label className="field" htmlFor={`${id}-name`}>
            <span>Tu nombre</span>
            <input id={`${id}-name`} name="name" autoComplete="name" placeholder="¿Cómo te llamas?" required maxLength={120} />
          </label>
          <label className="field" htmlFor={`${id}-email`}>
            <span>Correo electrónico</span>
            <input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="tu@empresa.com" required maxLength={254} />
          </label>
          <label className="field" htmlFor={`${id}-company`}>
            <span>Empresa <span className="field-optional">(opcional)</span></span>
            <input id={`${id}-company`} name="company" autoComplete="organization" placeholder="El nombre de tu empresa" maxLength={160} />
          </label>
          <label className="field" htmlFor={`${id}-service`}>
            <span>¿Qué necesitas?</span>
            <select id={`${id}-service`} name="service" value={service} onChange={(event) => setService(event.target.value)}>
              {services.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <label className="field" htmlFor={`${id}-description-field`}>
          <span>Cuéntanos sobre tu proyecto</span>
          <textarea id={`${id}-description-field`} name="description" rows={4} placeholder="Una aplicación, una API, los proyectos de tu agencia… ¿Qué te gustaría evaluar?" required minLength={10} maxLength={2000} />
        </label>
        <div className="form-actions">
          <button type="submit" name="channel" value={whatsapp ? 'whatsapp' : email ? 'email' : 'brief'} className="button button-primary">
            {whatsapp ? 'Continuar en WhatsApp' : email ? 'Continuar por correo' : 'Preparar mi brief'}
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>
          {whatsapp && email && <button type="submit" name="channel" value="email" className="button button-secondary"><Mail size={16} aria-hidden="true" /> Prefiero correo</button>}
        </div>
        <p className="form-note">{whatsapp ? 'Revisarás el mensaje en WhatsApp antes de enviarlo.' : email ? 'Revisarás el mensaje en tu aplicación de correo antes de enviarlo.' : 'Prepararemos un resumen para que puedas copiarlo o descargarlo.'}</p>
      </form>

      {brief && <div ref={resultRef} className="brief-result" aria-live="polite" tabIndex={-1}>
        <div className="brief-result-heading"><Check size={21} aria-hidden="true" /><h3>Tu brief está listo</h3></div>
        <p className="form-note">{channel === 'whatsapp' && whatsapp
          ? 'Revisarás el mensaje en WhatsApp antes de enviarlo.'
          : channel === 'email' && email
            ? 'Revisa el mensaje en tu aplicación de correo y envíalo cuando esté listo.'
            : 'Todavía no se envió. Descarga o copia tu brief para compartirlo con SECURIVA.'}</p>
        <pre className="brief-preview">{brief}</pre>
        <div className="form-actions">
          {channel === 'whatsapp' && whatsapp && <a className="button button-primary" href={whatsappUrl(brief)} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" /> Abrir WhatsApp <ArrowUpRight size={16} aria-hidden="true" /></a>}
          {channel === 'email' && email && <a className="button button-primary" href={mailUrl(brief)}><Mail size={17} aria-hidden="true" /> Abrir correo</a>}
          <button type="button" className="button button-secondary" onClick={copyBrief}>{copyStatus === 'Brief copiado' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} Copiar brief</button>
          <button type="button" className="button button-secondary" onClick={downloadBrief}><Download size={16} aria-hidden="true" /> Descargar .txt</button>
        </div>
        <p className="copy-status" role="status">{copyStatus}</p>
        <button type="button" className="brief-back" onClick={() => { setBrief(''); setCopyStatus(''); requestAnimationFrame(() => formRef.current?.querySelector('input')?.focus()) }}><ArrowLeft size={16} aria-hidden="true" /> Editar mi brief</button>
      </div>}
    </dialog>
  )
}
