import { useEffect } from 'react';
import { initSmoothScroll, scrollToSmooth } from '../lib/lenis';

const NAV_OFFSET = 88;

/**
 * Global smooth-scrolling layer. Mounted once at the app root.
 *
 * - Initialises exactly one Lenis and keeps it locked to the GSAP ticker.
 * - Routes in-page anchor links (nav, hero CTAs, footer) through Lenis.
 * - Cleans itself up on unmount / StrictMode remount, and stays inert under
 *   prefers-reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const cleanup = initSmoothScroll();

    const onAnchor = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      scrollToSmooth(target as HTMLElement, -NAV_OFFSET);
    };

    const onHash = () => {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) scrollToSmooth(target as HTMLElement, -NAV_OFFSET);
      }
    };

    document.addEventListener('click', onAnchor);
    window.addEventListener('load', onHash);
    if (document.readyState === 'complete') onHash();

    return () => {
      document.removeEventListener('click', onAnchor);
      window.removeEventListener('load', onHash);
      cleanup();
    };
  }, []);

  return null;
}