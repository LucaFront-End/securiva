import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function useEditorialMotion(root, enabled) {
  useLayoutEffect(() => {
    const el=root.current
    if(!el) return
    const documentRoot=document.documentElement
    const previousMotion=documentRoot.getAttribute('data-motion')
    documentRoot.setAttribute('data-motion',enabled?'full':'reduced')
    const restore=()=>{if(previousMotion===null) documentRoot.removeAttribute('data-motion');else documentRoot.setAttribute('data-motion',previousMotion)}
    if(!enabled) return restore
    const ctx=gsap.context(()=>{
      gsap.from('.cover-title > span',{opacity:0,duration:1.1,stagger:.12,ease:'power3.out',clearProps:'opacity'})
      gsap.from('.cover-kicker,.cover-bottom',{opacity:0,y:12,delay:.3,duration:.8,clearProps:'transform,opacity'})
      gsap.to('.title-first',{xPercent:-8,ease:'none',scrollTrigger:{trigger:'.cover',start:'top top',end:'bottom top',scrub:.6}})
      gsap.to('.title-last',{xPercent:8,ease:'none',scrollTrigger:{trigger:'.cover',start:'top top',end:'bottom top',scrub:.6}})
      gsap.to('.cover-art',{yPercent:18,scale:1.13,rotation:5,ease:'none',scrollTrigger:{trigger:'.cover',start:'top top',end:'bottom top',scrub:.6}})
      el.querySelectorAll('[data-reveal]:not(.ar-report-scene):not(.cp-pass-slot):not(.conversation h2)').forEach(item=>gsap.from(item,{y:28,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 94%',once:true},clearProps:'transform,opacity'}))
      gsap.to('.contact-star',{rotation:90,ease:'none',scrollTrigger:{trigger:'.conversation',start:'top bottom',end:'bottom top',scrub:.6}})
      gsap.fromTo('.conversation h2',{xPercent:-4},{xPercent:2,ease:'none',scrollTrigger:{trigger:'.conversation',start:'top bottom',end:'bottom top',scrub:.6}})
    },el)
    let disposed=false
    const refresh=()=>{if(!disposed) ScrollTrigger.refresh()}
    document.fonts?.ready.then(refresh)
    const timer=setTimeout(refresh,1000)
    window.addEventListener('load',refresh)
    return()=>{disposed=true;clearTimeout(timer);window.removeEventListener('load',refresh);ctx.revert();restore()}
  },[enabled,root])
}
