# Vishnu Kanna J. — Cinematic Engineering Portfolio

A premium, motion-driven portfolio for a senior backend engineer. The page reads like a film:
a red cinematic hero with a scrub-responsive 3D character, a typographic about section,
interactive core-execution pillars, sticky-scroll case studies, an architecture playground,
and a live "payload" contact form.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@theme` tokens)
- Framer Motion (scroll-linked `useScroll`/`useTransform`, springs, AnimatePresence)
- Lucide-free: system glyphs and custom SVG/mono marks only
- No custom cursor, no heavy libs — GPU-friendly transforms throughout

## Content

All professional content lives in `src/data/portfolio.ts` (profile, hero, about, pillars,
projects, philosophy, experience, playground, contact, footer). Update facts there without
touching the presentation layer.

Hero-character timing constants live in `src/data/heroVideo.ts` (`frontTime`, `scrubRange`,
`idleTurn`) — tune `frontTime` to match whichever frame of `char-rotate.mp4` faces the camera.

## Structure

```text
src/
  data/portfolio.ts          All resume + narrative content
  data/heroVideo.ts          Character video config + scrub timing
  hooks/useCharacterScrub.ts Video-timeline gaze-following (desktop), static frame
  components/
    Nav.tsx                  Floating nav + mobile menu
    Hero.tsx                 Red cinematic hero, scroll transforms, headline reveal
    CharacterHero.tsx        Video stage: masks, glow, environment labels
    RotatingText.tsx         Rotating identity reel
    TechMarquee.tsx          Pausing tech ticker
    About.tsx                Editorial about + count-up metrics
    CoreExecution.tsx        4 interactive pillars with hover flows
    FlowViz.tsx              Reusable abstract data-flow animation
    Projects.tsx             Sticky scroll storytelling (4 case studies)
    Philosophy.tsx           Slow typographic philosophy interlude
    Experience.tsx           Scroll-drawn career timeline
    ArchitecturePlayground.tsx  Hoverable system-node inspector
    Contact.tsx              Form + state machine + validation
    PayloadPreview.tsx       Live syntax-highlighted JSON payload
    Footer.tsx
```

## Character asset

`public/assets/char-rotate.mp4` (10s, 1280×720 H.264) is the supplied rotation plate.
`public/assets/char-poster.jpg` is a downscaled front-facing poster for instant paint.

Behavior:

- Desktop (fine pointer, no reduced-motion): the video stays paused and its timeline is
  scrubbed so the character's gaze softly follows the cursor (left → front → right). When
  idle it drifts in a slow, subtle turn near the front pose.
- Mobile / coarse pointer: muted inline autoplay loop.
- `prefers-reduced-motion`: a static front-facing frame.

## Motion model

- `useScroll` + `useTransform` drive the hero parallax, projects progression, timeline draw.
- Packets in `FlowViz` animate only while in view and only under motion — GPU transforms only.
- Film grain + marquee are CSS-only; `prefers-reduced-motion` collapses animation globally.
- No layout-thrash patterns: no animating width/height or heavy box-shadows.

## Contact form

The `endpoint` in `contactSection` (`src/data/portfolio.ts`) is intentionally empty. When
left empty the submission resolves locally (IDLE → SERIALIZING… → TRANSMITTING… →
✓ PAYLOAD ACCEPTED) without pretending to reach a server. Set a real `endpoint` to POST the
payload over the network and surface genuine success/error states.

## Run

```bash
npm install
npm run dev      # dev server
npm run build    # type-check (tsc -b) + production build
npm run preview  # serve the production build
```

## Update links

LinkedIn / GitHub / email live in `src/data/portfolio.ts` (`contact`, `contactSection.endpoint`).