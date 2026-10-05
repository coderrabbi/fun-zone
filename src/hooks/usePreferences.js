import { useEffect, useState } from 'react';
export function useMobileGraphics() {
  const query = '(max-width: 1024px), (pointer: coarse)';
  const [mobile, setMobile] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return mobile;
}

export function usePageVisible() {
  const [visible, setVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return visible;
}
export function useReducedMotion() {
  const [reduced, set] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => set(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return reduced;
}
export function useVisible(ref) {
  const [visible, set] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => set(e.isIntersecting), { threshold: 0.01 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [ref]);
  return visible;
}
