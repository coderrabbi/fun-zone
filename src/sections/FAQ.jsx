import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { faqs } from '../data/content';
import { SectionTitle } from '../components/Primitives';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="section faq-section" id="faq" tabIndex={-1} aria-labelledby="faq-title">
      <div className="section-heading-row">
        <SectionTitle eyebrow="FREQUENTLY ASKED QUESTIONS">
          <span id="faq-title">
            সচরাচর কিছু
            <br />
            <span className="soft">প্রশ্ন ও উত্তর</span>
          </span>
        </SectionTitle>
        <p className="section-aside">
          VR Experience ও আমাদের সার্ভিস সম্পর্কে গ্রাহকদের সাধারণ কিছু প্রশ্নের উত্তর এখানে পাবেন।
        </p>
      </div>

      <div className="faq-grid">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <article
              key={i}
              className={'faq-card reveal ' + (isOpen ? 'faq-open' : '')}
              data-cursor="FAQ"
            >
              <button
                className="faq-question"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={'faq-ans-' + i}
                id={'faq-q-' + i}
              >
                <span className="faq-badge">0{i + 1}</span>
                <span className="faq-q-text">{faq.q}</span>
                <span className="faq-icon-wrapper">
                  <ChevronDown size={19} className="faq-chevron" />
                </span>
              </button>
              <div
                id={'faq-ans-' + i}
                role="region"
                aria-labelledby={'faq-q-' + i}
                className="faq-answer-wrapper"
              >
                <div className="faq-answer-inner">
                  <p>{faq.a}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="faq-footer-card reveal">
        <div className="faq-footer-left">
          <div className="faq-footer-icon" aria-hidden="true">
            <HelpCircle size={24} />
          </div>
          <div>
            <h3>আরও কিছু জানতে চান?</h3>
            <p>আপনার যেকোনো প্রশ্ন আমাদের সরাসরি জানাতে পারেন। আমরা দ্রুত উত্তর দেব।</p>
          </div>
        </div>
        <a href="#visit" className="button outline" data-cursor="যোগাযোগ">
          <MessageSquare size={17} /> আমাদের সাথে কথা বলুন
        </a>
      </div>
    </section>
  );
}
