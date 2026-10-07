import { useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Glasses } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journeys, images, business } from '../data/content';
import { SectionTitle } from '../components/Primitives';
gsap.registerPlugin(ScrollTrigger);
export default function VR({ reduced }) {
  const section = useRef(),
    track = useRef();
  const [active, setActive] = useState(0);
  const timeline = useRef();
  const drag = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1025px) and (pointer: fine)', () => {
      if (reduced) return;
      const ctx = gsap.context(() => {
        timeline.current = gsap.to(track.current, {
          x: () => -(track.current.scrollWidth - track.current.clientWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => '+=' + Math.min(6000, track.current.scrollWidth - track.current.clientWidth),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (s) => setActive(Math.min(6, Math.round(s.progress * 6))),
          },
        });
      }, section);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [reduced]);
  const select = (i) => {
    if (
      timeline.current?.scrollTrigger &&
      !reduced &&
      matchMedia('(min-width: 1025px) and (pointer: fine)').matches
    ) {
      const st = timeline.current.scrollTrigger;
      window.scrollTo({ top: st.start + ((st.end - st.start) * i) / 6, behavior: 'instant' });
    } else {
      track.current.children[i]?.scrollIntoView({
        behavior: reduced ? 'instant' : 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      setActive(i);
    }
  };
  return (
    <section id="vr" className="vr-section" ref={section} tabIndex={-1}>
      <div className="vr-head">
        <SectionTitle eyebrow="LEAVE REALITY BEHIND">
          চোখে হেডসেট,
          <br />
          <span className="soft">সামনে নতুন পৃথিবী।</span>
        </SectionTitle>
        <p>
          রোলার কোস্টার, ডাইনোসর, সমুদ্রের গভীরতা, মহাকাশ কিংবা হরর — কয়েক মিনিটেই ঘুরে আসুন অন্য এক
          দুনিয়া থেকে।
        </p>
      </div>
      <div className="journey-window">
        <div
          className={'journey-track ' + (reduced ? 'native-scroll' : '')}
          ref={track}
          data-cursor="DRAG"
          onScroll={(event) => {
            if (!matchMedia('(min-width: 1025px) and (pointer: fine)').matches || reduced) {
              const el = event.currentTarget;
              setActive(Math.min(6, Math.round(el.scrollLeft / (el.children[0].offsetWidth + 15))));
            }
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== 'mouse') return;
            drag.current = { x: event.clientX, scroll: scrollY, left: track.current.scrollLeft };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!drag.current) return;
            const distance = drag.current.x - event.clientX;
            const st = timeline.current?.scrollTrigger;
            if (st && !reduced && matchMedia('(min-width: 1025px) and (pointer: fine)').matches) {
              window.scrollTo({
                top: Math.max(st.start, Math.min(st.end, drag.current.scroll + distance)),
                behavior: 'instant',
              });
            } else track.current.scrollLeft = drag.current.left + distance;
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
        >
          {journeys.map((j, i) => (
            <article className="journey" key={j.name}>
              <img
                src={images[j.image]}
                alt={j.name + ' অভিজ্ঞতার ধারণামূলক দৃশ্য'}
                loading="lazy"
                width="1600"
                height="900"
              />
              <div className="journey-vignette" />
              <div className="journey-top">
                <span>{j.tag}</span>
                <Glasses size={23} />
              </div>
              <div className="journey-copy">
                <span className="tiny-label">{j.name.toUpperCase()}</span>
                <h3>{j.bn}</h3>
                <p>{j.desc}</p>
                <span className="journey-note">ধারণামূলক ভিজ্যুয়াল</span>
              </div>
              <span className="journey-number">0{i + 1}</span>
            </article>
          ))}
        </div>
      </div>
      <div className="journey-controls">
        <div className="journey-dots">
          {journeys.map((j, i) => (
            <button
              key={j.name}
              className={active === i ? 'active' : ''}
              aria-label={j.name}
              aria-current={active === i ? 'true' : undefined}
              onClick={() => select(i)}
            />
          ))}
        </div>
        <span className="journey-hint">SCROLL TO EXPLORE</span>
        <div className="journey-arrows">
          <button
            className="icon-button"
            aria-label="আগের অভিজ্ঞতা"
            onClick={() => select(Math.max(0, active - 1))}
            disabled={active === 0}
          >
            <ChevronLeft size={19} />
          </button>
          <button
            className="icon-button"
            aria-label="পরের অভিজ্ঞতা"
            onClick={() => select(Math.min(6, active + 1))}
            disabled={active === 6}
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>
      <div className="journey-options">
        {journeys.map((j, i) => (
          <button key={j.name} className={active === i ? 'active' : ''} onClick={() => select(i)}>
            {j.name}
          </button>
        ))}
      </div>
    </section>
  );
}
export function Price() {
  return (
    <section className="price-section section">
      <div className="price-orbit" aria-hidden="true" />
      <div className="eyebrow">A SMALL TICKET. A WHOLE NEW WORLD.</div>
      <p>অন্য এক দুনিয়ায় যাওয়ার টিকিট</p>
      <div className="price">
        <span>মাত্র</span>
        <strong className="price-number">{business.price.toLocaleString('bn-BD')}</strong>
        <span>টাকা</span>
      </div>
      <h2>{business.duration.toLocaleString('bn-BD')} মিনিটের VR Experience</h2>
      <a href="#visit" className="text-link">
        দেখা হবে Bakerganj FunVerse-এ
      </a>
    </section>
  );
}
