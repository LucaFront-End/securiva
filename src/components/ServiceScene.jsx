import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { createServiceComposition } from '../vendor/service-scenes'
import ServiceSceneFallback from './ServiceSceneFallback'
import './ServiceScene.css'

let lightsReady = false
const descriptions = {
  pentest: 'Sistema por capas bajo inspección: el escáner revela una debilidad y vuelve a comprobarla.',
  bounty: 'Un hallazgo atraviesa una validación antes de recibir un sello de evidencia confirmada.',
  label: 'Un informe conserva su contenido técnico mientras cambia su identidad a la de tu agencia.',
}

export default function ServiceScene({ kind, active = true, progressRef, ariaLabel }) {
  const hostRef = useRef(null)
  const flagsRef = useRef({ active, progressRef })
  const wakeRef = useRef(null)
  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    let renderer, scene, camera, composition, floor, environment, pmrem, key
    let disposed = false, failed = false, visible = false, initialized = false
    let raf = 0, lastFrame = 0, time = 0, progress = 0, first = true, stamp = -1, needsPaint = true
    const framing = kind === 'bounty'
      ? { width: 6, height: 4.4, targetY: .65 }
      : kind === 'label'
        ? { width: 6.3, height: 4.8, targetY: .95 }
        : { width: 6.8, height: 5.4, targetY: 1.1 }
    const target = new THREE.Vector3(0, framing.targetY, 0)
    host.dataset.ready = 'false'
    host.dataset.running = 'false'
    const desiredProgress = () => Math.max(0, Math.min(1, Number(flagsRef.current.progressRef?.current) || 0))
    const release = () => {
      renderer?.domElement.removeEventListener('webglcontextlost', contextLost)
      composition?.dispose()
      floor?.geometry.dispose()
      floor?.material.dispose()
      key?.shadow.map?.dispose()
      environment?.dispose()
      pmrem?.dispose()
      if (renderer) {
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.domElement.remove()
      }
      renderer = composition = floor = environment = pmrem = key = undefined
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
      lastFrame = 0
      host.dataset.running = 'false'
    }
    const fail = () => {
      failed = true
      stop()
      host.dataset.ready = 'false'
      release()
    }
    function contextLost(event) { event.preventDefault(); fail() }
    const resize = () => {
      if (!renderer || !camera) return
      const width = host.clientWidth, height = host.clientHeight
      if (!width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, compact.matches ? 1.25 : 1.6, Math.max(1, Math.sqrt(1.25e6 / (width * height))))
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height, false)
      needsPaint = true
      if (!flagsRef.current.active) host.dataset.ready = 'false'
      const aspect = width / height
      const viewHeight = Math.max(framing.height, framing.width / aspect)
      Object.assign(camera, { left: -viewHeight * aspect / 2, right: viewHeight * aspect / 2, top: viewHeight / 2, bottom: -viewHeight / 2 })
      camera.updateProjectionMatrix()
    }
    const initialize = () => {
      if (initialized || failed || disposed) return
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: compact.matches ? 'low-power' : 'high-performance' })
        renderer.domElement.className = 'service-scene-canvas'
        renderer.domElement.setAttribute('aria-hidden', 'true')
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = kind === 'pentest' ? 1.08 : 1.04
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.shadowMap.autoUpdate = false
        host.appendChild(renderer.domElement)
        renderer.domElement.addEventListener('webglcontextlost', contextLost)
        scene = new THREE.Scene()
        scene.environmentIntensity = 1.1
        camera = new THREE.OrthographicCamera(-4, 4, 3, -3, .1, 50)
        camera.position.set(8, 8, 8)
        camera.lookAt(target)
        pmrem = new THREE.PMREMGenerator(renderer)
        const room = new RoomEnvironment()
        try { environment = pmrem.fromScene(room, .035) } finally { room.dispose() }
        scene.environment = environment.texture
        if (!lightsReady) { RectAreaLightUniformsLib.init(); lightsReady = true }
        const fill = new THREE.RectAreaLight(0xf5f4ef, 4.5, 6, 5)
        fill.position.set(-4, 5, 2); fill.lookAt(0, 1, 0); scene.add(fill)
        const rim = new THREE.RectAreaLight(0xaacaff, 3.2, 4, 5)
        rim.position.set(4, 4, -4); rim.lookAt(0, 1, 0); scene.add(rim)
        scene.add(new THREE.AmbientLight(0xd6e2ef, .24))
        key = new THREE.DirectionalLight(0xffffff, 3.4)
        key.position.set(-3, 8, 5)
        key.castShadow = true
        const shadowSize = compact.matches ? 512 : 1024
        key.shadow.mapSize.set(shadowSize, shadowSize)
        Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: .5, far: 22 })
        key.shadow.bias = -.0004; key.shadow.normalBias = .025
        key.shadow.autoUpdate = false
        scene.add(key)
        floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ color: 0x06101d, opacity: kind === 'pentest' ? .18 : kind === 'bounty' ? .24 : .35 }))
        floor.rotation.x = -Math.PI / 2; floor.position.y = -.06; floor.receiveShadow = true; scene.add(floor)
        composition = createServiceComposition(kind, compact.matches)
        scene.add(composition.root)
        progress = desiredProgress()
        initialized = true
        resize()
      } catch { fail() }
    }
    const tick = timestamp => {
      raf = 0
      if (disposed || failed || !visible || !flagsRef.current.active || document.hidden || !renderer) { stop(); return }
      const elapsed = timestamp - lastFrame
      if (!first && compact.matches && lastFrame && elapsed < 1000 / 30 - .5) { raf = requestAnimationFrame(tick); return }
      const delta = lastFrame ? Math.min(elapsed / 1000, .08) : 1 / 60
      lastFrame = timestamp
      time += delta
      progress = THREE.MathUtils.lerp(progress, desiredProgress(), 1 - Math.exp(-10 * delta))
      composition.update(progress, time, delta, true)
      renderer.shadowMap.needsUpdate = true
      key.shadow.needsUpdate = true
      try { renderer.render(scene, camera) } catch { fail(); return }
      if (first || needsPaint) { first = false; needsPaint = false; host.dataset.ready = 'true' }
      host.dataset.running = 'true'
      // Low-frequency diagnostics make it possible to verify continuous motion
      // without writing React state or DOM attributes on every render frame.
      const nextStamp = Math.floor(time * 4)
      if (nextStamp !== stamp) { stamp = nextStamp; host.dataset.time = time.toFixed(2); host.dataset.progress = progress.toFixed(3) }
      raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (disposed || failed || !visible || !flagsRef.current.active || document.hidden) { stop(); return }
      initialize()
      if (renderer && !raf) raf = requestAnimationFrame(tick)
    }
    wakeRef.current = wake
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake() })
    intersection.observe(host)
    const observer = new ResizeObserver(() => { resize(); wake() })
    observer.observe(host)
    document.addEventListener('visibilitychange', wake)
    compact.addEventListener('change', resize)
    return () => {
      disposed = true
      stop()
      intersection.disconnect(); observer.disconnect()
      document.removeEventListener('visibilitychange', wake)
      compact.removeEventListener('change', resize)
      wakeRef.current = null
      release()
    }
  }, [kind])
  useEffect(() => { flagsRef.current = { active, progressRef }; wakeRef.current?.() }, [active, progressRef])
  return <div ref={hostRef} className="service-scene" data-kind={kind} role="img" aria-label={ariaLabel || descriptions[kind]}>
    <div className="service-scene-fallback"><ServiceSceneFallback kind={kind}/></div>
  </div>
}
