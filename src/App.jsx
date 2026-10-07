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
        <section className="brand-cover" aria-label="Bakerganj FunVerse — Step into a new reality">
          <img
            src="/brand/cover.png"
            alt="Bakerganj FunVerse VR Experience Zone: ডাইনোসর, সমুদ্র ও রোলার কোস্টারের অ্যাডভেঞ্চার"
            width="2056"
            height="765"
            loading="lazy"
            decoding="async"
          />
          <div className="cover-details">
            <span>সাহেবগঞ্জ বেড়িবাঁধ · বাকেরগঞ্জ, বরিশাল</span>
            <span>শুক্রবার ও শনিবার · বিকেল ৩টা–রাত ৮টা</span>
            <a href="#visit">ভিজিট করুন ↗</a>
          </div>
        </section>
        <div className="ticker" aria-hidden="true">
          <span>REAL FUN</span>
          <i>✳</i>
          <span>UNREAL EXPERIENCES</span>
          <i>✳</i>
          <span>PLAY BEYOND LIMITS</span>
          <i>✳</i>
          <span>Bakerganj FunVerse</span>
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
