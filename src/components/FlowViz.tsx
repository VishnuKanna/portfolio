import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion, EASE } from '../lib/gsap';

type FlowVizProps = {
  stages: string[];
  active?: boolean;
  speed?: 'normal' | 'fast';
  compact?: boolean;
};

/**
 * Architecture flow — GSAP packet timeline + staged node reveal.
 * Packets move continuously while the visual is in view AND active; they pause
 * (and only pause) otherwise. No React state touches the animation loop.
 */
export default function FlowViz({ stages, active = true, speed = 'normal', compact = false }: FlowVizProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const runRef = useRef(false);
  const playingRef = useRef(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    const dots = dotsRef.current;
    if (!root || !list || !dots || !stages.length) return;
    const reduced = prefersReducedMotion();

    let railH = list.offsetHeight || 360;
    const measure = () => {
      railH = list.offsetHeight;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);

    const ctx = gsap.context(() => {
      const nodes = list.querySelectorAll<HTMLElement>('[data-node]');

      if (!reduced) {
        gsap.set(nodes, { opacity: 0, y: 14, willChange: 'transform, opacity' });
        ScrollTrigger.create({
          trigger: root,
          start: 'top 90%',
          once: true,
          onEnter: () =>
            gsap.to(nodes, {
              opacity: 1,
              y: 0,
              clearProps: 'willChange',
              duration: 0.55,
              stagger: 0.08,
              ease: EASE.expo,
            }),
        });

        // Continuous packets — one timeline, phase-offset per dot.
        const seg = speed === 'fast' ? 1.5 : 2.4;
        const dotEls = Array.from(dots.children);
        const tl = gsap.timeline({ repeat: -1, paused: true });
        dotEls.forEach((dot, i) => {
          const off = i * seg * 0.34;
          tl.fromTo(dot, { y: 0 }, { y: () => railH, duration: seg, ease: 'power1.in' }, off)
            .fromTo(dot, { opacity: 0 }, { opacity: 1, duration: seg * 0.12, ease: 'power1.out' }, off)
            .to(dot, { opacity: 0, duration: seg * 0.22, ease: 'power1.in' }, off + seg * 0.62);
        });
        tlRef.current = tl;
      }
    }, root);

    const setPlaying = (run: boolean) => {
      const tl = tlRef.current;
      if (!tl) return;
      if (run && !playingRef.current) {
        tl.play();
        playingRef.current = true;
      } else if (!run && playingRef.current) {
        tl.pause();
        playingRef.current = false;
      }
    };
    const sync = () => setPlaying(runRef.current && activeRef.current);

    const io = new IntersectionObserver(
      (entries) => {
        runRef.current = entries[0]?.isIntersecting ?? false;
        sync();
      },
      { rootMargin: '-12%' },
    );
    io.observe(root);
    sync();

    return () => {
      ctx.revert();
      io.disconnect();
      ro.disconnect();
      tlRef.current = null;
      playingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stages, speed]);

  useLayoutEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (activeRef.current && runRef.current && !playingRef.current) {
      tl.play();
      playingRef.current = true;
    } else if ((!activeRef.current || !runRef.current) && playingRef.current) {
      tl.pause();
      playingRef.current = false;
    }
  }, [active]);

  return (
    <div ref={rootRef} className="relative">
      {/* spine rail */}
      <div aria-hidden className="absolute bottom-3 left-[11px] top-3 w-px bg-line-strong" />

      {/* packet lane */}
      <div
        ref={dotsRef}
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-[7px] top-3 w-[9px] overflow-visible"
      >
        {[0, 1, 2].map((p) => (
          <span key={p} className="absolute left-0 top-0">
            <span
              className="block h-[5px] w-[5px] rounded-full"
              style={{
                background: 'radial-gradient(circle, #e05b45 0%, #c14030 55%, rgba(193,64,48,0) 100%)',
                boxShadow: '0 0 8px 1px rgba(224,91,69,0.75)',
              }}
            />
          </span>
        ))}
      </div>

      <ol ref={listRef} className="relative flex flex-col gap-3 pl-8">
        {stages.map((s, i) => (
          <li
            key={s}
            data-node
            className={`relative transition-opacity duration-500 ${
              active ? 'opacity-100' : 'opacity-55'
            }`}
          >
            <span
              aria-hidden
              className="absolute -left-7 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full border border-accent-bright/70 bg-ink"
              style={{ boxShadow: '0 0 0 1px rgba(193,64,48,0.35)' }}
            />
            <div className={`rounded-sm border border-line bg-surface/70 px-3.5 py-2.5 ${compact ? '' : 'sm:px-4 sm:py-3'}`}>
              <span className="mono block text-[0.7rem] tracking-[0.16em] text-cream-soft">
                <span className="mr-2 text-accent-bright">{String(i + 1).padStart(2, '0')}</span>
                {s}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}