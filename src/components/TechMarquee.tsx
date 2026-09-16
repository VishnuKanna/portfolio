import { useLayoutEffect, useRef } from 'react';
import { marqueeTech } from '../data/portfolio';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { getLenis } from '../lib/lenis';

function Row() {
  return (
    <>
      {marqueeTech.map((t) => (
        <span key={t} className="flex items-center">
          <span className="mono px-6 text-sm tracking-[0.28em] text-cream-soft/80 sm:text-base">{t}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent/70" aria-hidden />
        </span>
      ))}
    </>
  );
}

export default function TechMarquee() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const row = track?.querySelector<HTMLElement>('[data-row]');
    if (!section || !track || !row) return;
    if (prefersReducedMotion()) {
      gsap.set(track, { x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const width = () => row.offsetWidth;
      const tween = gsap.to(track, {
        x: () => -width(),
        duration: 18,
        ease: 'none',
        repeat: -1,
      });

      // Respond to scroll velocity: marquee speeds up while the page moves.
      const lenis = getLenis();
      const offs: Array<() => void> = [];
      if (lenis) {
        const onScroll = (e: { velocity?: number }) => {
          const boost = 1 + Math.min(Math.abs(e.velocity ?? 0) / 10, 2.6);
          gsap.to(tween, { timeScale: boost, duration: 0.5, overwrite: true });
        };
        lenis.on('scroll', onScroll);
        offs.push(() => lenis.off('scroll', onScroll));
      }

      // Pause on hover, resume on leave.
      const onEnter = () => gsap.to(tween, { timeScale: 0.0001, duration: 0.35, overwrite: true });
      const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: true });
      section.addEventListener('pointerenter', onEnter);
      section.addEventListener('pointerleave', onLeave);
      offs.push(() => section.removeEventListener('pointerenter', onEnter));
      offs.push(() => section.removeEventListener('pointerleave', onLeave));

      return () => offs.forEach((f) => f());
    }, section);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Technology stack"
      className="relative border-y border-line bg-ink-2 py-6"
    >
      <div className="marquee-mask flex overflow-hidden">
        <div ref={trackRef} className="flex will-change-transform">
          <div data-row className="flex shrink-0 items-center">
            <Row />
          </div>
          <div className="flex shrink-0 items-center" aria-hidden>
            <Row />
          </div>
        </div>
      </div>
      <p className="mono mt-4 text-center text-[0.6rem] tracking-[0.3em] text-muted">
        JAVA 17 · SPRING BOOT · KAFKA — THE PRODUCTION STACK
      </p>
    </section>
  );
}