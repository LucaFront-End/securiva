import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { createSecurityComposition } from '../vendor/isometric-scene';
import { createProcessComposition } from '../vendor/process-scene';
import { SECURITY_PHASES } from '../vendor/security-choreography';
import './IsometricSecurity.css';

let areaLightsReady = false;

function StaticArchitecture({ stage, evidence }) {
  const risk = stage === 1 || stage === 2;
  if (evidence) return (
    <svg className="isometric-fallback" viewBox="0 0 780 520" aria-hidden="true">
      <ellipse cx="390" cy="390" rx="227" ry="42" fill="#252c35" opacity=".09" />
      <path d="m155 265 240-132 241 133v27L395 430 155 293Z" fill="#29323e" />
      <path d="m170 253 226-121 225 121-226 127Z" fill="#bfc7cd" />
      <path d="m185 235 211-112 211 112-211 117Z" fill="#f1f0eb" stroke="#c6cbd0" />
      <path d="m247 227 123-67M273 242l123-67M298 258l123-67" stroke="#8c99a8" strokeWidth="5" />
      <path d="m323 295 45-25 45 25-45 26Z" fill="#2563eb" />
      <path d="m402 251 45-25 45 25-45 26Z" fill="#2563eb" />
      <path d="m482 207 45-25 45 25-45 26Z" fill={risk ? '#ed725a' : '#2563eb'} />
      <text x="394" y="118" textAnchor="middle" fill="#415268" fontSize="16" fontFamily="monospace">EVIDENCIA</text>
    </svg>
  );
  return (
    <svg className="isometric-fallback" viewBox="0 0 780 520" aria-hidden="true">
      <defs>
        <linearGradient id="iso-static-top" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#444f5d" /><stop offset="1" stopColor="#232c39" /></linearGradient>
        <linearGradient id="iso-static-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e2e7e9" /><stop offset="1" stopColor="#8b99aa" /></linearGradient>
      </defs>
      <ellipse cx="396" cy="411" rx="286" ry="52" fill="#263445" opacity=".1" />
      <path d="m80 275 303-152 316 156v28L395 463 80 304Z" fill="#202936" />
      <path d="m80 275 303-152 316 156-304 155Z" fill="url(#iso-static-top)" stroke="#8f9cae" strokeWidth="4" />
      <path d="m111 273 274-135 282 140-272 138Z" fill="none" stroke="#5087e9" strokeWidth="2" />
      <path d="m225 312 90-46 76 39 103-53M393 398v-63l-2-30" fill="none" stroke="#2563eb" strokeWidth="5" />
      <path d="m393 398v-63l-2-30" fill="none" stroke={risk ? '#ed725a' : '#2563eb'} strokeWidth="4" />
      <g transform="translate(165 186)">
        <path d="m0 23 111-57 73 36v91L72 151 0 114Z" fill="url(#iso-static-metal)" />
        <path d="m9 29 103-53 62 30v78L72 138 9 107Z" fill="#111d2e" />
        <path d="m25 46 62-31M25 63l43-22M25 85l28-14M80 79l68-34" stroke="#6983a4" strokeWidth="5" />
        <path d="m94 101 55-28V47L94 75Z" fill="#2563eb" />
        <path d="m66 152 28-14v30l-28 14Z" fill="#a6b2c1" />
        <path d="m35 187 40-21 43 22-40 21Z" fill="#9dabbc" />
      </g>
      <g transform={`translate(342 ${stage === 2 ? 192 : 214})`}>
        {[52, 26, 0].map((y, i) => <g key={y} transform={`translate(0 ${y + (stage === 2 ? i * -12 : 0)})`}><path d="m0 26 60-30 66 33v20L61 81 0 51Z" fill={i === 1 ? '#a4b0c0' : '#222e3f'} /><path d="m0 26 60-30 66 33-65 31Z" fill="url(#iso-static-metal)" /><path d="m14 48 38 18" stroke="#3f83ff" strokeWidth="3" /></g>)}
        {risk && <path d="m54 37 13-7 13 7v15l-13 7-13-7Z" fill="#ed725a" />}
      </g>
      <g transform="translate(504 145)">
        <path d="m0 23 50-26 62 31v147l-61 31L0 180Z" fill="#1a2533" />
        <path d="m0 23 50-26 62 31-61 28Z" fill="url(#iso-static-metal)" />
        {[66, 103, 140].map(y => <g key={y}><path d={`m12 ${y} 31 15v22l-31-15Z`} fill="#334155" /><path d={`m17 ${y + 5} 1 16`} stroke="#3c88ff" strokeWidth="4" /></g>)}
      </g>
      <g fill="#5a6b80" fontFamily="monospace" fontSize="13" textAnchor="middle"><text x="224" y="416">WEB</text><text x="393" y="453">API</text><text x="570" y="376">DATOS</text></g>
      {stage === 3 && <g transform="translate(439 286)"><rect x="-14" y="-14" width="28" height="28" rx="5" fill="#2563eb" /><path d="m-7 0 5 5L8-6" fill="none" stroke="white" strokeWidth="3" /></g>}
    </svg>
  );
}

