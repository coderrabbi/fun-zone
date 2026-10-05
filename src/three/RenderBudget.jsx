import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { sceneDpr } from './resolution';

// Preserve clarity: manage load with offscreen pausing, never subpixel rendering.
export default function RenderBudget({ mobile }) {
  const setDpr = useThree((state) => state.setDpr);
  useEffect(() => {
    const update = () => setDpr(sceneDpr(mobile, window.devicePixelRatio));
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, [mobile, setDpr]);
  return null;
}
