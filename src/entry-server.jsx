import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { Writable } from 'node:stream'
import App from './App.jsx'

export function render(pathname = '/') {
  return new Promise((resolve, reject) => {
    let html = ''
    let failed = false
    const destination = new Writable({
      write(chunk, _encoding, next) { html += chunk.toString(); next() },
    })
    destination.on('finish', () => { if (!failed) resolve(html) })
    destination.on('error', reject)
    const stream = renderToPipeableStream(<React.StrictMode><App path={pathname} /></React.StrictMode>, {
      onAllReady() { if (!failed) stream.pipe(destination) },
      onShellError(error) { failed = true; reject(error) },
      onError(error) { failed = true; reject(error) },
    })
  })
}
