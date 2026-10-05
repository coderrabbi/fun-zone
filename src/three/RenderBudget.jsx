import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

// Lower pixel cost when sustained frame time is high, never on a single dropped frame.
// One-way steps prevent quality oscillation while scrolling or compiling shaders.
export default function RenderBudget({ mobile, active }) {
  const setDpr = useThree((state) => state.setDpr);
  const sample = useRef({ frames: 0, elapsed: 0, warmup: 0, level: 0 });
  useEffect(() => {
    sample.current = { frames: 0, elapsed: 0, warmup: 0, level: 0 };
    setDpr(Math.min(devicePixelRatio, mobile ? 1 : 1.7));
  }, [mobile, setDpr]);
  useEffect(() => {
    sample.current.warmup = 0;
    sample.current.elapsed = 0;
    sample.current.frames = 0;
  }, [active]);
  useFrame((_, delta) => {
    if (!mobile || !active || delta > 0.25) return;
    const s = sample.current;
    s.warmup += delta;
    if (s.warmup < 2 || s.level >= 2) return;
    s.frames++;
    s.elapsed += delta;
    if (s.elapsed < 3) return;
    if (s.elapsed / s.frames > 1 / 45) {
      s.level++;
      setDpr(s.level === 1 ? 0.85 : 0.7);
    }
    s.frames = 0;
    s.elapsed = 0;
  });
  return null;
}
