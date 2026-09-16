import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { about } from '../data/portfolio';

const ease = [0.16, 1, 0.3, 1] as const;

const lineVariants = {
  hidden: { y: '112%' },
  show: (i: number) => ({
    y: 0,
    transition: { duration: 0.95, ease, delay: 0.06 * i },
  }),
};

function RevealLine({ text, i }: { text: string; i: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        custom={i}
        variants={lineVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-12%' }}
        className="block will-change-transform"
      >
        {text}
      </motion.span>
    </span>
  );
}

function CountUp({ target, total }: { target: number; total: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pad = (n: number) => `${n}`.padStart(String(total).length, '0');

    // Reduced motion: park immediately at final value, no animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = pad(target);
      return;
    }

    // Deterministic initial value (always starts at 00).
    el.textContent = pad(0);

    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: target,
      duration: 1.2,
      ease: 'power3.out',
      paused: true,
      onUpdate() {
        el.textContent = pad(Math.round(state.v));
      },
      onComplete() {
        el.textContent = pad(target);
      },
    });

    // One ScrollTrigger — fires the tween when counter enters viewport.
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter() {
        tween.play();
      },
    });

    return () => {
      st.kill();
      tween.kill();
    };
  }, [target, total]);

  const padded = `0`.padStart(String(total).length, '0');
  return (
    <span ref={ref} className="tabular-nums">
      {padded}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="section-anchor relative bg-ink py-24 sm:py-32">
      <div className="section-pad mx-auto max-w-7xl">
        <p className="eyebrow mb-10 text-muted">{about.kicker}</p>

        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <h2 className="display text-[clamp(2.4rem,6vw,5.4rem)]">
              {about.headline.map((l, i) => (
                <RevealLine key={l} text={l} i={i} />
              ))}
            </h2>
          </div>

          <div className="self-end pb-2">
            <div className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8%' }}
                  transition={{ duration: 0.8, ease, delay: i * 0.08 }}
                  className={`max-w-md text-base leading-relaxed sm:text-lg ${
                    i === 0 ? 'text-cream' : 'text-cream-soft/90'
                  }`}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        {/* metrics */}
        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {about.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, ease, delay: i * 0.1 }}
              className="border-t border-line pt-5"
            >
              {m.value !== null ? (
                <div className="display text-4xl text-cream sm:text-6xl">
                  <CountUp target={m.value} total={10} />
                  <span className="text-accent-bright">{m.suffix}</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-cream">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span className="display text-xl text-cream sm:text-2xl">
                    {m.label.split(' ')[0]}
                    <br />
                    {m.label.split(' ').slice(1).join(' ')}
                  </span>
                </div>
              )}
              <p className="eyebrow mt-3 text-[0.6rem] text-muted">{m.meta}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}