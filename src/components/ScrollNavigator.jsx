import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollNavigator.css';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'enfoque', label: 'Enfoque' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'agencias', label: 'Agencias' },
  { id: 'metodologia', label: 'Metodología' },
  { id: 'nosotros', label: 'Nosotros' },
];

export default function ScrollNavigator() {
  const progressRef = useRef(null);
  const activeRef = useRef('inicio');
  const [active, setActive] = useState('inicio');

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return undefined;

    const activate = id => {
      if (activeRef.current === id) return;
      activeRef.current = id;
      setActive(id);
    };

    const elements = sections
      .map(section => ({ ...section, element: document.getElementById(section.id) }))
      .filter(section => section.element);

    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
    const setProgress = gsap.quickSetter(progress, 'scaleX');
    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: () => Math.max(1, ScrollTrigger.maxScroll(window)),
      onUpdate: self => setProgress(self.progress),
      onRefresh: self => setProgress(self.progress),
    });

    const sectionTriggers = elements.map(({ id, element }) => ScrollTrigger.create({
      trigger: element,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => activate(id),
      onEnterBack: () => activate(id),
    }));

    // Also covers restored scroll positions, hash navigation and the gaps
    // between sections, without sampling React state on every scroll frame.
    const refreshActive = () => {
      let current = elements[0]?.id;
      const readingLine = window.innerHeight * 0.4;
      elements.forEach(({ id, element }) => {
        if (element.getBoundingClientRect().top <= readingLine) current = id;
      });
      if (current) activate(current);
    };
    refreshActive();
    setProgress(progressTrigger.progress);
    ScrollTrigger.addEventListener('refresh', refreshActive);

    return () => {
      progressTrigger.kill();
      sectionTriggers.forEach(trigger => trigger.kill());
      ScrollTrigger.removeEventListener('refresh', refreshActive);
      gsap.set(progress, { clearProps: 'transform,transformOrigin' });
    };
  }, []);

  return (
    <>
      <div className="scroll-reading-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <nav className="scroll-navigator" aria-label="Recorrer la página">
        <ol>
          {sections.map(({ id, label }, index) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? 'scroll-nav-active' : undefined}
                aria-current={active === id ? 'location' : undefined}
              >
                <span className="scroll-nav-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="scroll-nav-label">{label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
