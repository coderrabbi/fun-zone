import { useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
export function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <span /> {children}
    </div>
  );
}
export function SectionTitle({ eyebrow, children, description }) {
  return (
    <div className="section-title reveal">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{children}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function Tilt({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      {...props}
      className={'tilt ' + className}
      onPointerMove={(e) => {
        if (e.pointerType === 'touch' || matchMedia('(prefers-reduced-motion: reduce)').matches)
          return;
        const r = e.currentTarget.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        e.currentTarget.style.setProperty('--rx', `${(y - 0.5) * -6}deg`);
        e.currentTarget.style.setProperty('--ry', `${(x - 0.5) * 7}deg`);
        e.currentTarget.style.setProperty('--mx', `${x * 100}%`);
        e.currentTarget.style.setProperty('--my', `${y * 100}%`);
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty('--rx', '0deg');
        e.currentTarget.style.setProperty('--ry', '0deg');
      }}
    >
      {children}
    </Tag>
  );
}
export function Lightbox({ items, index, onChange, onClose }) {
  const dialog = useRef();
  useEffect(() => {
    const d = dialog.current;
    d.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = old;
      d.close();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label="ছবির গ্যালারি"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onChange((index + 1) % items.length);
        if (e.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length);
      }}
    >
      <button className="icon-button close" aria-label="বন্ধ করুন" onClick={onClose}>
        <X />
      </button>
      <button
        className="icon-button previous"
        aria-label="আগের ছবি"
        onClick={() => onChange((index - 1 + items.length) % items.length)}
      >
        <ChevronLeft />
      </button>
      <figure>
        <img src={items[index].src} alt={items[index].alt} />
        <figcaption>{items[index].alt} · ধারণামূলক স্টক ছবি</figcaption>
      </figure>
      <button
        className="icon-button next"
        aria-label="পরের ছবি"
        onClick={() => onChange((index + 1) % items.length)}
      >
        <ChevronRight />
      </button>
    </dialog>
  );
}
