import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
const links = [
  ['হোম', 'home'],
  ['এক্সপেরিয়েন্স', 'experiences'],
  ['VR', 'vr'],
  ['Arcade · Soon', 'arcade'],
  ['Kids · Soon', 'kids'],
  ['গ্যালারি', 'gallery'],
  ['যোগাযোগ', 'visit'],
];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef();
  const panel = useRef();
  useEffect(() => {
    const f = () => setScrolled(scrollY > 32);
    addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('a')?.focus();
    const key = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === 'Tab') {
        const nodes = [toggle.current, ...panel.current.querySelectorAll('a')];
        let first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', key);
    };
  }, [open]);
  return (
    <>
      <header className={'nav ' + (scrolled ? 'scrolled' : '')}>
        <a href="#home" className="brand" aria-label="Bakerganj FunVerse হোম">
          <img className="brand-logo" src="/brand/logo.png" alt="" width="52" height="52" />
          <span className="brand-wordmark">
            <small>BAKERGANJ</small>FUN<span className="lime">VERSE</span>
            <i>VR EXPERIENCE ZONE</i>
          </span>
        </a>
        <nav aria-label="প্রধান নেভিগেশন" className="desktop-nav">
          {links.map(([label, id]) => (
            <a key={id} href={'#' + id}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#visit" className="button small nav-cta">
          ভিজিট করুন
        </a>
        <button
          ref={toggle}
          className="menu-toggle icon-button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            ref={panel}
            id="mobile-nav"
            aria-label="মোবাইল নেভিগেশন"
            className="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {links.map(([label, id], i) => (
              <motion.a
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.045 }}
                key={id}
                href={'#' + id}
                onClick={() => {
                  setOpen(false);
                  setTimeout(
                    () => document.getElementById(id)?.focus({ preventScroll: true }),
                    100,
                  );
                }}
              >
                <small>0{i + 1}</small>
                {label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
