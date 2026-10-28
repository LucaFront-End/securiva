import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// A dimensional interpretation of SECURIVA's interlocking S. All geometry and
// lighting are local: the hero never needs a remote model, texture, or service.
const SILVER_RIBBON = [
  [-0.09, 1.7], [-1.47, 0.89], [-1.47, 0.14], [-0.17, -0.63],
  [-0.17, 0.04], [-0.91, 0.48], [-0.91, 0.57], [-0.09, 1.05],
];
const BLUE_RIBBON = SILVER_RIBBON.map(([x, y]) => [-x, -y]);
const SILVER_WING = [[-1.47, -0.18], [-0.17, -0.95], [-0.17, -1.7], [-1.47, -0.93]];
const BLUE_WING = SILVER_WING.map(([x, y]) => [-x, -y]);

function FallbackSculpture() {
  return (
    <svg viewBox="-220 -240 440 480" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="sculpture-silver" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" /><stop offset=".47" stopColor="#aebbd1" />
          <stop offset="1" stopColor="#3f506b" />
        </linearGradient>
        <linearGradient id="sculpture-blue" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a4c8ff" /><stop offset=".36" stopColor="#438bff" />
          <stop offset="1" stopColor="#1642ca" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#4a6ba8" opacity=".25">
        <ellipse rx="183" ry="190" />
        <ellipse rx="214" ry="88" transform="rotate(-26)" />
      </g>
      <g transform="translate(0 -3) skewY(-6) scale(88 -88)" strokeWidth=".015">
        {[SILVER_RIBBON, SILVER_WING].map((points, i) => <polygon key={`s-${i}`} points={points.map(p => p.join(',')).join(' ')} fill="url(#sculpture-silver)" stroke="#e8f0ff" />)}
        {[BLUE_RIBBON, BLUE_WING].map((points, i) => <polygon key={`b-${i}`} points={points.map(p => p.join(',')).join(' ')} fill="url(#sculpture-blue)" stroke="#568fff" />)}
      </g>
    </svg>
  );
}

