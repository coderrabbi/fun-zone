import CinematicLayer from '../components/CinematicLayer';
import { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck,
  Glasses,
  Gamepad2,
  Users,
  Sparkles,
  Ticket,
  Plus,
  MapPin,
  Clock,
  Phone,
  Star,
  Instagram,
} from 'lucide-react';
import { images, business, reviews, benefits } from '../data/content';
import { SectionTitle, Tilt, Lightbox, Eyebrow } from '../components/Primitives';
export function Stats({ reduced }) {
  const ref = useRef();
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame;
    const o = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        o.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = reduced ? 1 : Math.min((now - start) / 1000, 1);
          setCount(Math.round(10 * (1 - (1 - p) ** 3)));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    o.observe(ref.current);
    return () => {
      o.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced]);
  return (
    <section className="stats section" ref={ref}>
      <div>
        <strong>{count.toLocaleString('bn-BD')}+</strong>
        <span>এক্সপেরিয়েন্স</span>
      </div>
      <div>
        <Glasses />
        <strong className="stat-text">VR + Arcade</strong>
        <span>সাথে Kids Zone</span>
      </div>
      <div>
        <Users />
        <strong className="stat-text">পরিবারের</strong>
        <span>সবার জন্য</span>
      </div>
      <div>
        <ShieldCheck />
        <strong className="stat-text">নিরাপদ ও</strong>
        <span>পরিচ্ছন্ন পরিবেশ</span>
      </div>
    </section>
  );
}
export function Why() {
  const icons = [Glasses, Gamepad2, ShieldCheck, Users, Sparkles, Ticket];
  return (
    <section className="section why-section">
      <SectionTitle eyebrow="MORE THAN JUST A PLAY ZONE">
        কেন <span className="english">FUN ZONE?</span>
      </SectionTitle>
      <div className="benefit-grid">
        {benefits.map((b, i) => {
          const Icon = icons[i];
          return (
            <Tilt key={b} className="benefit reveal">
              <Icon size={24} />
              <h3>{b}</h3>
              <span>0{i + 1}</span>
            </Tilt>
          );
        })}
      </div>
    </section>
  );
}
export function Cinematic() {
  return (
    <section className="cinematic section">
      <CinematicLayer />
      <span className="tiny-label">THIS IS YOUR PORTAL</span>
      <h2>
        {['স্ক্রিনে নয়—', 'এবার গেমের', 'ভেতরে প্রবেশ করুন।'].map((w, i) => (
          <span className="tunnel-word" key={w} style={{ '--depth': i }}>
            {w}
          </span>
        ))}
      </h2>
      <span className="cinematic-cross">+</span>
    </section>
  );
}
const gallery = [
  { src: images.arcade, alt: 'নিয়ন আলোয় আর্কেডের দুনিয়া' },
  { src: images.vr, alt: 'VR হেডসেটে নতুন অভিজ্ঞতা' },
  { src: images.racing, alt: 'একসাথে রেসিং গেমের আনন্দ' },
  { src: images.ocean, alt: 'সমুদ্রের গভীরে ভার্চুয়াল অ্যাডভেঞ্চার' },
  { src: images.space, alt: 'মহাকাশে নতুন যাত্রা' },
];
export function Gallery() {
  const [index, setIndex] = useState(null);
  return (
    <section className="section gallery-section" id="gallery" tabIndex={-1}>
      <div className="section-heading-row">
        <SectionTitle eyebrow="COLLECT MOMENTS, NOT JUST SCORES">
          FUN ZONE-এর
          <br />
          <span className="soft">কিছু মুহূর্ত</span>
        </SectionTitle>
        <p className="section-aside">
          নতুন স্মৃতির অপেক্ষায়।
          <br />
          <span className="asset-note">ধারণামূলক স্টক গ্যালারি; নিজস্ব ছবি যোগ করা যাবে।</span>
        </p>
      </div>
      <div className="gallery-grid">
        {gallery.map((item, i) => (
          <Tilt
            as="button"
            key={item.src}
            className={'gallery-item gallery-' + i}
            onClick={() => setIndex(i)}
            data-cursor="দেখুন"
            aria-label={item.alt + ' — বড় করে দেখুন'}
          >
            <img src={item.src} alt={item.alt} loading="lazy" width="1200" height="800" />
            <span>
              <span>{item.alt}</span>
              <Plus size={22} />
            </span>
          </Tilt>
        ))}
      </div>
      {index !== null && (
        <Lightbox
          items={gallery}
          index={index}
          onChange={setIndex}
          onClose={() => setIndex(null)}
        />
      )}
    </section>
  );
}
export function Reviews() {
  return (
    <section className="reviews-section">
      <SectionTitle eyebrow="GOOD TIMES. GREAT STORIES.">
        যারা এসেছেন,
        <br />
        <span className="soft">তারা কী বলছেন?</span>
      </SectionTitle>
      <p className="asset-note">নমুনা রিভিউ — প্রকাশের আগে প্রকৃত অভিজ্ঞতা দিয়ে পরিবর্তন করুন।</p>
      <div className="review-window">
        <div className="review-track">
          {[...reviews, ...reviews].map((r, i) => (
            <article
              key={i}
              className="review"
              aria-hidden={i >= reviews.length ? 'true' : undefined}
            >
              <div className="stars" aria-label="৫ এর মধ্যে ৫ তারকা">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star key={n} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote>“{r.text}”</blockquote>
              <div className="review-person">
                <span>{r.initial}</span>
                <strong>
                  {r.name}
                  <small>নমুনা রিভিউ</small>
                </strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Visit() {
  const configured = Boolean(business.address && business.phone);
  return (
    <section className="section visit-section" id="visit" tabIndex={-1}>
      <div>
        <SectionTitle eyebrow="YOUR NEXT GOOD DAY STARTS HERE">
          আজই চলে আসুন
          <br />
          <span className="soft">FUN ZONE-এ</span>
        </SectionTitle>
        <div className="contact-list">
          <div>
            <MapPin />
            <span>
              <small>ঠিকানা</small>
              {business.address || '[এখানে ঠিকানা বসবে]'}
            </span>
          </div>
          <div>
            <Clock />
            <span>
              <small>সময়</small>
              {business.hours || '[Opening Hours]'}
            </span>
          </div>
          <div>
            <Phone />
            <span>
              <small>মোবাইল</small>
              {business.phone || '[Phone Number]'}
            </span>
          </div>
        </div>
        <div className="visit-actions">
          {business.mapUrl ? (
            <a className="button" href={business.mapUrl} target="_blank" rel="noopener noreferrer">
              <MapPin size={17} /> Google Maps-এ দেখুন
            </a>
          ) : (
            <button className="button" disabled aria-describedby="contact-note">
              <MapPin size={17} /> Google Maps-এ দেখুন
            </button>
          )}
          {business.phone ? (
            <a className="button outline" href={'tel:' + business.phone.replace(/[^+\d]/g, '')}>
              <Phone size={17} /> কল করুন
            </a>
          ) : (
            <button className="button outline" disabled aria-describedby="contact-note">
              <Phone size={17} /> কল করুন
            </button>
          )}
        </div>
        {!configured && (
          <p className="asset-note" id="contact-note">
            ঠিকানা ও ফোন নম্বর শীঘ্রই যুক্ত হবে।
          </p>
        )}
      </div>
      <div className="map-placeholder">
        <div className="map-grid" />
        <MapPin size={44} />
        <strong>FUN ZONE</strong>
        <span>[Map Placeholder]</span>
        <p>
          পরবর্তী অ্যাডভেঞ্চারের ঠিকানা
          <br />
          শীঘ্রই এখানে পাবেন।
        </p>
      </div>
    </section>
  );
}
export function Finale() {
  return (
    <>
      <section className="finale section">
        <CinematicLayer kind="portal" />
        <Eyebrow>STEP INTO SOMETHING EXTRAORDINARY</Eyebrow>
        <h2>
          Ready To
          <br />
          <span>Enter?</span>
        </h2>
        <p>নতুন এক দুনিয়া আপনার জন্য অপেক্ষা করছে।</p>
        <a href="#visit" className="button">
          FUN ZONE-এ চলে আসুন
        </a>
      </section>
      <footer>
        <a className="brand" href="#home">
          FUN<span className="lime">ZONE</span>
        </a>
        <span>রোমাঞ্চ শুরু এখানেই।</span>
        <small>© {new Date().getFullYear()} FUN ZONE</small>
        <a href="#home">উপরে ফিরে যান</a>
      </footer>
    </>
  );
}
