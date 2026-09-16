import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import FlowViz from './FlowViz';
import { coreExecution, type CorePillar } from '../data/portfolio';

const ease = [0.16, 1, 0.3, 1] as const;

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(max-width: 1023px)');
    const f = () => setM(q.matches);
    f();
    q.addEventListener('change', f);
    return () => q.removeEventListener('change', f);
  }, []);
  return m;
}

function Pillar({ p, i }: { p: CorePillar; i: number }) {
  const mobile = useIsMobile();
  const [open, setOpen] = useState(mobile);

  useEffect(() => setOpen(mobile), [mobile]);

  const toggle = () => setOpen((v) => !v);

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.9, ease, delay: (i % 2) * 0.12 }}
      onMouseEnter={() => !mobile && setOpen(true)}
      onMouseLeave={() => !mobile && setOpen(false)}
      onFocus={() => !mobile && setOpen(true)}
      onBlur={() => !mobile && setOpen(false)}
      tabIndex={0}
      className={`group hairline relative grid gap-8 overflow-hidden rounded-xl p-6 outline-offset-4 transition-[background-color,color,box-shadow] duration-500 sm:p-8 lg:grid-cols-[1fr_240px] lg:gap-10 ${
        open
          ? 'bg-surface-2/90 shadow-[0_30px_80px_-40px_rgba(193,64,48,0.35)]'
          : 'bg-surface/50 hover:bg-surface-2/40'
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full transition-opacity duration-700 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(193,64,48,0.28), rgba(193,64,48,0) 70%)',
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <span className="mono text-sm text-accent-bright">{p.index}</span>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${p.title}`}
            className={`mono text-xs text-muted transition-transform duration-500 lg:hidden ${
              open ? 'rotate-45 text-accent-bright' : ''
            }`}
          >
            +
          </button>
        </div>

        <h3 className="display mt-4 text-3xl text-cream sm:text-4xl">{p.title}</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-cream-soft/85">{p.blurb}</p>

        <div
          className={`mt-6 flex flex-wrap gap-2 transition-all duration-500 ${
            open ? 'opacity-100' : 'opacity-45'
          }`}
        >
          {p.tech.map((t) => (
            <span
              key={t}
              className="mono rounded-full border border-line px-2.5 py-1 text-[0.62rem] tracking-[0.12em] text-cream-soft"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div
        className={`relative transition-opacity duration-500 lg:border-l lg:border-line lg:pl-8 ${
          open ? 'opacity-100' : 'opacity-40 lg:opacity-35'
        }`}
      >
        <span className="eyebrow mb-3 block text-[0.58rem] text-muted">ABSTRACT FLOW</span>
        <FlowViz stages={p.flow} active={open} compact />
      </div>
    </motion.article>
  );
}

export default function CoreExecution() {
  return (
    <section id="execution" className="section-anchor relative bg-ink-2 py-24 sm:py-32">
      <div className="section-pad mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <p className="eyebrow mb-6 text-muted">02 / Expertise</p>
          <h2 className="display text-[clamp(2.4rem,6vw,5rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: '112%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.95, ease }}
              >
                Core execution
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
            The areas where I turn engineering problems into production systems. Hover a panel to
            trace the flow.
          </motion.p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {coreExecution.map((p, i) => (
            <Pillar key={p.index} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}