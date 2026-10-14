import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { toggleAmbientSound, playUiClick, playHoverBlip, isAmbientPlaying } from '../audio/synth';

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
  const cursorDot = useRef();
  const cursorRing = useRef();
  const cursorBadge = useRef();
  const progress = useRef();
  const sparksContainer = useRef();
  const [soundOn, setSoundOn] = useState(false);

  // Top scroll progress
  useEffect(() => {
    const onScroll = () => {
      if (progress.current) {
        const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        progress.current.style.transform = `scaleX(${scrollY / total})`;
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // Dual Cyber Cursor & Click Sparks
  useEffect(() => {
    if (reduced || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    const dot = cursorDot.current;
    const ring = cursorRing.current;
    const badge = cursorBadge.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf;
    let isVisible = false;

    const onPointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Check hovered interactive elements
      const target = e.target.closest('[data-cursor], button, a, [role="tab"], .tilt');
      const isInteractive = Boolean(target);
      ring.dataset.active = isInteractive ? 'true' : 'false';

      const customText = target?.dataset.cursor || '';
      if (badge) {
        if (customText) {
          badge.textContent = customText;
          badge.style.opacity = '1';
          badge.style.transform = `translate3d(${mouseX + 16}px, ${mouseY - 14}px, 0) scale(1)`;
        } else {
          badge.style.opacity = '0';
          badge.style.transform = `translate3d(${mouseX + 16}px, ${mouseY - 14}px, 0) scale(0.7)`;
        }
      }
    };

    // Smooth magnetic lerp loop for the outer ring
    const render = () => {
      const ease = 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      const deltaX = mouseX - ringX;
      const deltaY = mouseY - ringY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const dist = Math.min(Math.hypot(deltaX, deltaY) * 0.08, 0.4);

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${angle * 0.3}deg) scale(${1 + dist})`;

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onPointerLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      if (badge) badge.style.opacity = '0';
    };

    // Click sparks & shockwave
    const onPointerDown = (e) => {
      playUiClick();

      if (!sparksContainer.current) return;
      const sparkHost = sparksContainer.current;

      // Create expanding shockwave ripple
      const ripple = document.createElement('div');
      ripple.className = 'cyber-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      sparkHost.appendChild(ripple);

      // Create 8 directional glowing sparks
      const sparkCount = 8;
      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('span');
        spark.className = 'cyber-spark';
        const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const velocity = 35 + Math.random() * 45;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        spark.style.left = `${e.clientX}px`;
        spark.style.top = `${e.clientY}px`;
        sparkHost.appendChild(spark);

        setTimeout(() => spark.remove(), 600);
      }
      setTimeout(() => ripple.remove(), 650);
    };

    // Hover audio blip
    const onMouseOver = (e) => {
      if (e.target.closest('button, a, [data-cursor]')) {
        playHoverBlip();
      }
    };

    addEventListener('pointermove', onPointerMove, { passive: true });
    addEventListener('pointerdown', onPointerDown);
    addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onPointerMove);
      removeEventListener('pointerdown', onPointerDown);
      removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [reduced]);

  const handleSoundToggle = () => {
    const nextState = toggleAmbientSound();
    setSoundOn(nextState);
  };

  return (
    <>
      <div ref={progress} className="scroll-progress" />
      <div ref={sparksContainer} className="sparks-container" aria-hidden="true" />
      
      {/* Dual Cyber Cursor */}
      <div ref={cursorDot} className="cursor-dot" aria-hidden="true" />
      <div ref={cursorRing} className="cursor-ring" aria-hidden="true">
        <i className="cursor-cross-h" />
        <i className="cursor-cross-v" />
      </div>
      <div ref={cursorBadge} className="cursor-badge" aria-hidden="true" />

      {/* Futuristic Ambient Sound Toggle Pill */}
      <div className="audio-controller" aria-label="অ্যাম্বিয়েন্ট সাউন্ড কন্ট্রোলার">
        <button
          className={'sound-pill ' + (soundOn ? 'sound-active' : '')}
          onClick={handleSoundToggle}
          title={soundOn ? 'সাউন্ড বন্ধ করুন' : 'সাইবার অ্যাম্বিয়েন্ট সাউন্ড চালু করুন'}
          aria-pressed={soundOn}
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="sound-text">
            {soundOn ? 'IMMERSION SOUND: ON' : 'AMBIENT SOUND: OFF'}
          </span>
          <span className="sound-visualizer" aria-hidden="true">
            <b />
            <b />
            <b />
            <b />
          </span>
        </button>
      </div>
    </>
  );
}
