import { Glasses, Gamepad2, Sparkles, Gauge, Orbit, Users, Plus } from 'lucide-react';
import { services, images } from '../data/content';
import { SectionTitle, Tilt } from '../components/Primitives';
const icons = {
  glasses: Glasses,
  gamepad: Gamepad2,
  sparkles: Sparkles,
  gauge: Gauge,
  orbit: Orbit,
  users: Users,
};
export default function Experiences() {
  return (
    <section className="section experiences" id="experiences" tabIndex={-1}>
      <div className="section-heading-row">
        <SectionTitle eyebrow="CHOOSE YOUR PLAYGROUND">
          আপনার অ্যাডভেঞ্চার
          <br />
          <span className="soft">বেছে নিন</span>
        </SectionTitle>
        <p className="section-aside">
          এক জায়গায়, আনন্দের অনেক দুনিয়া।
          <br />
          VR এখন চালু। বাকি অ্যাক্টিভিটি আসছে শীঘ্রই।
        </p>
      </div>
      <div className="experience-grid">
        {services.map((s, i) => {
          const Icon = icons[s.icon];
          return (
            <Tilt
              as={s.id === 'vr' ? 'a' : 'article'}
              href={s.id === 'vr' ? s.link : undefined}
              key={s.id}
              className={'experience-card reveal card-' + s.id}
              style={{ '--accent': s.color }}
              data-cursor={s.id === 'vr' ? 'দেখুন' : undefined}
            >
              {s.image ? (
                <img src={images[s.image]} alt="" loading="lazy" width="800" height="600" />
              ) : (
                <div className="kids-card-art" aria-hidden="true">
                  <Sparkles />
                  <span>
                    PLAY
                    <br />
                    HAPPY.
                  </span>
                </div>
              )}
              <div className="card-shade" />
              <div className="card-top">
                <span className="card-icon">
                  <Icon size={20} />
                </span>
                <span>0{i + 1}</span>
              </div>
              <div className="card-content">
                <span className="availability-badge">
                  {s.id === 'vr' ? 'NOW OPEN · এখন চালু' : 'COMING SOON'}
                </span>
                <span className="tiny-label">{s.label}</span>
                <h3>{s.name}</h3>
                <p>{s.bn}</p>
                <span className="card-more">{s.id === 'vr' && <Plus size={20} />}</span>
              </div>
            </Tilt>
          );
        })}
      </div>
      <p className="asset-note">ছবিগুলো অভিজ্ঞতার ধারণামূলক উপস্থাপনা।</p>
    </section>
  );
}
