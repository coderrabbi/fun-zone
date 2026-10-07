import { Glasses, Gamepad2, Mouse, Plus } from 'lucide-react';
import { Eyebrow } from '../components/Primitives';
export default function Hero() {
  return (
    <section className="hero" id="home" tabIndex={-1}>
      <div className="hero-topline">
        <span>BAKERGANJ FUNVERSE / VR EXPERIENCE ZONE</span>
        <span>EXPLORE / PLAY / REPEAT</span>
      </div>
      <div className="hero-word" aria-hidden="true">
        FUNVERSE<span>FUNVERSE</span>
      </div>
      <div className="hero-object-space">
        <div className="orbit-label label-left">
          <span className="cross">+</span> NEW DIMENSION
          <br />
          <strong>অন্য এক দুনিয়া</strong>
        </div>
        <div className="orbit-label label-right">
          IMMERSION LEVEL
          <br />
          <strong>
            ১০০% রোমাঞ্চ <Plus size={14} />
          </strong>
        </div>
      </div>
      <div className="hero-copy">
        <Eyebrow>VR EXPERIENCE · NOW OPEN</Eyebrow>
        <h1>
          বাস্তবতার বাইরে
          <br />
          <span>শুরু হোক নতুন অ্যাডভেঞ্চার</span>
        </h1>
        <p>
          VR-এর রোমাঞ্চকর দুনিয়ায় স্বাগতম। Arcade, Kids Zone, Racing ও অন্যান্য অ্যাক্টিভিটি আসছে
          শীঘ্রই।
        </p>
        <div className="actions">
          <a href="#experiences" className="button">
            <Glasses size={19} /> এক্সপেরিয়েন্স দেখুন
          </a>
          <a href="#arcade" className="button outline">
            <Gamepad2 size={19} /> আসছে শীঘ্রই
          </a>
        </div>
      </div>
      <div className="hero-bottom">
        <span>
          <Mouse size={16} /> স্ক্রল করে ঘুরে দেখুন
        </span>
        <span>REAL FUN. UNREAL EXPERIENCES.</span>
        <span className="sound-note">SOUND OFF / PURE IMMERSION</span>
      </div>
    </section>
  );
}
