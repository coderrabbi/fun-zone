import { useEffect, useState } from 'react';
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
    const ob = new IntersectionObserver(([e]) => set(e.isIntersecting), { rootMargin: '100px' });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [ref]);
  return visible;
}
