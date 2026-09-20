/**
 * The six frames of the campaign, in story order.
 * `focal` is the subject position in the source image (0–1). It drives responsive cropping (the subject stays
 * centred on portrait screens) and the transform origin of every zoom, so the camera always moves toward the cup.
 */
export type Chapter = {
  n: number;
  id: string;
  title: string;
  src: string;
  alt: string;
  focal: [number, number];
  /** optional second point of interest, e.g. where the pour meets the cup */
  detail?: [number, number];
  /** a masked copy of the frame used for foreground parallax (beans at the edges move faster than the cup) */
  depth?: boolean;
};

export const SOURCE = { width: 1672, height: 941 };

export const CHAPTERS: Chapter[] = [
  { n: 1, id: "floating-cup", title: "Floating cup", src: "/images/01-floating-cup.png", alt: "A black cup of espresso suspended in darkness among drifting coffee beans and grounds", focal: [0.515, 0.47] },
  { n: 2, id: "top-down", title: "The first moment", src: "/images/02-top-down.png", alt: "Espresso seen from above on a dark wooden table, scattered with roasted beans", focal: [0.5, 0.44], detail: [0.49, 0.45], depth: true },
  { n: 3, id: "macro-crema", title: "Crema", src: "/images/03-macro-crema.png", alt: "Extreme close-up of golden crema swirling at the rim of a black cup", focal: [0.62, 0.48] },
  { n: 4, id: "coffee-beans", title: "From bean to ritual", src: "/images/04-coffee-beans.png", alt: "A steaming espresso on rough wood with roasted beans and a drift of coffee dust", focal: [0.55, 0.47], depth: true },
  { n: 5, id: "the-pour", title: "The pour", src: "/images/05-the-pour.png", alt: "Coffee pouring into a black cup, splashing as beans fly through warm light", focal: [0.49, 0.6], detail: [0.53, 0.3] },
  { n: 6, id: "final-ritual", title: "Final ritual", src: "/images/06-final-ritual.png", alt: "A small steaming cup resting alone on a dark wooden surface", focal: [0.586, 0.54], detail: [0.598, 0.47] },
];
