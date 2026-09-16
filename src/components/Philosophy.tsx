import { motion } from 'framer-motion';
import { philosophy, philosophyQuestions, loopLine } from '../data/portfolio';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Philosophy() {
  return (
    <section className="section-anchor relative overflow-hidden bg-ink-2 py-28 sm:py-40">
      <div
        aria-hidden
        className="absolute -left-40 top-1/3 h-[60vh] w-[60vh] rounded-full opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(193,64,48,0.16), rgba(193,64,48,0) 70%)',
        }}
      />

      <div className="section-pad mx-auto max-w-6xl">
        <p className="eyebrow mb-12 text-muted">On Engineering</p>

        <div className="space-y-2">
          {philosophy.map((g, i) => (
            <div key={i}>
              <h2 className="display text-[clamp(2.1rem,5.4vw,4.8rem)]">
                <span className="block overflow-hidden pb-[0.05em]">
                  <motion.span
                    className="block text-cream-soft/80"
                    initial={{ y: '112%' }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, margin: '-15%' }}
                    transition={{ duration: 1, ease }}
                  >
                    {g.line}
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-[0.05em]">
                  <motion.span
                    className="block text-cream"
                    initial={{ y: '112%' }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, margin: '-15%' }}
                    transition={{ duration: 1, ease, delay: 0.12 }}
                  >
                    {g.strong}
                  </motion.span>
                </span>
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {philosophyQuestions.map((q, i) => (
            <motion.p
              key={q}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, ease, delay: i * 0.09 }}
              className="mono border-t border-line pt-4 text-sm leading-relaxed text-cream-soft/75"
            >
              <span className="mr-3 text-accent-bright">{String(i + 1).padStart(2, '0')}</span>
              {q}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1, ease, delay: 0.2 }}
          className="mt-20"
        >
          <p className="mono text-[0.62rem] tracking-[0.3em] text-muted">THE LOOP</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            {loopLine.split(' \u2192 ').map((step, i, arr) => (
              <span key={step} className="flex items-center gap-3">
                <span className="display text-2xl text-cream sm:text-3xl">{step}</span>
                {i < arr.length - 1 && <span className="text-accent-bright">→</span>}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}