export function editorialDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const date=new Date(value+'T00:00:00.000Z')
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0,10)!==value) return undefined
  return new Intl.DateTimeFormat('es',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date)
}
