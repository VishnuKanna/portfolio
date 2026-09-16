export const heroVideo = {
  src: '/assets/char-rotate.mp4',
  poster: '/assets/char-poster.jpg',
  /** seconds of the plate where the character faces near-camera. Tune to match the plate. */
  frontTime: 4.2,
  /** how far (seconds) a full-left / full-right mouse position scrubs away from `frontTime`. */
  scrubRange: 2.4,
  /** amplitude (seconds) of the soft continuous turn when the visitor is not moving the mouse. */
  idleTurn: 1.1,
  idlePeriod: 8.5,
} as const;