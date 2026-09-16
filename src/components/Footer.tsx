import { motion } from 'framer-motion';
import { contact, footer, profile } from '../data/portfolio';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-2">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2"
        style={{ background: 'linear-gradient(to right, transparent, rgba(193,64,48,0.55), transparent)' }}
      />

      <div className="section-pad mx-auto max-w-7xl pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, ease }}
              className="display text-[clamp(2.6rem,7vw,6rem)] text-cream/95"
            >
              {profile.name}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mono mt-3 text-sm tracking-[0.14em] text-muted"
            >
              {footer.note}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {footer.tags.map((t) => (
                <span key={t} className="mono rounded-full border border-line px-3 py-1 text-[0.6rem] tracking-[0.16em] text-cream-soft/75">
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          <nav aria-label="Footer" className="lg:justify-self-end">
            <ul className="grid gap-2">
              {footer.columnLinks.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.07 }}
                >
                  <a
                    href={l.href}
                    className={i === footer.columnLinks.length - 1 ? 'group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:text-accent-bright' : 'group inline-flex items-center gap-2 text-sm text-cream-soft transition-colors hover:text-cream'}
                  >
                    {l.label}
                    <span className="text-accent-bright opacity-0 transition-opacity group-hover:opacity-100">↗</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="eyebrow text-[0.58rem] text-muted">
            © {new Date().getFullYear()} {profile.name} · {contact.displayEmail}
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="display text-sm tracking-[0.28em] text-cream/90 sm:text-base"
          >
            {footer.closing.toUpperCase()}
          </motion.p>
        </div>
      </div>
    </footer>
  );
}