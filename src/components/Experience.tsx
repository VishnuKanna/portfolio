import { useLayoutEffect, useRef } from 'react';
import { experience } from '../data/portfolio';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { revealBatch } from '../lib/reveal';

export default function Experience() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  // Rail draws with scroll; jobs step in as they pass into view.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      revealBatch(wrap, { start: 'top 88%' });

      if (!reduced && lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top 82%',
              end: 'bottom 72%',
              scrub: 0.6,
            },
          },
        );
      }
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="section-anchor relative bg-ink py-24 sm:py-32">
      <div className="section-pad mx-auto max-w-7xl">
        <p className="eyebrow mb-6 text-muted">04 / Career</p>
        <h2 className="display text-[clamp(2.4rem,6vw,5rem)]">Experience</h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-soft/85 sm:text-lg">
          An engineering arc — from enterprise foundations to senior ownership of backend
          platforms.
        </p>

        <div ref={wrapRef} className="relative mt-16 lg:mt-20">
          {/* rail */}
          <div aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-line" />
          <div
            ref={lineRef}
            aria-hidden
            className="absolute left-[7px] top-0 w-px origin-top bg-accent"
            style={{ height: '100%', transform: 'scaleY(0)' }}
          />

          <ol className="relative space-y-14 lg:space-y-20">
            {experience.map((e, i) => (
              <li
                key={e.company}
                data-reveal
                className="group relative pl-10 lg:pl-16"
              >
                {/* dot */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-2 flex h-[15px] w-[15px] items-center justify-center rounded-full border ${
                    e.current
                      ? 'border-accent-bright bg-accent'
                      : 'border-line-strong bg-ink group-hover:border-accent/60'
                  }`}
                >
                  {e.current && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white" />}
                </span>

                <div className="grid gap-2 lg:grid-cols-[240px_1fr] lg:gap-10">
                  <div>
                    <h3 className="display text-2xl text-cream lg:text-3xl">
                      {e.company}
                      {e.current && (
                        <span className="mono ml-3 inline-block translate-y-[-3px] rounded-full border border-accent/50 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-accent-bright">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="mono mt-2 text-xs tracking-[0.16em] text-cream-soft/80">{e.role}</p>
                  </div>
                  <div>
                    <p className="mono text-[0.64rem] tracking-[0.26em] text-muted lg:text-right">
                      {e.period}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream-soft/75 sm:text-base">
                      {e.note}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}