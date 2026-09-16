import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CharacterHero from './CharacterHero';
import RotatingText from './RotatingText';
import Magnetic from './Magnetic';
import { hero, profile } from '../data/portfolio';
import { gsap, prefersReducedMotion } from '../lib/gsap';

const ease = [0.16, 1, 0.3, 1] as const;

const lineStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};

const word = {
  hidden: { y: '115%', rotate: 2.5 },
  show: { y: 0, rotate: 0, transition: { duration: 1.05, ease } },
};

function Headline() {
  return (
    <motion.h1
      variants={lineStagger}
      initial="hidden"
      animate="show"
      aria-label={hero.headline.join(' ')}
      className="display text-[clamp(3rem,9.5vw,8rem)] leading-[0.9]"
    >
      {hero.headline.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.06em] last:pb-0">
          {line.split(' ').map((w, wi) => (
            <motion.span key={wi} variants={word} className="inline-block will-change-transform">
              {w}
              {wi < line.split(' ').length - 1 ? '\u00A0' : ''}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const charRef = useRef<HTMLDivElement | null>(null);
  const envRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);

  // Cinematic exit — head-typography + character + environment leave together,
  // this section crossfading into the portfolio background. Scrubbed by scroll.
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7,
        },
      });
      tl.to(textRef.current, { y: -80, opacity: 0 }, 0)
        .to(charRef.current, { scale: 0.88, y: -50, opacity: 0.65 }, 0)
        .to(envRef.current, { opacity: 0 }, 0.05)
        .to(overlayRef.current, { opacity: 1 }, 0)
        .to(cueRef.current, { opacity: 0 }, 0);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* red cinematic environment */}
      <div ref={envRef} aria-hidden className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 100% at 72% 18%, #8a1c10 0%, #5c110d 34%, #300a08 66%, #150302 100%)',
          }}
        />
        <div className="absolute left-1/2 top-[30%] h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full">
          <div
            style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(224,91,69,0.34), rgba(224,91,69,0) 68%)',
            }}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="grid-lines absolute inset-0 opacity-[0.10] sm:opacity-[0.16]" />
      </div>

      {/* fallback dark wash that fuses hero into the site */}
      <div
        ref={overlayRef}
        aria-hidden
        className="absolute inset-0 bg-ink"
        style={{ opacity: 0 }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-end gap-10 px-5 pb-16 pt-24 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-4 lg:px-14 lg:pb-10">
        {/* left — typography */}
        <div ref={textRef} className="order-1 will-change-transform lg:order-none lg:pb-[6vh]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="mb-6 space-y-2"
          >
            <p className="eyebrow flex items-center gap-3 text-cream">
              <span className="text-accent-bright" aria-hidden>
                ◢
              </span>
              <span className="font-bold">{profile.name}</span>
            </p>
            <p className="eyebrow pl-6 text-[0.6rem] text-cream/60">{hero.eyebrow}</p>
          </motion.div>

          <Headline />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6"
          >
            <RotatingText />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease }}
            className="mt-9"
          >
            <div className="flex flex-wrap items-center gap-8">
              <Magnetic>
                <a
                  href="#work"
                  className="group inline-flex items-center gap-3 border-b border-accent-bright pb-1 text-sm font-semibold uppercase tracking-[0.18em] text-cream transition-colors hover:text-accent-bright"
                >
                  {hero.primaryCta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-3 border-b border-line-strong pb-1 text-sm font-semibold uppercase tracking-[0.18em] text-cream-soft transition-colors hover:border-cream/40 hover:text-cream"
                >
                  {hero.secondaryCta}
                  <span>↗</span>
                </a>
              </Magnetic>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10 flex items-center gap-2.5"
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-accent-bright" aria-hidden />
            <span className="mono text-[0.68rem] tracking-[0.22em] text-cream/60">
              {hero.status}
            </span>
          </motion.div>
        </div>

        {/* right — animated character */}
        <div
          ref={charRef}
          className="order-2 h-[46vh] min-h-[320px] will-change-transform sm:h-[52vh] lg:order-none lg:h-[calc(100svh-9rem)] lg:min-h-0 lg:max-h-[720px]"
        >
          <CharacterHero />
        </div>
      </div>

      {/* scroll cue — entry fade lives inside; scroll fade on the wrapper */}
      <div
        ref={cueRef}
        className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="mono text-[0.6rem] tracking-[0.3em] text-cream/55">SCROLL</span>
          <span className="block h-9 w-px overflow-hidden bg-line-strong">
            <motion.span
              className="block h-1/2 w-full bg-accent-bright"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}