export default function IsometricSecurity({ motionEnabled = true, stage = 0, progressRef, variant = 'architecture', className = '', fallback, ariaLabel }) {
  const rootRef = useRef(null);
  const requestRef = useRef(null);
  const flagsRef = useRef({ motionEnabled, stage, progressRef });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const process = variant === 'process';
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const pointer = new THREE.Vector2();
    const smoothPointer = new THREE.Vector2();
    const target = new THREE.Vector3(0, process ? 1.5 : variant === 'evidence' ? 0.5 : 0.83, 0);
    let renderer;
    let scene;
    let camera;
    let composition;
    let environment;
    let pmrem;
    let shadowFloor;
    let key;
    let initialized = false;
    let disposed = false;
    let failed = false;
    let visible = false;
    let firstFrame = true;
    let frame = 0;
    let lastTime = 0;
    let time = 0;
    let dirty = true;
    let renderedProgress = 0;
    let progressStamp = '';
    let cameraX = Number.NaN;
    let cameraY = Number.NaN;
    const targetProgress = () => {
      const flags = flagsRef.current;
      const value = flags.progressRef?.current ?? SECURITY_PHASES[flags.stage] ?? 0;
      return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
    };
    root.dataset.ready = 'false';

    const disposeGPU = () => {
      renderer?.domElement.removeEventListener('webglcontextlost', loseContext);
      composition?.dispose();
      shadowFloor?.geometry.dispose();
      shadowFloor?.material.dispose();
      key?.shadow.map?.dispose();
      environment?.dispose();
      pmrem?.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      }
      renderer = undefined;
      composition = undefined;
      shadowFloor = undefined;
      environment = undefined;
      pmrem = undefined;
      key = undefined;
    };
    const fail = () => {
      failed = true;
      window.cancelAnimationFrame(frame);
      frame = 0;
      root.dataset.ready = 'false';
      disposeGPU();
    };
    function loseContext(event) {
      event.preventDefault();
      fail();
    }

    const resize = () => {
      if (!renderer || !camera) return;
      const width = root.clientWidth;
      const height = root.clientHeight;
      if (!width || !height) return;
      const pixelCap = 1.9e6;
      const budgetDpr = Math.sqrt(pixelCap / (width * height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact.matches ? 1.25 : 1.65, Math.max(1, budgetDpr)));
      renderer.setSize(width, height, false);
      const aspect = width / height;
      const viewWidth = process ? 7.25 : variant === 'evidence' ? 7.1 : 10.2;
      const viewHeight = Math.max(process ? 6 : variant === 'evidence' ? 5.2 : 6.55, viewWidth / aspect);
      camera.left = -viewHeight * aspect / 2;
      camera.right = viewHeight * aspect / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      dirty = true;
    };

    const initialize = () => {
      if (initialized || failed || disposed) return;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !compact.matches, powerPreference: compact.matches ? 'low-power' : 'high-performance' });
        renderer.domElement.className = 'isometric-security-canvas';
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.setClearColor(process ? 0x141619 : 0xeae9e7, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = process ? 1.02 : 1.14;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.autoUpdate = false;
        root.appendChild(renderer.domElement);
        renderer.domElement.addEventListener('webglcontextlost', loseContext);

        scene = new THREE.Scene();
        scene.environmentIntensity = process ? 1.15 : 0.85;
        camera = new THREE.OrthographicCamera(-5, 5, 4, -4, 0.1, 80);
        camera.position.set(8, 8, 8);
        camera.lookAt(target);
        pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        try { environment = pmrem.fromScene(room, 0.035); } finally { room.dispose(); }
        scene.environment = environment.texture;

        if (!areaLightsReady) { RectAreaLightUniformsLib.init(); areaLightsReady = true; }
        const fill = new THREE.RectAreaLight(process ? 0xe8efff : 0xf7f4ed, process ? 5 : 3.2, 7, 5);
        fill.position.set(-4, 5, 1);
        fill.lookAt(0, 1, 0);
        scene.add(fill);
        const rim = new THREE.RectAreaLight(0x7da7ff, process ? 4 : 2.8, 5, 3);
        rim.position.set(4, 4, -4);
        rim.lookAt(0, 1, 0);
        scene.add(rim);
        scene.add(new THREE.AmbientLight(0xc4d2e5, process ? 0.26 : 0.36));
        key = new THREE.DirectionalLight(0xffffff, process ? 3.5 : 4.4);
        key.position.set(-3, 9, 5);
        key.castShadow = true;
        const shadowSize = process ? compact.matches ? 512 : 1024 : compact.matches ? 1024 : 2048;
        key.shadow.mapSize.set(shadowSize, shadowSize);
        Object.assign(key.shadow.camera, { left: -8, right: 8, top: 7, bottom: -7, near: 0.5, far: 28 });
        key.shadow.bias = -0.00035;
        key.shadow.normalBias = 0.022;
        key.shadow.autoUpdate = false;
        scene.add(key);

        shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ color: process ? 0x000000 : 0x3b4350, opacity: process ? 0.42 : 0.2 }));
        shadowFloor.rotation.x = -Math.PI / 2;
        shadowFloor.position.y = -0.09;
        shadowFloor.receiveShadow = true;
        scene.add(shadowFloor);
        composition = process ? createProcessComposition(compact.matches) : createSecurityComposition(variant, compact.matches);
        scene.add(composition.root);
        renderedProgress = targetProgress();
        composition.update(renderedProgress, 0, 1 / 60, false);
        initialized = true;
        resize();
      } catch {
        fail();
      }
    };

    const renderFrame = timestamp => {
      frame = 0;
      if (disposed || failed || !visible || document.hidden || !renderer) return;
      const moving = flagsRef.current.motionEnabled;
      const elapsed = timestamp - lastTime;
      if (!firstFrame && moving && compact.matches && lastTime && elapsed < 1000 / 30 - 0.5) {
        frame = window.requestAnimationFrame(renderFrame);
        return;
      }
      const delta = lastTime ? Math.min(elapsed / 1000, 0.1) : 1 / 60;
      lastTime = timestamp;
      if (moving) time += delta;
      const nextProgress = targetProgress();
      // Smooth the scalar once. Geometry samples this same continuous timeline,
      // so reversing scroll retraces the exact same poses instead of tweening
      // independently towards the last chapter that happened to be selected.
      renderedProgress = moving
        ? THREE.MathUtils.lerp(renderedProgress, nextProgress, 1 - Math.exp(-12 * delta))
        : nextProgress;
      if (Math.abs(nextProgress - renderedProgress) < 0.00005) renderedProgress = nextProgress;
      const stamp = renderedProgress.toFixed(4);
      if (stamp !== progressStamp) {
        root.dataset.progress = stamp;
        progressStamp = stamp;
      }
      const blend = moving ? 1 - Math.exp(-7 * delta) : 1;
      if (!moving || !fine.matches) pointer.set(0, 0);
      smoothPointer.lerp(pointer, blend);
      const cameraChanged = !Number.isFinite(cameraX)
        || Math.abs(smoothPointer.x - cameraX) + Math.abs(smoothPointer.y - cameraY) > 0.00001;
      if (cameraChanged) {
        cameraX = smoothPointer.x;
        cameraY = smoothPointer.y;
        camera.position.set(8 + cameraX * 0.32, 8 - cameraY * 0.18, 8 - cameraX * 0.2);
        camera.lookAt(target);
      }
      const changed = composition.update(renderedProgress, time, delta, moving);
      const shadowsChanged = dirty || changed || firstFrame;
      renderer.shadowMap.needsUpdate = shadowsChanged;
      key.shadow.needsUpdate = shadowsChanged;
      // Keep listening to scroll every frame, but leave the GPU idle when the
      // visible pose and camera have settled. No toggle or delayed reactivation.
      if (shadowsChanged || cameraChanged) {
        try { renderer.render(scene, camera); } catch { fail(); return; }
      }
      dirty = false;
      if (firstFrame) { firstFrame = false; root.dataset.ready = 'true'; }
      if (moving) frame = window.requestAnimationFrame(renderFrame);
    };

    const requestRender = () => {
      if (disposed || failed || !visible || document.hidden) return;
      initialize();
      if (!failed && !frame) frame = window.requestAnimationFrame(renderFrame);
    };
    requestRef.current = () => {
      dirty = true;
      requestRender();
    };

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestRender();
      else { window.cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    }, { rootMargin: '80px' });
    intersection.observe(root);
    const resizeObserver = new ResizeObserver(() => { resize(); requestRender(); });
    resizeObserver.observe(root);
    const visibilityChanged = () => {
      if (document.hidden) { window.cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
      else requestRender();
    };
    const qualityChanged = () => { resize(); requestRender(); };
    const move = event => {
      if (!flagsRef.current.motionEnabled || !fine.matches || event.pointerType === 'touch') return;
      const bounds = root.getBoundingClientRect();
      pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
    };
    const leave = () => pointer.set(0, 0);
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibilityChanged);
    compact.addEventListener('change', qualityChanged);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibilityChanged);
      compact.removeEventListener('change', qualityChanged);
      requestRef.current = null;
      disposeGPU();
      root.dataset.ready = 'false';
    };
  }, [variant]);

  useEffect(() => {
    flagsRef.current = { motionEnabled, stage: Math.max(0, Math.min(3, Number(stage) || 0)), progressRef };
    requestRef.current?.();
  }, [motionEnabled, stage, progressRef]);

  return (
    <div
      ref={rootRef}
      className={`isometric-security ${variant === 'process' ? 'isometric-process' : variant === 'evidence' ? 'isometric-evidence' : ''} ${className}`.trim()}
      data-stage={stage}
      data-motion={motionEnabled ? 'on' : 'off'}
      role="img"
      aria-label={ariaLabel ?? (variant === 'process' ? 'Modelo ilustrativo del proceso de seguridad: alcance, investigación, evidencia y verificación' : variant === 'evidence' ? 'Modelo ilustrativo de un informe técnico con hallazgos y evidencia' : 'Modelo ilustrativo de una aplicación web conectada a una API y un servidor de datos dentro de un perímetro de seguridad')}
    >
      {fallback ? <div className="isometric-fallback">{fallback}</div> : variant !== 'process' && <StaticArchitecture stage={Number(stage)} evidence={variant === 'evidence'} />}
    </div>
  );
}
