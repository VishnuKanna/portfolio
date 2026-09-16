import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nav, profile } from '../data/portfolio';
import { lenisStart, lenisStop } from '../lib/lenis';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 48);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) lenisStop();
    else lenisStart();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lenisStart();
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
      <nav
        aria-label="Primary"
        className={`flex w-full max-w-7xl items-center justify-between rounded-full border px-4 py-2 pl-5 transition-all duration-500 sm:px-5 ${
          scrolled
            ? 'border-line-strong bg-ink/70 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-cream"
          aria-label="Back to top"
        >
          <span className="hidden md:inline">{profile.name}</span>
          <span className="md:hidden">{profile.short}</span>
          <span className="ml-1 inline-block h-[3px] w-5 translate-y-[-2px] rounded-full bg-accent" aria-hidden />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="eyebrow relative py-1 text-cream/70 transition-colors hover:text-cream"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="eyebrow hidden rounded-full border border-accent/60 px-4 py-2 text-accent-bright transition-colors hover:border-accent hover:bg-accent hover:text-white md:inline-flex"
          >
            Let's talk
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-line-strong bg-ink/50 md:hidden"
          >
            <span className={`block h-px w-4 bg-cream transition-transform duration-300 ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`block h-px w-4 bg-cream transition-transform duration-300 ${open ? '-translate-y-[2px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-4 top-[4.5rem] rounded-2xl border border-line-strong bg-ink/95 p-2 backdrop-blur-xl md:hidden"
          >
            <ul className="grid gap-1">
              {[...nav, { href: '#contact', label: "Let's talk" }].map((n, i) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-cream-soft transition-colors hover:bg-surface-2 hover:text-cream"
                    style={{ transitionDelay: `${i * 20}ms` }}
                  >
                    {n.label}
                    <span className="text-accent-bright">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}