/**
 * Shared, mutable scene state written by the scroll timeline and read every frame by the particle canvas.
 * A plain object (not React state) so scrolling never triggers re-renders.
 */
export const atmosphere = {
  /** 0–1 how many motes are visible */
  density: 0.55,
  /** 0–1 how warm / ember-like the motes are */
  warmth: 0.2,
  /** scroll velocity from Lenis, px per frame */
  velocity: 0,
};
