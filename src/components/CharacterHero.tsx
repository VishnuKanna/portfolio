import { useCharacterScrub } from '../hooks/useCharacterScrub';
import { heroVideo } from '../data/heroVideo';

const labels = [
  { id: 2, cls: 'right-[8%] top-[16%]', text: '200 · OK', delay: '1.2s' },
  { id: 3, cls: 'left-[7%] bottom-[28%]', text: 'KAFKA · STREAM', delay: '2.1s' },
];

export default function CharacterHero() {
  const { mode, videoRef, sceneRef, figureRef } = useCharacterScrub();

  return (
    <div
      ref={sceneRef}
      className="relative flex h-full w-full select-none items-center justify-center"
      aria-label="Animated character of Vishnu facing the visitor, turning subtly with the cursor"
    >
      {/* environment glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(212,74,52,0.5), rgba(168,31,16,0.28) 34%, rgba(24,5,4,0) 66%)',
        }}
      />

      {/* faint engineering grid */}
      <div
        aria-hidden
        className="grid-lines absolute left-1/2 top-1/2 hidden h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 opacity-40 sm:block"
        style={{
          maskImage: 'radial-gradient(ellipse 55% 52% at 50% 48%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 55% 52% at 50% 48%, black 30%, transparent 75%)',
        }}
      />

      {/* tracked figure */}
      <div
        ref={figureRef}
        className="relative will-change-transform"
        style={{ perspective: 900 }}
      >
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255,132,96,0.35), rgba(122,22,10,0) 70%)',
            filter: 'blur(28px)',
          }}
        />

        {/* poster layer — visible from the first paint; video fades in over it */}
        <img
          src={heroVideo.poster}
          alt=""
          aria-hidden
          className="char-mask pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden
          className="char-video char-mask relative aspect-[3/4] h-[min(56vh,560px)] w-auto opacity-0 sm:h-[min(62vh,640px)]"
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>

        {/* soft inner vignette to fuse the video frame edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 62% 60% at 50% 36%, transparent 44%, rgba(12,2,1,0.5) 80%, rgba(10,1,1,0.9) 100%)',
            maskImage: 'radial-gradient(ellipse 62% 58% at 50% 34%, transparent 0 40%, black 70% 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 62% 58% at 50% 34%, transparent 0 40%, black 70% 100%)',
          }}
        />
      </div>

      {/* floating system labels — technical flavor, not neon */}
      {labels.map((l) => (
        <span
          key={l.id}
          aria-hidden
          className={`mono float-y absolute hidden text-[0.6rem] tracking-[0.24em] text-cream/40 sm:block ${l.cls}`}
          style={{ ['--float-delay' as string]: l.delay }}
        >
          {l.text}
        </span>
      ))}
    </div>
  );
}