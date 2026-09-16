import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { heroVideo } from '../data/heroVideo';

type Mode = 'scrub' | 'scroll' | 'still';

function detectMode(): Mode {
  if (typeof window === 'undefined') return 'still';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'still';
  const fine = window.matchMedia('(pointer: fine)').matches;
  return fine ? 'scrub' : 'scroll';
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * THE HERO CHARACTER.
 *
 * One continuous interaction value — a horizontal bead across the hero —
 * mapped onto the supplied rotation plate's timeline. No images are swapped,
 * no React state touches high-frequency motion, the video is never played
 * during scrubbing and `currentTime` is only written when the change is
 * meaningful.
 *
 *   mouseX → user (0…1, immediate) → smoothing (GSAP ticker, time-constant
 *   ~380ms) → disp → video timeline → currentTime   (inertia, no snapping)
 *
 * Mouse leave returns the bead to CENTER with the same weighted settle, never
 * a hard reset.
 */
export function useCharacterScrub() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const figureRef = useRef<HTMLDivElement | null>(null);
  const lookRef = useRef(0);
  const [mode, setMode] = useState<Mode>(() => detectMode());

  // Poster → video crossfade (all modes). The character never appears empty.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let duration = 10;
    let revealed = false;

    gsap.set(video, { opacity: 0 });

    const readDuration = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) duration = video.duration;
    };

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      readDuration();
      video.currentTime = clamp(heroVideo.frontTime, 0, Math.max(duration - 0.05, 0));
      gsap.to(video, { opacity: 1, duration: mode === 'still' ? 0.6 : 1.05, ease: 'power2.inOut' });
      cleanupReady();
    };

    const onMeta = () => {
      readDuration();
      if (video.readyState >= 2) reveal();
    };
    const onCanPlay = () => reveal();

    const cleanupReady = () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('loadeddata', onCanPlay);
      video.removeEventListener('canplay', onCanPlay);
    };

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('loadeddata', onCanPlay);
    video.addEventListener('canplay', onCanPlay);
    if (video.readyState >= 2) reveal();

    return () => {
      cleanupReady();
      gsap.killTweensOf(video);
    };
  }, [mode]);

  // Desktop gaze-following: continuous, weighted, never snapping.
  useEffect(() => {
    if (mode !== 'scrub') return;

    const video = videoRef.current;
    const scene = sceneRef.current;
    const figure = figureRef.current;
    if (!video || !scene || !figure) return;

    // state.user — instant reflection of the cursor bead (0…1)
    // state.disp — smoothed value that actually drives the character
    // state.parT/state.parSm — vertical parallax (target vs. smoothed)
    const state = { user: 0.5, disp: 0.5, parT: 0.5, parSm: 0.5 };
    let vt: number = heroVideo.frontTime;
    let duration = 10;
    let lastMove = -1e9;

    const onMove = (e: PointerEvent) => {
      const r = scene.getBoundingClientRect();
      const nx = clamp((e.clientX - r.left) / Math.max(r.width, 1), 0, 1);
      const ny = clamp((e.clientY - r.top) / Math.max(r.height, 1), 0, 1);
      state.user = nx;
      state.parT = ny;
      lookRef.current = nx;
      lastMove = performance.now();
    };

    const onLeave = () => {
      // Settle back toward CENTER — the smoothing bed makes this seamless.
      state.user = 0.5;
      state.parT = 0.5;
    };

    const tick = (time: number, deltaTime: number) => {
      if (video.readyState < 2) return;

      const now = performance.now();
      const idle = now - lastMove > 1100;
      const dt = clamp(deltaTime, 4, 64);
      const to = (k: number) => 1 - Math.exp(-dt / k);

      // Weighted catch-up — tight enough to feel immediate, soft enough to not
      // snap. ~75ms on disp (≈0.20/frame), parallax trails just behind.
      state.disp += (state.user - state.disp) * to(75);
      state.parSm += (state.parT - state.parSm) * to(90);

      // Idle: breathe gently AROUND the current orientation (no reset to front).
      const idleOff = idle ? Math.sin(((time / 1000) * Math.PI * 2) / heroVideo.idlePeriod) * heroVideo.idleTurn : 0;

      const targetT =
        heroVideo.frontTime + (clamp(state.disp, 0, 1) - 0.5) * 2 * heroVideo.scrubRange + idleOff;
      vt += (targetT - vt) * to(170);
      vt = clamp(vt, 0, Math.max(duration - 0.05, 0));

      // Only seek when the delta is meaningful — no seek spam while parked.
      if (Math.abs(video.currentTime - vt) > 0.02) {
        video.currentTime = vt;
      }

      // Subtle physical response — the video carries the orientation, this
      // only adds a whisper of depth/parallax.
      const d = state.disp - 0.5;
      const y = (state.parSm - 0.5) * -10;
      const x = d * -14;
      const s = 1 + Math.abs(d) * 0.012;
      figure.style.transform = `perspective(900px) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotateY(${(d * 2.6).toFixed(2)}deg) scale(${s.toFixed(4)})`;
      lookRef.current = state.disp;
    };

    const readDuration = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) duration = video.duration;
    };

    scene.addEventListener('pointermove', onMove, { passive: true });
    scene.addEventListener('pointerleave', onLeave, { passive: true });
    video.addEventListener('loadedmetadata', readDuration);
    video.addEventListener('loadeddata', readDuration);
    gsap.ticker.add(tick);

    return () => {
      scene.removeEventListener('pointermove', onMove);
      scene.removeEventListener('pointerleave', onLeave);
      video.removeEventListener('loadedmetadata', readDuration);
      video.removeEventListener('loadeddata', readDuration);
      gsap.ticker.remove(tick);
      gsap.set(figure, { clearProps: 'transform' });
    };
  }, [mode]);

  // Mobile scroll-scrub: character rotation driven by scroll, never autoplaying.
  // Video stays paused; currentTime mapped from scroll progress with smoothing.
  useEffect(() => {
    if (mode !== 'scroll') return;
    const video = videoRef.current;
    const scene = sceneRef.current;
    if (!video || !scene) return;

    let duration = 10;
    const readDuration = () => {
      if (Number.isFinite(video.duration) && video.duration > 0)
        duration = video.duration;
    };

    // Park at front before any data loads (instant).
    video.currentTime = heroVideo.frontTime;

    video.addEventListener('loadedmetadata', readDuration);
    video.addEventListener('loadeddata', readDuration);

    // ONE ScrollTrigger — scrub maps hero scroll progress into currentTime.
    const st = ScrollTrigger.create({
      trigger: scene,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate(self) {
        if (video.readyState < 2) return;
        readDuration();
        const target = clamp(
          heroVideo.frontTime + (self.progress - 0.5) * heroVideo.scrubRange * 2,
          0,
          Math.max(duration - 0.05, 0)
        );
        if (Math.abs(video.currentTime - target) > 0.02) {
          video.currentTime = target;
        }
      },
    });

    return () => {
      video.removeEventListener('loadedmetadata', readDuration);
      video.removeEventListener('loadeddata', readDuration);
      st.kill();
    };
  }, [mode]);

  // Reduced motion: park the front frame once, forever.
  useEffect(() => {
    if (mode !== 'still') return;
    const video = videoRef.current;
    if (!video) return;
    const park = () => {
      if (!video) return;
      const d = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 10;
      video.currentTime = clamp(heroVideo.frontTime, 0, Math.max(d - 0.05, 0));
    };
    video.addEventListener('loadedmetadata', park);
    video.addEventListener('loadeddata', park);
    video.addEventListener('canplay', park);
    return () => {
      video.removeEventListener('loadedmetadata', park);
      video.removeEventListener('loadeddata', park);
      video.removeEventListener('canplay', park);
    };
  }, [mode]);

  return { mode, videoRef, sceneRef, figureRef, lookRef };
}