import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FlowViz from './FlowViz';
import { projects, type Project } from '../data/portfolio';
import { gsap, ScrollTrigger, prefersReducedMotion, EASE } from '../lib/gsap';

const ease = [0.16, 1, 0.3, 1] as const;

function ProjectSlide({ p, index, total }: { p: Project; index: number; total: number }) {
  const rootRef = useRef<HTMLElement | null>(null);

  // A single staged choreography per case: number → company → capability →
  // title → focus → copy → tech → system view. Revealed once, in order.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const items = root.querySelectorAll<HTMLElement>('[data-anim]');
      const flat = [...items].filter((n) => n.hasAttribute('data-anim-flat'));
      const others = [...items].filter((n) => !n.hasAttribute('data-anim-flat'));
      const setup = (el: HTMLElement) => {
        gsap.set(el, {
          opacity: 0,
          y: el.hasAttribute('data-anim-flat') ? 0 : 26,
          filter: el.hasAttribute('data-anim-flat') ? 'none' : 'blur(5px)',
          willChange: 'transform, opacity',
        });
      };
      others.forEach(setup);
      flat.forEach(setup);
      ScrollTrigger.create({
        trigger: root,
        start: 'top 86%',
        once: true,
        onEnter: () =>
          gsap.to(others, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            clearProps: 'willChange',
            duration: 0.7,
            ease: EASE.expo,
            stagger: 0.06,
            overwrite: 'auto',
          }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <article ref={rootRef} className="grid min-h-full items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
      {/* left — number + company + title */}
      <div className="relative">
        <div
          data-anim
          className="pointer-events-none absolute -left-6 -top-12 select-none font-display text-[9rem] font-extrabold leading-none text-accent/[0.07] sm:text-[13rem] lg:-left-12 lg:-top-16"
          aria-hidden
        >
          {p.index}
        </div>

        <p data-anim className="mono text-[0.7rem] tracking-[0.3em] text-accent-bright">
          {p.company}
        </p>
        <p data-anim className="mono mt-1.5 text-[0.6rem] tracking-[0.22em] text-cream-soft/60">
          {p.capability}
        </p>
        <h3 data-anim className="display mt-4 max-w-xl text-[clamp(2.2rem,5vw,4.4rem)] text-cream">
          {p.title}
        </h3>

        <ul data-anim className="mt-7 flex flex-wrap gap-2">
          {p.focus.map((f) => (
            <li
              key={f}
              className="mono rounded-full border border-accent/40 px-3 py-1.5 text-[0.62rem] tracking-[0.14em] text-cream-soft"
            >
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* right — copy, stack, architecture */}
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
        <div>
          <p data-anim className="max-w-md text-base leading-relaxed text-cream-soft/90 sm:text-lg">
            {p.copy}
          </p>

          <div data-anim className="mt-7">
            <p className="eyebrow mb-3 text-[0.58rem] text-muted">TECHNOLOGY</p>
            <ul className="flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <li
                  key={t}
                  className="mono rounded-sm border border-line bg-surface/60 px-2.5 py-1 text-[0.64rem] tracking-[0.1em] text-cream-soft/90"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-anim data-anim-flat className="hidden lg:block">
          <p className="eyebrow mb-3 text-[0.58rem] text-muted">SYSTEM VIEW</p>
          <FlowViz stages={p.architecture} speed={index % 2 === 0 ? 'normal' : 'fast'} compact />
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(false);

  useLayoutEffect(() => {
    const q = window.matchMedia('(max-width: 1023px)');
    const f = () => setMobile(q.matches);
    f();
    q.addEventListener('change', f);
    return () => q.removeEventListener('change', f);
  }, []);

  // Scroll-driven case indexing + progress rail, all through GSAP.
  useEffect(() => {
    const spacer = spacerRef.current;
    if (!spacer) return;

    const indexST = ScrollTrigger.create({
      trigger: spacer,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const next = Math.min(projects.length - 1, Math.max(0, Math.floor(self.progress * projects.length)));
        setActive((c) => (c === next ? c : next));
      },
    });

    let railST: ScrollTrigger | undefined;
    if (!prefersReducedMotion() && railRef.current) {
      railST = ScrollTrigger.create({
        trigger: spacer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          if (railRef.current) gsap.set(railRef.current, { scaleY: self.progress });
        },
      });
    }

    return () => {
      indexST.kill();
      railST?.kill();
    };
  }, [mobile]);

  const total = projects.length;

  if (mobile) {
    return (
      <section id="work" className="section-anchor relative bg-ink py-24 sm:py-32">
        <div className="section-pad mx-auto max-w-7xl">
          <p className="eyebrow mb-6 text-muted">03 / Work</p>
          <h2 className="display text-[clamp(2.4rem,6vw,5rem)]">Selected work</h2>
          <p className="mt-5 max-w-xl text-base text-cream-soft/85 sm:text-lg">
            Systems I've helped build.
          </p>
          <div className="mt-16 space-y-20">
            {projects.map((p, i) => (
              <div key={p.index}>
                <ProjectSlide p={p} index={i} total={total} />
                <div className="mt-14 flex items-center justify-between border-t border-line pt-4">
                  <span className="mono text-[0.62rem] tracking-[0.28em] text-muted">
                    CASE {p.index} / {String(total).padStart(2, '0')}
                  </span>
                  <span className="mono text-[0.62rem] text-muted">{p.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="relative bg-ink">
      {/* intro — scrolls away */}
      <div className="section-pad mx-auto max-w-7xl pb-24 pt-24 sm:pt-28">
        <p className="eyebrow mb-6 text-muted">03 / Work</p>
        <h2 className="display text-[clamp(2.4rem,6vw,5rem)]">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block"
              initial={{ y: '112%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.95, ease }}
            >
              Selected work
            </motion.span>
          </span>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
          className="mt-5 max-w-xl text-base text-cream-soft/85 sm:text-lg"
        >
          Systems I've helped build. Keep scrolling — each case study pins to the viewport.
        </motion.p>
      </div>

      <div ref={spacerRef} className="relative h-[400vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="section-pad w-full">
            <div className="relative mx-auto max-w-7xl">
              {/* progress rail */}
              <div className="absolute -left-1 top-1/2 hidden h-[46vh] w-px -translate-y-1/2 bg-line-strong xl:block">
                <div ref={railRef} className="w-full bg-accent" style={{ transformOrigin: 'top' }} aria-hidden />
              </div>

              <div className="mb-6 flex items-center justify-between">
                <span className="eyebrow text-[0.6rem] text-muted">
                  CASE {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <span className="mono text-[0.6rem] tracking-[0.28em] text-muted">SCROLL</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="max-h-[calc(100svh-9rem)]"
                >
                  <ProjectSlide p={projects[active]} index={active} total={total} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}