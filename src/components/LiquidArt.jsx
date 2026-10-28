import { useEffect, useRef } from 'react';
import { LiquidEngine } from '../vendor/liquid-particles';
import './LiquidArt.css';

const IMAGE = '/art/liquid-sculpture.webp';
const ASPECT = 1983 / 793;
const BACKGROUND = [234 / 255, 233 / 255, 231 / 255];

function options(compact) {
  return {
    interactive: true,
    strength: compact ? 0.65 : 0.95,
    radius: compact ? 135 : 205,
    density: compact ? 0.24 : 0.58,
    dotSize: compact ? 1.06 : 0.95,
    spread: compact ? 0.65 : 0.9,
    turbulence: compact ? 0.45 : 0.75,
    returnSpeed: 1.25,
    streaks: true,
    restStyle: 'image',
    ambient: true,
    ambientIntensity: compact ? 0.16 : 0.24,
    speed: 0.9,
    intro: !compact,
    reducedMotion: false,
    bg: BACKGROUND,
    imgBg: null,
    liquid: compact ? 0.45 : 0.8,
  };
}

/**
 * Visual-only adaptation of Liquid Sculpture Hero by Guglielmo Giannattasio.
 * Original MIT engine and attribution: ../vendor/liquid-particles.ts.
 * The parent owns copy, layout, scroll choreography and the motion preference.
 */
export default function LiquidArt({ motionEnabled = true, className = '' }) {
  const rootRef = useRef(null);
  const imageRef = useRef(null);
  const engineRef = useRef(null);
  const layoutRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    if (!root || !image) return undefined;
    let resizeFrame = 0;

    const layout = () => {
      resizeFrame = 0;
      const width = root.clientWidth;
      const height = root.clientHeight;
      if (!width || !height) return;
      // A wide, continuous object on desktop; the central aperture fills the
      // portrait art area on phones rather than shrinking into a tiny stripe.
      const artWidth = width < 768
        ? Math.max(width * 1.9, height * ASPECT * 0.98)
        : Math.min(width * 1.08, height * ASPECT * 1.18);
      const artHeight = artWidth / ASPECT;
      const rect = { x: (width - artWidth) / 2, y: (height - artHeight) / 2, w: artWidth, h: artHeight };
      image.style.left = `${rect.x}px`;
      image.style.top = `${rect.y}px`;
      image.style.width = `${rect.w}px`;
      image.style.height = `${rect.h}px`;
      engineRef.current?.resize(width, height, rect);
    };
    layoutRef.current = layout;
    layout();
    const observer = new ResizeObserver(() => {
      if (!resizeFrame) resizeFrame = window.requestAnimationFrame(layout);
    });
    observer.observe(root);
    image.addEventListener('load', layout);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(resizeFrame);
      image.removeEventListener('load', layout);
      layoutRef.current = null;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    if (!root || !image) return undefined;
    root.dataset.ready = 'false';
    // With motion off, the original image is the complete experience: no GPU
    // context, simulation, pointer listeners or animation loop are allocated.
    if (!motionEnabled) return undefined;

    const canvas = document.createElement('canvas');
    canvas.className = 'liquid-art-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    root.appendChild(canvas);
    const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    let engine;
    let disposed = false;
    let failed = false;
    const bounds = root.getBoundingClientRect();
    let inView = bounds.bottom > -80 && bounds.top < window.innerHeight + 80;

    const fail = () => {
      if (disposed) return;
      failed = true;
      root.dataset.ready = 'false';
      engine?.destroy();
      if (engineRef.current === engine) engineRef.current = null;
      canvas.remove();
    };
    try {
      engine = new LiquidEngine(canvas, options(compact.matches), fail);
      engineRef.current = engine;
      engine.setVisible(inView && !document.hidden);
      layoutRef.current?.();
    } catch {
      fail();
    }

    const loadImage = () => {
      if (disposed || failed || !engine || !image.naturalWidth) return;
      engine.onFirstFrame = () => {
        if (!disposed && !failed) root.dataset.ready = 'true';
      };
      try {
        layoutRef.current?.();
        engine.setImage(image);
        layoutRef.current?.();
      } catch {
        fail();
      }
    };
    if (image.complete && image.naturalWidth) loadImage();
    else image.addEventListener('load', loadImage, { once: true });

    const updateVisibility = () => {
      if (!failed) engine?.setVisible(inView && !document.hidden);
    };
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateVisibility();
    }, { rootMargin: '80px' });
    intersection.observe(root);
    document.addEventListener('visibilitychange', updateVisibility);

    const changeQuality = () => {
      if (failed || !engine) return;
      engine.setCompact(compact.matches);
      engine.setOptions(options(compact.matches));
      layoutRef.current?.();
    };
    compact.addEventListener('change', changeQuality);

    const position = event => {
      const rect = root.getBoundingClientRect();
      return [event.clientX - rect.left, event.clientY - rect.top];
    };
    const sendPointer = (type, event) => {
      if (disposed || failed || !engine) return;
      const touch = event.pointerType === 'touch';
      if (type === 'move' && touch && event.buttons === 0 && event.pressure === 0) return;
      const [x, y] = position(event);
      engine.pointer(type, x, y, touch);
    };
    const move = event => sendPointer('move', event);
    const down = event => sendPointer('down', event);
    const up = event => sendPointer('up', event);
    const leave = event => sendPointer('leave', event);
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerdown', down, { passive: true });
    root.addEventListener('pointerup', up, { passive: true });
    root.addEventListener('pointercancel', up, { passive: true });
    root.addEventListener('pointerleave', leave, { passive: true });

    return () => {
      disposed = true;
      intersection.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
      compact.removeEventListener('change', changeQuality);
      image.removeEventListener('load', loadImage);
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerdown', down);
      root.removeEventListener('pointerup', up);
      root.removeEventListener('pointercancel', up);
      root.removeEventListener('pointerleave', leave);
      engine?.destroy();
      if (engineRef.current === engine) engineRef.current = null;
      canvas.remove();
      root.dataset.ready = 'false';
    };
  }, [motionEnabled]);

  return (
    <div ref={rootRef} className={`liquid-art ${className}`.trim()} data-motion={motionEnabled ? 'on' : 'off'} aria-hidden="true">
      <img ref={imageRef} className="liquid-art-image" src={IMAGE} alt="" width="1983" height="793" decoding="async" fetchPriority="high" draggable="false" />
    </div>
  );
}
