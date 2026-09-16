import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

let lenis: Lenis | null = null;

/** Smooth scroll is disabled under prefers-reduced-motion; native scrolling stays. */
export const isSmoothScrollActive = () => !!lenis;

export function getLenis() {
  return lenis;
}

/** Freeze Lenis while the mobile nav is open. */
export const lenisStop = () => lenis?.stop();

/** Resume after lenisStop(). */
export const lenisStart = () => lenis?.start();

/** Programmatic scroll through Lenis when active, native otherwise. */
export function scrollToSmooth(target: string | number | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.35, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target + offset, behavior: 'auto' });
  } else if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: 'auto' });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'auto' });
  }
}

/**
 * One Lenis instance, one animation loop. Lenis drives the native scroll and
 * stays in lock-step with the GSAP ticker; ScrollTrigger.update follows every
 * scroll. Returns a cleanup that tears the whole thing down (safe under React
 * StrictMode double-mount).
 */
export function initSmoothScroll(): () => void {
  if (lenis) return () => {};
  if (prefersReducedMotion()) return () => {};

  lenis = new Lenis({
    // ~1.15s full-page settle — confident but not sluggish.
    duration: 1.15,
    // gentle exponential ease-out; never linear.
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);
  ScrollTrigger.update();

  const tick = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    lenis?.destroy();
    lenis = null;
    gsap.ticker.remove(tick);
  };
}