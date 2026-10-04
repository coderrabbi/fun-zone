import SceneBoundary from '../components/SceneBoundary';
import { useState, lazy, Suspense } from 'react';
import {
  Gamepad2,
  Flag,
  Target,
  Trophy,
  Users,
  Star,
  Sparkles,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { images } from '../data/content';
import { SectionTitle, Eyebrow } from '../components/Primitives';
const PlayScene = lazy(() => import('../three/PlayScene'));
const games = [
  {
    name: 'Racing',
    bn: 'গতির চ্যালেঞ্জ',
    icon: Flag,
    desc: 'স্টিয়ারিং হাতে ট্র্যাকের প্রতিটি বাঁক জয় করুন।',
    image: 'racing',
  },
  {
    name: 'Shooting',
    bn: 'লক্ষ্য হোক নিখুঁত',
    icon: Target,
    desc: 'মনোযোগ আর দক্ষতায় নিজের স্কোর ছাড়িয়ে যান।',
    image: 'arcade',
  },
  {
    name: 'Classic Arcade',
    bn: 'ফিরে আসুক সেই আনন্দ',
    icon: Gamepad2,
    desc: 'চেনা গেমে নতুন হাই স্কোর গড়ার পালা।',
    image: 'arcade',
  },
  {
    name: 'Sports Games',
    bn: 'চ্যাম্পিয়ন হওয়ার পালা',
    icon: Trophy,
    desc: 'খেলার আনন্দে মেতে উঠুন, চ্যালেঞ্জ নিন।',
    image: 'racing',
  },
  {
    name: 'Multiplayer',
    bn: 'বন্ধুদের সাথে জমে যাক',
    icon: Users,
    desc: 'একসাথে খেলুন, একসাথে স্মৃতি তৈরি করুন।',
    image: 'arcade',
  },
];
export function Arcade({ reduced }) {
  const [active, setActive] = useState(0);
  return (
    <section className="section arcade-section" id="arcade" tabIndex={-1}>
      <div className="grid-floor" aria-hidden="true" />
      <div className="arcade-layout">
        <div>
          <SectionTitle eyebrow="INSERT COIN. MAKE MEMORIES.">গেম শুরু হবে?</SectionTitle>
          <p className="section-description">
            হাই স্কোর, বন্ধুত্বপূর্ণ চ্যালেঞ্জ আর একের পর এক গেম।
            <br />
            আপনার ভেতরের প্লেয়ারকে জাগিয়ে তুলুন।
          </p>
          <div className="game-tabs" role="tablist" aria-label="আর্কেড গেম">
            {games.map((g, i) => {
              const Icon = g.icon;
              return (
                <button
                  key={g.name}
                  id={'game-tab-' + i}
                  role="tab"
                  aria-selected={active === i}
                  aria-controls="game-panel"
                  tabIndex={active === i ? 0 : -1}
                  onKeyDown={(e) => {
                    if (
                      ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(
                        e.key,
                      )
                    ) {
                      e.preventDefault();
                      const next =
                        e.key === 'Home'
                          ? 0
                          : e.key === 'End'
                            ? 4
                            : (active + (['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : 4)) % 5;
                      setActive(next);
                      document.getElementById('game-tab-' + next)?.focus();
                    }
                  }}
                  onClick={() => setActive(i)}
                >
                  <Icon size={19} />
                  <span>{g.name}</span>
                  <span className="tab-index">0{i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="arcade-stage reveal">
          <SceneBoundary>
            <Suspense fallback={null}>
              <PlayScene kind="arcade" reduced={reduced} />
            </Suspense>
          </SceneBoundary>
          <div
            id="game-panel"
            role="tabpanel"
            aria-labelledby={'game-tab-' + active}
            className="arcade-panel"
          >
            <span className="tiny-label">{games[active].name.toUpperCase()}</span>
            <h3>{games[active].bn}</h3>
            <p>{games[active].desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
export function Racing({ reduced }) {
  return (
    <section id="racing" className="section racing-section" tabIndex={-1}>
      <div className="speed-road" aria-hidden="true" />
      <div className="racing-copy reveal">
        <Eyebrow>NO BRAKES. JUST THRILLS.</Eyebrow>
        <h2>
          স্পিড
          <br />
          <span className="lime">অনুভব করুন</span>
        </h2>
        <p>
          প্রতিটি বাঁকে চ্যালেঞ্জ। প্রতিটি ল্যাপে রোমাঞ্চ।
          <br />
          আপনার রেসিং গল্পটা শুরু হোক এখানেই।
        </p>
        <a href="#visit" className="button outline">
          <Flag size={18} /> রেসের জন্য প্রস্তুত?
        </a>
      </div>
      <div className="wheel-scene">
        <SceneBoundary>
          <Suspense fallback={null}>
            <PlayScene kind="racing" reduced={reduced} />
          </Suspense>
        </SceneBoundary>
        <span className="wheel-caption">GRIP. RACE. REPEAT.</span>
      </div>
    </section>
  );
}
export function Kids({ reduced }) {
  return (
    <section id="kids" className="section kids-section" tabIndex={-1}>
      <div className="kids-visual">
        <SceneBoundary>
          <Suspense fallback={null}>
            <PlayScene kind="kids" reduced={reduced} />
          </Suspense>
        </SceneBoundary>
      </div>
      <div className="kids-copy reveal">
        <Eyebrow>SMALL EXPLORERS. BIG SMILES.</Eyebrow>
        <h2>
          ছোট্টদের আনন্দের
          <br />
          <span>আলাদা দুনিয়া</span>
        </h2>
        <p>খেলা, আনন্দ আর নতুন কিছু শেখার নিরাপদ পরিবেশ।</p>
        <div className="kids-features">
          <span>
            <ShieldCheck size={18} /> নিরাপদ পরিবেশ
          </span>
          <span>
            <Sparkles size={18} /> রঙিন আনন্দ
          </span>
          <span>
            <Heart size={18} /> সুন্দর স্মৃতি
          </span>
        </div>
        <a href="#visit" className="button">
          ছোট্টদের নিয়ে চলে আসুন
        </a>
      </div>
    </section>
  );
}
