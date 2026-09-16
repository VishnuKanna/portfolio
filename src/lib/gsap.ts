import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Cinematic, weighted easings used across the site. */
export const EASE = {
  /** smooth weighted settle — the hero character default. */
  out: 'power2.out',
  /** slightly more pronounced deceleration for section reveals. */
  expo: 'power3.out',
  /** slow, deliberate emphasis. */
  inOut: 'power2.inOut',
} as const;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger };