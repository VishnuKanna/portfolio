import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PayloadPreview, { type PayloadStatus } from './PayloadPreview';
import Magnetic from './Magnetic';
import { contact, contactSection } from '../data/portfolio';

const ease = [0.16, 1, 0.3, 1] as const;

type Fields = { name: string; email: string; message: string };
type Phase = 'idle' | 'serializing' | 'transmitting' | 'success' | 'error';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function Field({
  id,
  label,
  value,
  error,
  hint,
  textarea,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint: string;
  textarea?: boolean;
  onChange: (v: string) => void;
}) {
  const shared = `mono w-full border-0 border-b bg-transparent px-1 py-3 text-sm text-cream placeholder:text-muted/50 focus:outline-none transition-colors ${
    error ? 'border-accent' : 'border-line-strong focus:border-accent-bright'
  }`;
  return (
    <div>
      <label htmlFor={id} className="eyebrow block text-[0.6rem] text-muted">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="Describe the system…"
          className={`${shared} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={id === 'email' ? 'email' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={id === 'name' ? 'name' : id === 'email' ? 'email' : 'off'}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder={hint}
          className={shared}
        />
      )}
      <div className="flex min-h-[1.1rem] items-center gap-3">
        <AnimatePresence>
          {error && (
            <motion.span
              key="err"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              id={`${id}-error`}
              className="mono text-[0.62rem] tracking-[0.08em] text-accent-bright"
            >
              × {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SendButton({ phase, disabled }: { phase: Phase; disabled: boolean }) {
  const styles = {
    idle: '',
    serializing: 'opacity-90',
    transmitting: 'opacity-90',
    success: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200',
    error: 'border-accent bg-accent/10 text-accent-bright',
  }[phase];

  const label = {
    idle: 'SEND PAYLOAD',
    serializing: 'SERIALIZING…',
    transmitting: 'TRANSMITTING…',
    success: '✓ PAYLOAD ACCEPTED',
    error: '× RETRY PAYLOAD',
  }[phase];

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      whileTap={phase === 'idle' ? { scale: 0.98 } : undefined}
      className={`group relative inline-flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-lg border px-8 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${
        phase === 'idle'
          ? 'border-line-strong bg-surface/60 text-cream hover:border-accent/70 hover:bg-accent/10'
          : styles
      } ${disabled ? 'cursor-wait' : 'cursor-pointer'}`}
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-3">
        {label}
        {phase === 'idle' && (
          <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <span className="inline-block group-hover:hidden">→</span>
            <span className="hidden group-hover:inline">↗</span>
          </span>
        )}
      </span>
    </motion.button>
  );
}

export default function Contact() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [phase, setPhase] = useState<Phase>('idle');

  const set = (k: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  useEffect(() => {
    if (phase === 'success') {
      const t = setTimeout(() => setPhase('idle'), 4200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const validate = (): Partial<Fields> => {
    const e: Partial<Fields> = {};
    if (!fields.name.trim()) e.name = 'NAME REQUIRED';
    if (!fields.email.trim()) e.email = 'EMAIL REQUIRED';
    else if (!emailOk(fields.email)) e.email = 'INVALID ADDRESS';
    if (!fields.message.trim()) e.message = 'MESSAGE REQUIRED';
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (phase === 'serializing' || phase === 'transmitting') return;
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setPhase('serializing');
    await sleep(700);
    setPhase('transmitting');
    await sleep(950);
    const endpoint = contactSection.endpoint.trim();
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: fields.name, email: fields.email, message: fields.message }),
        });
        if (!res.ok) throw new Error('bad response');
      }
      setPhase('success');
    } catch {
      setPhase('error');
    }
  };

  const previewStatus: PayloadStatus =
    phase === 'serializing' ? 'serializing' : phase === 'transmitting' ? 'transmitting' : phase === 'success' ? 'accepted' : phase === 'error' ? 'error' : fields.name.trim() && fields.email.trim() && fields.message.trim() ? 'ready' : 'typing';

  return (
    <section id="contact" className="section-anchor relative overflow-hidden bg-ink py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-[70vh] w-[70vh] translate-x-1/4 translate-y-1/4 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(193,64,48,0.24), rgba(193,64,48,0) 70%)' }}
      />

      <div className="section-pad relative mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* left — pitch + channels */}
          <div>
            <p className="eyebrow mb-6 text-muted">{contactSection.kicker}</p>
            <h2 className="display text-[clamp(2.4rem,6vw,5rem)]">
              {contactSection.headline.map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ y: '112%' }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.95, ease, delay: i * 0.08 }}
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="mt-6 max-w-md text-base leading-relaxed text-cream-soft/85 sm:text-lg"
            >
              {contactSection.copy}
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, ease, delay: 0.3 }}
              className="mt-10 space-y-3"
            >
              {(
                [
                  ['Email', contact.email, false],
                  ['LinkedIn', contact.linkedin, true],
                  ['GitHub', contact.github, true],
                ] as const
              ).map(([label, href, external]) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group inline-flex items-center gap-3 border-b border-line pb-0.5 text-sm text-cream-soft transition-colors hover:border-accent-bright hover:text-cream"
                  >
                    <span className="eyebrow w-16 text-muted">{label}</span>
                    <span className="text-accent-bright transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* right — form + payload */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.9, ease }}
            className="space-y-8"
          >
            <form onSubmit={onSubmit} noValidate className="hairline rounded-xl bg-surface/50 p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="eyebrow text-[0.6rem] text-accent-bright">NEW MESSAGE</span>
                <span className="mono text-[0.6rem] tracking-[0.2em] text-muted">POST /contact</span>
              </div>

              <div className="space-y-5">
                <Field id="name" label="Name" hint="Jane Engineer" value={fields.name} error={errors.name} onChange={set('name')} />
                <Field id="email" label="Email" hint="jane@company.com" value={fields.email} error={errors.email} onChange={set('email')} />
                <Field id="message" label="Message" hint="Let's build something." value={fields.message} error={errors.message} textarea onChange={set('message')} />
                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                <Magnetic className="block" max={8} strength={0.18}>
                  <SendButton phase={phase} disabled={phase === 'serializing' || phase === 'transmitting'} />
                </Magnetic>
              </div>

              <p className="mono mt-4 text-[0.56rem] leading-relaxed tracking-[0.12em] text-muted/70">
                {phase === 'success'
                  ? 'PAYLOAD ACCEPTED · THANK YOU'
                  : phase === 'error'
                    ? 'TRANSMISSION FAILED · CHECK CHANNEL AND RETRY'
                    : 'AUTH VIA EMAIL · TLS 1.3 · RESPONSE IN 1–2 DAYS'}
              </p>
            </form>

            <PayloadPreview name={fields.name} email={fields.email} message={fields.message} status={previewStatus} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}