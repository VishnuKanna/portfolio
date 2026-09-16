import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { playground, type PlaygroundNode } from '../data/portfolio';

const ease = [0.16, 1, 0.3, 1] as const;

export default function ArchitecturePlayground() {
  const [active, setActive] = useState<PlaygroundNode>(playground[0]);

  return (
    <section className="section-anchor relative overflow-hidden bg-ink-2 py-24 sm:py-32">
      <div className="section-pad mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="eyebrow mb-6 text-muted">How I think about systems</p>
          <h2 className="display text-[clamp(2.4rem,6vw,5rem)]">The architecture playground</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-soft/85 sm:text-lg">
            This is the mental model I run on every request. Hover or focus a stage to see what
            happens there.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-20">
          {/* interactive stages */}
          <ul className="relative flex flex-col gap-2.5">
            <div aria-hidden className="absolute bottom-4 left-[17px] top-4 w-px bg-line-strong" />
            {playground.map((n, i) => {
              const isActive = active.id === n.id;
              return (
                <li key={n.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setActive(n)}
                    onFocus={() => setActive(n)}
                    onMouseEnter={() => setActive(n)}
                    aria-pressed={isActive}
                    aria-label={`Inspect ${n.label}`}
                    className={`group flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-all duration-500 ${
                      isActive
                        ? 'border-accent/60 bg-surface-2 shadow-[0_0_40px_-12px_rgba(193,64,48,0.4)]'
                        : 'border-line bg-surface/40 hover:border-line-strong'
                    }`}
                    style={{ paddingLeft: '2.5rem' }}
                  >
                    <span
                      aria-hidden
                      className={`absolute left-[11px] top-1/2 h-[13px] w-[13px] -translate-y-1/2 rounded-full border ${
                        isActive
                          ? 'border-accent-bright bg-accent'
                          : 'border-line-strong bg-ink'
                      }`}
                      style={
                        isActive
                          ? { boxShadow: '0 0 12px 2px rgba(224,91,69,0.55)' }
                          : undefined
                      }
                    />
                    <span className="mono w-6 text-[0.62rem] text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`mono text-xs uppercase tracking-[0.18em] transition-colors ${
                        isActive ? 'text-cream' : 'text-cream-soft/70'
                      }`}
                    >
                      {n.label}
                    </span>
                    <span className="mono ml-auto text-[0.58rem] tracking-[0.14em] text-muted">
                      {n.sub}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* detail panel */}
          <div className="relative min-h-[300px] lg:min-h-0">
            <div
              aria-hidden
              className="absolute right-0 top-0 h-64 w-64 rounded-full opacity-60"
              style={{
                background: 'radial-gradient(circle, rgba(193,64,48,0.2), rgba(193,64,48,0) 70%)',
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
                className="hairline relative h-full rounded-xl bg-surface/70 p-7 sm:p-10"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-[0.6rem] text-accent-bright">STAGE INSPECT</span>
                  <span className="mono text-[0.6rem] tracking-[0.2em] text-muted">v1.0</span>
                </div>

                <h3 className="display mt-8 text-3xl text-cream sm:text-5xl">{active.label}</h3>

                <p className="mono mt-2 text-[0.68rem] uppercase tracking-[0.22em] text-muted">
                  {active.sub}
                </p>

                <p className="mt-8 max-w-md text-lg leading-relaxed text-cream-soft/85">
                  {active.detail}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6">
                  <span className="mono text-[0.6rem] tracking-[0.2em] text-muted">CONTEXT</span>
                  {['observable', 'contract-first', 'resilient'].map((t) => (
                    <span
                      key={t}
                      className="mono rounded-full border border-line px-3 py-1 text-[0.6rem] tracking-[0.1em] text-cream-soft/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}