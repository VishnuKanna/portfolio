import { useEffect, useMemo, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

export type PayloadStatus = 'typing' | 'ready' | 'serializing' | 'transmitting' | 'accepted' | 'error';

type Tok = { t: 'key' | 'val' | 'punct' | 'num'; v: string };

function tokenize(json: string): Tok[] {
  const out: Tok[] = [];
  const re = /("[^"\\]*(?:\\.[^"\\]*)*")|(-?\d+)|([{}[\]",:])/g;
  let expectKey = true;
  let m: RegExpExecArray | null;
  while ((m = re.exec(json))) {
    const str = m[1];
    const num = m[2];
    const punct = m[3];
    if (str) {
      out.push({ t: expectKey ? 'key' : 'val', v: str });
      expectKey = false;
    } else if (num) {
      out.push({ t: 'num', v: num });
      expectKey = false;
    } else if (punct) {
      out.push({ t: 'punct', v: punct });
      if (punct === '{' || punct === ',') expectKey = true;
      else if (punct === ':') expectKey = false;
      else if (punct === '}') expectKey = false;
    }
  }
  return out;
}

const cls: Record<Tok['t'], string> = {
  key: 'text-cream-soft',
  val: 'text-accent-bright',
  num: 'text-cream',
  punct: 'text-muted',
};

type PayloadPreviewProps = {
  name: string;
  email: string;
  message: string;
  status: PayloadStatus;
};

export default function PayloadPreview({ name, email, message, status }: PayloadPreviewProps) {
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  // GSAP-driven cursor blink — no CSS animation pumping during writes.
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1 });
      return;
    }
    if (status === 'serializing' || status === 'transmitting') {
      const tween = gsap.to(el, { opacity: 0.1, duration: 0.55, yoyo: true, repeat: -1, ease: 'power1.inOut' });
      return () => {
        tween.kill();
      };
    }
    gsap.set(el, { opacity: 1 });
    return;
  }, [status]);
  const json = useMemo(() => {
    if (status === 'accepted') {
      return JSON.stringify({ status: 202, message: 'Payload accepted.' }, null, 2);
    }
    const s = status === 'serializing' ? 'serializing' : status === 'transmitting' ? 'transmitting' : status === 'error' ? 'error' : name.trim() && email.trim() && message.trim() ? 'ready' : 'filling';
    return JSON.stringify({ name, email, message, status: s }, null, 2);
  }, [name, email, message, status]);

  const lines = useMemo(() => json.split('\n'), [json]);
  const tokens = useMemo(() => tokenize(json), [json]);

  const chip = {
    typing: ['LIVE', 'text-cream-soft', 'bg-surface-2'],
    ready: ['READY', 'text-emerald-300', 'bg-surface-2'],
    serializing: ['SER', 'text-amber-300', 'bg-surface-2'],
    transmitting: ['TX', 'text-amber-300', 'bg-surface-2'],
    accepted: ['202', 'text-emerald-300', 'bg-accent/15'],
    error: ['ERR', 'text-accent-bright', 'bg-accent/15'],
  }[status];

  return (
    <div className="hairline overflow-hidden rounded-xl bg-ink-3/90 shadow-[0_40px_120px_-50px_rgba(193,64,48,0.35)]">
      {/* window header */}
      <div className="flex items-center justify-between border-b border-line bg-surface/60 px-4 py-3">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#e05b45]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e0c245]/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#53c56a]/60" />
        </div>
        <span className="mono text-[0.64rem] tracking-[0.18em] text-muted">payload.json</span>
        <span className={`mono rounded-full border border-line px-2 py-0.5 text-[0.56rem] tracking-[0.18em] ${chip[1]} ${chip[2]}`}>
          {chip[0]}
        </span>
      </div>

      {/* body */}
      <div className="flex gap-4 overflow-x-auto p-5 sm:p-6" role="log" aria-live="polite">
        <ol className="mono select-none text-right text-[0.72rem] leading-[1.65] text-muted/40" aria-hidden>
          {lines.map((_, i) => (
            <li key={i}>{i + 1}</li>
          ))}
        </ol>
        <pre className="mono flex-1 whitespace-pre text-[0.78rem] leading-[1.65] text-cream-soft sm:text-[0.82rem]">
          {tokens.map((t, i) => (
            <span key={i} className={cls[t.t]}>
              {t.v}
            </span>
          ))}
          {status === 'serializing' || status === 'transmitting' ? (
            <span ref={cursorRef} className="inline-block">▍</span>
          ) : null}
        </pre>
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
        <span className="mono text-[0.56rem] tracking-[0.2em] text-muted">SCHEMA v1</span>
        <span className="mono text-[0.56rem] tracking-[0.2em] text-muted">UTF-8 · JSON</span>
      </div>
    </div>
  );
}