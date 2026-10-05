import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useMobileGraphics } from '../hooks/usePreferences';
gsap.registerPlugin(ScrollTrigger);
export default function useChoreography(reduced) {
  const mobile = useMobileGraphics();
  useLayoutEffect(() => {
    if (reduced) return;
    if (mobile) {
      // Native momentum scrolling: no scroll hijacking, pinning, or per-frame layout paints.
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return;
            target.animate(
              [
                { opacity: 0, transform: 'translateY(18px)' },
                { opacity: 1, transform: 'none' },
              ],
              { duration: 450, easing: 'ease-out' },
            );
            observer.unobserve(target);
          });
        },
        { threshold: 0.12 },
      );
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: true,
      prevent: (node) => node.closest?.('.journey-track,.lightbox,.mobile-nav'),
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el) =>
        gsap.from(el, {
          y: 45,
          rotateX: 5,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 93%', once: true },
        }),
      );
      gsap.from('.price-number', {
        scale: 0.25,
        rotationY: -60,
        opacity: 0,
        scrollTrigger: { trigger: '.price-section', start: 'top 85%', end: 'center 65%', scrub: 1 },
      });
      gsap.utils.toArray('.tunnel-word').forEach((el, i) =>
        gsap.fromTo(
          el,
          { opacity: 0.12, z: -500 + i * 90, scale: 0.6 },
          {
            opacity: 1,
            z: 0,
            scale: 1,
            scrollTrigger: { trigger: el, start: 'top 95%', end: 'center 55%', scrub: 1 },
          },
        ),
      );
      gsap.to('.speed-road', {
        backgroundPosition: '0 600px',
        scrollTrigger: {
          trigger: '.racing-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to('.hero-word', {
        y: 150,
        scale: 1.12,
        opacity: 0,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts.ready.then(refresh);
    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced, mobile]);
}
