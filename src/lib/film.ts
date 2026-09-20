import type { FrameSet } from "./frames";

/**
 * The film: a generated clip (Gemini, out/coffee/gemini2/source.mp4, 1280x720 @ 24 fps): one continuous push from the
 * steaming cup on the table into the macro crema. Every source frame is used at its native size, so nothing is lost.
 * Desktop gets the 16:9 sequence; portrait screens get a separate portrait-cropped sequence that keeps the subject
 * in frame (see nocturne-film/scripts/export_web.py; run with CX_START=0.5).
 * Earlier films: the Blender forest film re-exports from out/nocturne-film/forest/frames, and the Blender table film
 * is kept in nocturne-film/web-backup-table/.
 */
const pad = (i: number) => String(i + 1).padStart(4, "0");

export const FILM: { desktop: FrameSet; mobile: FrameSet } = {
  desktop: { count: 240, width: 1280, height: 720, url: (i) => `/film/desktop/${pad(i)}.webp` },
  mobile: { count: 240, width: 608, height: 1080, url: (i) => `/film/mobile/${pad(i)}.webp` },
};

/** How many viewport heights of scrolling the whole film takes. */
export const FILM_SCROLL_VH = 900;
