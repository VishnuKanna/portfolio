import { EASE, gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

type RevealOptions = {
  /** Elements within root to reveal. */
  selector?: string;
  /** Initial vertical offset in px. */
  y?: number;
  /** Initial blur in px (subtle; type only). */
  blur?: number;
  /** Stagger between items, seconds. */
  stagger?: number;
  /** Per-item duration, seconds. */
  duration?: number;
  /** ScrollTrigger start line. */
  start?: string;
};

/**
 * A single, consistent reveal language: opacity + y + a whisper of blur,
 * staggered. Fire once when the scroll line is reached. Under
 * prefers-reduced-motion the elements stay in their natural (visible) state.
 * Returns a cleanup; use inside gsap.context() where possible.
 */
export function revealBatch(root: HTMLElement, opts: RevealOptions = {}) {
  const {
    selector = '[data-reveal]',
    y = 26,
    blur = 4,
    stagger = 0.07,
    duration = 0.8,
    start = 'top 86%',
  } = opts;

  const items = root.querySelectorAll<HTMLElement>(selector);
  if (!items.length) return () => {};

  if (prefersReducedMotion()) {
    gsap.set(items, { clearProps: 'all' });
    return () => {};
  }

  // Eagerly hide (before ScrollTrigger fires) so there is never a visible→hidden
  // flicker; ScrollTrigger reveals from that state. Reduced motion skips both.
  gsap.set(items, {
    opacity: 0,
    y,
    ...(blur ? { filter: `blur(${blur}px)` } : {}),
    willChange: 'transform, opacity',
  });

  const tweens: gsap.core.Tween[] = [];
  const st = ScrollTrigger.create({
    trigger: root,
    start,
    once: true,
    onEnter: () => {
      items.forEach((el, i) => {
        tweens.push(
          gsap.to(el, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            clearProps: 'willChange',
            duration,
            ease: EASE.expo,
            delay: i * stagger,
            overwrite: 'auto',
          }),
        );
      });
    },
  });

  return () => {
    st.kill();
    tweens.forEach((t) => t.kill());
    gsap.set(items, { clearProps: 'all' });
  };
}