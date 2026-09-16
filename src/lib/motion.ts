export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_SNAP = [0.7, 0, 0.2, 1] as const;

export const DUR = {
  bootStep: 0.22,
  bootBar: 1.15,
  bootFade: 0.4,
  heroWord: 1.35,
  heroHold: 0.55,
  scene: 1.1,
  section: 1.2,
  chip: 0.7,
  packet: 2.3,
  packetFast: 0.9,
} as const;

export const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
} as const;

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
} as const;

export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}