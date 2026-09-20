import { SOURCE } from "./chapters";

/**
 * How a campaign frame is laid out in a viewport.
 *
 * Landscape screens: behaves like `object-fit: cover`, but the crop is centred on the subject rather than the
 * middle of the image (ultrawide crops top/bottom, 4:3 crops the sides).
 * Portrait screens: a 16:9 frame covered to full height would blow the cup up past the screen edges, so instead
 * the frame is shown at ~1.5× screen width and floats in darkness, with its edges feathered into the background.
 */
export function frameLayout(vw: number, vh: number, focal: [number, number]) {
  const portrait = vw / vh < 0.9;
  const s = portrait ? Math.max(vw / (SOURCE.width * 0.66), (vh * 0.52) / SOURCE.height) : Math.max(vw / SOURCE.width, vh / SOURCE.height);
  const w = SOURCE.width * s;
  const h = SOURCE.height * s;
  const clampAxis = (view: number, size: number, f: number) => {
    const centred = view / 2 - f * size;
    // when the frame is larger than the view it must still cover it; when smaller it simply centres on the subject
    return size >= view ? Math.min(0, Math.max(view - size, centred)) : centred;
  };
  const x = clampAxis(vw, w, focal[0]);
  const y = portrait ? vh * 0.5 - focal[1] * h : clampAxis(vh, h, focal[1]);
  const point = (p: [number, number]) => ({ x: x + p[0] * w, y: y + p[1] * h });
  return { portrait, w, h, x, y, point };
}
