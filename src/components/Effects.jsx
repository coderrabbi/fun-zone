import { useEffect, useRef, useState } from 'react';

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let alive = true,
      count = 0;
    const complete = () => {
      count++;
      if (alive) setProgress(count * 50);
    };
    Promise.allSettled([
      import('../three/World').then(complete, complete),
      document.fonts.ready.then(complete, complete),
    ]).then(() => {
      if (alive) setTimeout(() => setDone(true), 200);
    });
    return () => {
      alive = false;
    };
  }, []);
  return done ? null : (
    <div className="loader" role="status" aria-label="Bakerganj FunVerse লোড হচ্ছে">
      <img className="loader-logo" src="/brand/logo.png" alt="" width="112" height="112" />
      <strong>
        <small>BAKERGANJ</small> FUN<span>VERSE</span>
      </strong>
      <div className="loader-line">
        <i style={{ width: progress + '%' }} />
      </div>
      <span>{progress}%</span>
    </div>
  );
}
export function Effects({ reduced }) {
  const cursor = useRef(),
    progress = useRef();
  useEffect(() => {
    const f = () => {
      if (progress.current)
        progress.current.style.transform = `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
    };
    addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);
  useEffect(() => {
    if (reduced || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const c = cursor.current;
    let raf;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        c.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
        c.style.opacity = '1';
        const target = e.target.closest('[data-cursor],button,a');
        c.dataset.active = target ? 'true' : 'false';
        c.textContent = target?.dataset.cursor || '';
      });
    };
    const hide = () => (c.style.opacity = '0');
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
    };
  }, [reduced]);
  return (
    <>
      <div ref={progress} className="scroll-progress" />
      <div ref={cursor} className="cursor" aria-hidden="true" />
    </>
  );
}
