import { useEffect, useRef } from 'react';
import { useReducedMotion, usePageVisible } from '../hooks/usePreferences';

export default function CinematicLayer({ kind = 'tunnel' }) {
  const ref = useRef();
  const reduced = useReducedMotion(),
    pageVisible = usePageVisible();
  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.running = String(entry.isIntersecting && !reduced && pageVisible);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, pageVisible]);
  return (
    <div
      ref={ref}
      className={`cinema-layer cinema-${kind}`}
      aria-hidden="true"
      data-running="false"
    >
      {Array.from({ length: kind === 'speed' ? 10 : 6 }, (_, i) => (
        <i key={i} style={{ '--i': i }} />
      ))}
    </div>
  );
}