export default function SecuritySculpture({ className = '', motionEnabled = true }) {
  const rootRef = useRef(null);
  const motionEnabledRef = useRef(motionEnabled);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let renderer;
    let environment;
    let pmrem;
    let scene;
    let frame = 0;
    let stopped = false;
    let visible = true;
    let firstFrame = true;
    let scrollProgress = 0;
    let currentScroll = 0;
    let scrollStart = 0;
    let scrollRange = 1;
    let lastRenderTime = 0;
    let activeTime = 0;
    const pointer = new THREE.Vector2();
    const smoothPointer = new THREE.Vector2();
    const reducedMotion = { get matches() { return !motionEnabledRef.current; } };
    const compactMotion = window.matchMedia('(max-width: 800px), (pointer: coarse)');
    const hero = root.closest('.hero');
    const geometries = new Set();
    const materials = new Set();

    const keepGeometry = geometry => { geometries.add(geometry); return geometry; };
    const keepMaterial = material => { materials.add(material); return material; };

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compactMotion.matches ? 1.25 : 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.38;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
      root.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
      camera.position.set(0, 0.08, 10.4);
      pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      environment = pmrem.fromScene(room, 0.035);
      room.dispose();
      scene.environment = environment.texture;
      scene.environmentIntensity = 1.15;

      const sculpture = new THREE.Group();
      const emblem = new THREE.Group();
      const orbits = new THREE.Group();
      const ribbonParts = [];
      scene.add(sculpture);
      sculpture.add(emblem, orbits);

      const silver = keepMaterial(new THREE.MeshPhysicalMaterial({
        color: 0xd9e3f2, metalness: 0.96, roughness: 0.21,
        clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.6,
      }));
      const silverSide = keepMaterial(new THREE.MeshStandardMaterial({
        color: 0x6f7f99, metalness: 0.98, roughness: 0.24,
      }));
      const blue = keepMaterial(new THREE.MeshPhysicalMaterial({
        color: 0x2563eb, metalness: 0.83, roughness: 0.19,
        clearcoat: 1, clearcoatRoughness: 0.09, envMapIntensity: 1.55,
      }));
      const blueSide = keepMaterial(new THREE.MeshStandardMaterial({
        color: 0x123994, metalness: 0.9, roughness: 0.2,
      }));
      const rearMaterial = keepMaterial(new THREE.MeshStandardMaterial({
        color: 0x122033, metalness: 0.9, roughness: 0.37,
      }));
      const silverEdge = keepMaterial(new THREE.LineBasicMaterial({ color: 0xe1edff, transparent: true, opacity: 0.2 }));
      const blueEdge = keepMaterial(new THREE.LineBasicMaterial({ color: 0x81b8ff, transparent: true, opacity: 0.38 }));

      function addRibbon(points, isBlue) {
        const part = new THREE.Group();
        part.userData.direction = isBlue ? 1 : -1;
        part.userData.verticalDirection = points.reduce((sum, [, y]) => sum + y, 0) > 0 ? 1 : -1;
        ribbonParts.push(part);
        emblem.add(part);
        const shape = new THREE.Shape();
        points.forEach(([x, y], i) => i ? shape.lineTo(x, y) : shape.moveTo(x, y));
        shape.closePath();
        const geometry = keepGeometry(new THREE.ExtrudeGeometry(shape, {
          depth: 0.34, bevelEnabled: true, bevelSegments: 4,
          steps: 1, bevelSize: 0.045, bevelThickness: 0.045, curveSegments: 1,
        }));
        geometry.translate(0, 0, -0.12);
        const body = new THREE.Mesh(geometry, isBlue ? [blue, blueSide] : [silver, silverSide]);
        body.position.z = isBlue ? 0.07 : 0;
        part.add(body);

        // The separated graphite backing gives the silhouette physical depth.
        const rear = new THREE.Mesh(geometry, rearMaterial);
        rear.scale.set(1.018, 1.018, 0.55);
        rear.position.z = -0.28;
        part.add(rear);

        const edges = new THREE.LineSegments(keepGeometry(new THREE.EdgesGeometry(geometry, 28)), isBlue ? blueEdge : silverEdge);
        edges.position.copy(body.position);
        part.add(edges);
      }

      addRibbon(SILVER_RIBBON, false);
      addRibbon(SILVER_WING, false);
      addRibbon(BLUE_RIBBON, true);
      addRibbon(BLUE_WING, true);

      const ringMaterial = keepMaterial(new THREE.LineBasicMaterial({ color: 0x6e94ce, opacity: 0.21, transparent: true }));
      const accentMaterial = keepMaterial(new THREE.LineBasicMaterial({ color: 0x3e88ff, opacity: 0.65, transparent: true }));
      const faintMaterial = keepMaterial(new THREE.LineBasicMaterial({ color: 0x7c94b6, opacity: 0.1, transparent: true }));

      function arc(radius, from, to, material, rotation, z = -0.7) {
        const points = [];
        for (let i = 0; i <= 160; i++) {
          const theta = from + (to - from) * i / 160;
          points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
        }
        const line = new THREE.Line(keepGeometry(new THREE.BufferGeometry().setFromPoints(points)), material);
        line.rotation.set(...rotation);
        line.position.z = z;
        orbits.add(line);
        return line;
      }

      arc(2.25, 0, Math.PI * 2, ringMaterial, [0.12, -0.06, 0]);
      arc(2.35, 0, Math.PI * 2, faintMaterial, [0.12, -0.06, 0]);
      arc(2.68, 0, Math.PI * 2, ringMaterial, [1.1, 0.3, -0.45], -0.05);
      arc(2.25, 0.06, 0.39, accentMaterial, [0.12, -0.06, 0]);
      arc(2.25, Math.PI + 0.06, Math.PI + 0.39, accentMaterial, [0.12, -0.06, 0]);

      const ticks = [];
      for (let i = 0; i < 72; i++) {
        const a = i / 72 * Math.PI * 2;
        const r = 2.27;
        const length = i % 6 === 0 ? 0.075 : 0.028;
        ticks.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, -0.72));
        ticks.push(new THREE.Vector3(Math.cos(a) * (r + length), Math.sin(a) * (r + length), -0.72));
      }
      orbits.add(new THREE.LineSegments(keepGeometry(new THREE.BufferGeometry().setFromPoints(ticks)), faintMaterial));

      const markerGeometry = keepGeometry(new THREE.SphereGeometry(0.026, 12, 12));
      const markerMaterial = keepMaterial(new THREE.MeshBasicMaterial({ color: 0x83bdff }));
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      orbits.add(marker);

      scene.add(new THREE.AmbientLight(0xd1e0ff, 0.3));
      const key = new THREE.DirectionalLight(0xffffff, 5);
      key.position.set(-3.5, 5, 5);
      scene.add(key);
      const blueLight = new THREE.PointLight(0x2165ff, 36, 12, 2);
      blueLight.position.set(3.5, -0.5, 3);
      scene.add(blueLight);
      const rim = new THREE.DirectionalLight(0x699fff, 3);
      rim.position.set(-3, -2, -1);
      scene.add(rim);
      const top = new THREE.DirectionalLight(0xffffff, 1.7);
      top.position.set(1, 4, -2);
      scene.add(top);

      function draw(timestamp) {
        frame = 0;
        if (stopped || !visible || document.hidden) return;
        const still = reducedMotion.matches;
        const compact = compactMotion.matches;
        // Coarse pointers and narrow screens share a smaller pixel budget and
        // never submit more than 30 WebGL frames per second to the GPU.
        const elapsed = timestamp - lastRenderTime;
        if (!firstFrame && !still && compact && lastRenderTime && elapsed < 1000 / 30) {
          frame = window.requestAnimationFrame(draw);
          return;
        }
        const delta = lastRenderTime ? Math.min(elapsed / 1000, 0.08) : 1 / 60;
        lastRenderTime = timestamp;
        if (!still) activeTime += delta;
        const t = still ? 0 : activeTime;
        const blend = firstFrame || still ? 1 : 1 - Math.exp(-6.5 * delta);
        currentScroll = THREE.MathUtils.lerp(currentScroll, still ? 0 : scrollProgress, blend);
        smoothPointer.lerp(pointer, blend);
        const p = THREE.MathUtils.smoothstep(currentScroll, 0, 1);
        const amplitude = compact ? 0.28 : 1;

        // The emblem opens as the visitor leaves the hero, while the orbital
        // plane counter-rotates. The silhouette remains recognisable throughout.
        sculpture.rotation.x = 0.11 + smoothPointer.y * 0.09 + p * 0.3 * amplitude;
        sculpture.rotation.y = -0.27 + smoothPointer.x * 0.2 + p * 1.05 * amplitude;
        sculpture.rotation.z = -0.055 + Math.sin(t * 0.19) * 0.023 - p * 0.13 * amplitude;
        sculpture.position.y = Math.sin(t * 0.48) * (compact ? 0.025 : 0.06) + p * 0.14 * amplitude;
        const scale = 1 + Math.sin(p * Math.PI) * 0.065 * amplitude - p * 0.075 * amplitude;
        sculpture.scale.setScalar(scale);
        ribbonParts.forEach(part => {
          part.position.x = part.userData.direction * p * 0.11 * amplitude;
          part.position.y = part.userData.verticalDirection * p * 0.08 * amplitude;
          part.position.z = part.userData.direction * p * 0.24 * amplitude;
        });
        orbits.rotation.z = t * 0.018 - p * 0.55 * amplitude;
        orbits.rotation.x = p * 0.2 * amplitude;
        orbits.scale.setScalar(1 + p * 0.045 * amplitude);
        ringMaterial.opacity = 0.21 - p * 0.055 * amplitude;
        accentMaterial.opacity = 0.65 + Math.sin(p * Math.PI) * 0.18 * amplitude;
        blueLight.position.set(3.5 - p * 2 * amplitude, -0.5 + p * 2.2 * amplitude, 3);
        const theta = t * 0.12 + 1.3;
        marker.position.set(Math.cos(theta) * 2.25, Math.sin(theta) * 2.25, -0.65);
        try {
          renderer.render(scene, camera);
        } catch {
          stopped = true;
          renderer.domElement.style.visibility = 'hidden';
          setReady(false);
          return;
        }
        if (firstFrame) { firstFrame = false; setReady(true); }
        if (!still) frame = window.requestAnimationFrame(draw);
      }

      function requestDraw() {
        if (!frame && !stopped && visible && !document.hidden) frame = window.requestAnimationFrame(draw);
      }

      function resize() {
        const { width, height } = root.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compactMotion.matches ? 1.25 : 1.75));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Fit the full orbit on tall screens without cropping the sculpture.
        camera.position.z = camera.aspect < 0.8 ? 10.4 / Math.max(camera.aspect / 0.8, 0.65) : 10.4;
        camera.updateProjectionMatrix();
        const anchor = compactMotion.matches ? root : (hero || root);
        scrollStart = anchor.getBoundingClientRect().top + window.scrollY - (compactMotion.matches ? window.innerHeight * 0.5 : 0);
        scrollRange = Math.max(height * (compactMotion.matches ? 1.1 : 0.95), window.innerHeight * 0.72);
        scroll();
        requestDraw();
      }

      function move(event) {
        if (reducedMotion.matches || compactMotion.matches) return;
        const bounds = root.getBoundingClientRect();
        pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      }
      function leave() { pointer.set(0, 0); }
      function scroll() {
        if (!reducedMotion.matches) scrollProgress = THREE.MathUtils.clamp((window.scrollY - scrollStart) / scrollRange, 0, 1);
      }
      function visibility() {
        if (document.hidden && frame) { window.cancelAnimationFrame(frame); frame = 0; lastRenderTime = 0; }
        else requestDraw();
      }
      function motionChanged() {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        lastRenderTime = 0;
        activeTime = 0;
        pointer.set(0, 0);
        smoothPointer.set(0, 0);
        scrollProgress = 0;
        if (!reducedMotion.matches) scroll();
        requestDraw();
      }
      function qualityChanged() {
        pointer.set(0, 0);
        smoothPointer.set(0, 0);
        lastRenderTime = 0;
        resize();
      }

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(root);
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (!visible && frame) { window.cancelAnimationFrame(frame); frame = 0; lastRenderTime = 0; }
        if (visible) requestDraw();
      }, { rootMargin: '100px' });
      intersectionObserver.observe(root);
      root.addEventListener('pointermove', move, { passive: true });
      root.addEventListener('pointerleave', leave);
      window.addEventListener('scroll', scroll, { passive: true });
      document.addEventListener('visibilitychange', visibility);
      root.addEventListener('securiva-motion-change', motionChanged);
      compactMotion.addEventListener('change', qualityChanged);

      function contextLost(event) {
        event.preventDefault();
        stopped = true;
        if (frame) window.cancelAnimationFrame(frame);
        renderer.domElement.style.visibility = 'hidden';
        setReady(false);
      }
      renderer.domElement.addEventListener('webglcontextlost', contextLost);
      resize();

      return () => {
        stopped = true;
        window.cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        root.removeEventListener('pointermove', move);
        root.removeEventListener('pointerleave', leave);
        window.removeEventListener('scroll', scroll);
        document.removeEventListener('visibilitychange', visibility);
        root.removeEventListener('securiva-motion-change', motionChanged);
        compactMotion.removeEventListener('change', qualityChanged);
        renderer.domElement.removeEventListener('webglcontextlost', contextLost);
        geometries.forEach(geometry => geometry.dispose());
        materials.forEach(material => material.dispose());
        environment.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };
    } catch {
      setReady(false);
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      environment?.dispose();
      pmrem?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer?.domElement.remove();
      return undefined;
    }
  }, []);

  // The user's explicit choice updates the running scene without recreating its
  // renderer, geometry, or GPU context. The parent resolves the OS default.
  useEffect(() => {
    motionEnabledRef.current = motionEnabled;
    rootRef.current?.dispatchEvent(new Event('securiva-motion-change'));
  }, [motionEnabled]);

  return (
    <div
      ref={rootRef}
      className={`security-sculpture ${className}`.trim()}
      role="img"
      aria-label="Escultura tridimensional del símbolo SECURIVA en metal y azul eléctrico"
      style={{ position: 'relative', width: '100%', height: '100%', minHeight: 0, isolation: 'isolate' }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: '7%', borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(37,99,235,.12) 0%,rgba(37,99,235,.025) 45%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: ready ? 0 : 1, transition: 'opacity .4s', pointerEvents: 'none' }}>
        <FallbackSculpture />
      </div>
    </div>
  );
}
