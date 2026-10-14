import { Heart, Cake, Sparkles, PartyPopper, ArrowUpRight, Glasses } from 'lucide-react';
import { SectionTitle } from '../components/Primitives';

const occasions = [
  {
    icon: Heart,
    name: 'বিয়ে বাড়ি',
    label: 'WEDDING CELEBRATIONS',
    color: '#ff9cbe',
    text: 'বিয়ের আনন্দে যোগ হোক অন্য এক দুনিয়ার রোমাঞ্চ। অতিথিদের জন্য রাখুন মনে রাখার মতো VR অভিজ্ঞতা।',
  },
  {
    icon: Cake,
    name: 'জন্মদিন',
    label: 'BIRTHDAY ADVENTURES',
    color: '#8deaff',
    text: 'কেক, শুভেচ্ছা আর চমকের সঙ্গে ভার্চুয়াল অ্যাডভেঞ্চার। জন্মদিনের আয়োজনে যোগ করুন নতুন মাত্রার আনন্দ।',
  },
  {
    icon: Sparkles,
    name: 'গায়ে হলুদ',
    label: 'HOLUD & HAPPY MOMENTS',
    color: '#ffd675',
    text: 'হলুদের রঙিন উৎসবে থাকুক প্রযুক্তির মজার ছোঁয়া। বন্ধু ও স্বজনদের আড্ডা জমুক নতুন অভিজ্ঞতার গল্পে।',
  },
  {
    icon: PartyPopper,
    name: 'অন্যান্য অনুষ্ঠান',
    label: 'EVERY REASON TO CELEBRATE',
    color: '#c6a8ff',
    text: 'পারিবারিক মিলনমেলা থেকে বিশেষ আয়োজন—আপনার অনুষ্ঠানে VR বিনোদনের ব্যবস্থা নিয়ে আমাদের সঙ্গে কথা বলুন।',
  },
];

export default function EventVR() {
  return (
    <section
      className="section event-vr"
      id="event-vr"
      tabIndex={-1}
      aria-labelledby="event-vr-title"
    >
      <div className="event-intro">
        <div>
          <span className="availability-badge">VR FOR YOUR CELEBRATION</span>
          <SectionTitle eyebrow="BAKERGANJ FUNVERSE · EVENT SERVICE">
            <span id="event-vr-title">
              আপনার উৎসবে,
              <br />
              <span className="event-gradient">অন্য দুনিয়ার আনন্দ।</span>
            </span>
          </SectionTitle>
          <p className="section-description">
            বিয়ে বাড়ি, জন্মদিন, গায়ে হলুদ কিংবা বিশেষ কোনো অনুষ্ঠান—এবার আপনার আয়োজনেই থাকছে
            Bakerganj FunVerse-এর VR সার্ভিস। চেনা উৎসবে যোগ করুন এক অসাধারণ অভিজ্ঞতা।
          </p>
          <a href="#event-contact" className="button">
            অনুষ্ঠানের VR সার্ভিস সম্পর্কে জানুন <ArrowUpRight size={19} />
          </a>
        </div>
        <div className="event-emblem" aria-hidden="true">
          <div className="event-orbit" />
          <Glasses />
          <span>
            YOUR EVENT.
            <br />
            <strong>NEW REALITY.</strong>
          </span>
          <small>এক আয়োজন · অসংখ্য বিস্ময়</small>
        </div>
      </div>
      <div className="event-cards">
        {occasions.map(({ icon: Icon, name, label, color, text }, i) => (
          <article key={name} className="event-card" style={{ '--event-accent': color }}>
            <div className="event-card-top">
              <Icon size={30} />
              <span>0{i + 1}</span>
            </div>
            <p className="tiny-label">{label}</p>
            <h3>{name}</h3>
            <p>{text}</p>
            <span className="event-service-label">
              <Glasses size={16} /> VR সার্ভিস
            </span>
          </article>
        ))}
      </div>
      <div className="event-contact" id="event-contact">
        <div>
          <span className="tiny-label">LET’S PLAN YOUR EVENT</span>
          <h3>আয়োজন আপনার, VR-এর রোমাঞ্চ আমাদের।</h3>
          <p>
            অনুষ্ঠানের ধরন, তারিখ, স্থান ও সম্ভাব্য অতিথির সংখ্যা নিয়ে কথা বলুন। সময়, সার্ভিসের
            ব্যবস্থা ও খরচ আলোচনা করে নিশ্চিত করুন।
          </p>
          <small>
            এই সার্ভিসের খরচ ও সময় আলাদাভাবে নির্ধারিত হবে; উপরের ৫ মিনিটের VR টিকিটের মূল্য ইভেন্ট
            প্যাকেজের মূল্য নয়।
          </small>
        </div>
        <a href="#visit" className="button outline">
          যোগাযোগের তথ্য <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
