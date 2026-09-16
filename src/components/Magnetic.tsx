import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

type MagneticProps = {
  children: ReactNode;
  max?: number;
  strength?: number;
  className?: string;
};

/**
 * Magnetic micro-interaction: translates a small inner wrapper toward the cursor
 * when hovered, returns to origin on leave. The outer wrapper stays static so
 * pointer events never flutter.
 */
export default function Magnetic({
  children,
  max = 10,
  strength = 0.25,
  className,
}: MagneticProps) {
  const outerRef = useRef<HTMLSpanElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(inner, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(inner, 'y', { duration: 0.4, ease: 'power3.out' });

    const move = (e: PointerEvent) => {
      const r = outer.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      xTo(gsap.utils.clamp(-max, max, (e.clientX - cx) * strength));
      yTo(gsap.utils.clamp(-max, max, (e.clientY - cy) * strength));
    };

    const leave = () => {
      xTo(0);
      yTo(0);
    };

    outer.addEventListener('pointermove', move);
    outer.addEventListener('pointerleave', leave);
    return () => {
      outer.removeEventListener('pointermove', move);
      outer.removeEventListener('pointerleave', leave);
    };
  }, [max, strength]);

  return (
    <span ref={outerRef} className={className ?? 'inline-block'}>
      <span ref={innerRef} className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  );
}