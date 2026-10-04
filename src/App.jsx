import { lazy, Suspense } from 'react';
import SceneBoundary from './components/SceneBoundary';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import { useReducedMotion } from './hooks/usePreferences';
import Experiences from './sections/Experiences';
import VR, { Price } from './sections/VR';
import { Arcade, Racing, Kids } from './sections/PlayZones';
import { Stats, Why, Cinematic, Gallery, Reviews, Visit, Finale } from './sections/Community';
import { Loader, Effects } from './components/Effects';
import useChoreography from './animations/useChoreography';
const World = lazy(() => import('./three/World'));
export default function App() {
  const reduced = useReducedMotion();
  useChoreography(reduced);
  return (
    <>
      <a href="#experiences" className="skip-link">
        মূল কনটেন্টে যান
      </a>
      <Loader />
      <Effects reduced={reduced} />
      <Navigation />
      <SceneBoundary>
        <Suspense fallback={<div className="scene-fallback" />}>
          <World reduced={reduced} />
        </Suspense>
      </SceneBoundary>
      <main>
        <Hero />
        <div className="ticker" aria-hidden="true">
          <span>REAL FUN</span>
          <i>✳</i>
          <span>UNREAL EXPERIENCES</span>
          <i>✳</i>
          <span>PLAY BEYOND LIMITS</span>
          <i>✳</i>
          <span>FUN ZONE</span>
        </div>
        <Experiences />
        <VR reduced={reduced} />
        <Price />
        <Arcade reduced={reduced} />
        <Racing reduced={reduced} />
        <Kids reduced={reduced} />
        <Stats reduced={reduced} />
        <Why />
        <Cinematic />
        <Gallery />
        <Reviews />
        <Visit />
        <Finale />
      </main>
    </>
  );
}
