import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource/jetbrains-mono/latin-400.css'
import App from './App.jsx'
import './editorial.css'

const root = document.getElementById('root')
const app = <React.StrictMode><App path={window.location.pathname}/></React.StrictMode>
if (root.childElementCount > 0) hydrateRoot(root, app)
else createRoot(root).render(app)
