import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seoPages } from './src/data/pageRegistry.js'

// Vercel serves /blog/article from article.html. Match that in local production QA.
const cleanPreviewUrls = {
  name:'securiva-clean-preview-urls',
  configurePreviewServer(server) {
    const paths=new Set(seoPages.map(page=>page.path))
    server.middlewares.use((request,response,next)=>{
      const url=new URL(request.url,'http://localhost')
      if (url.pathname !== '/' && paths.has(url.pathname)) request.url=url.pathname+'.html'+url.search
      next()
    })
  },
}
export default defineConfig({ plugins: [react(),cleanPreviewUrls] })
