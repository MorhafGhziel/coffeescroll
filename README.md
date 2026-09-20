# NOCTURNE · coffee scroll film

A one-page coffee site where scrolling plays a film: the camera pushes from a steaming cup into the crema, and the
type appears over it.

**Concept site.** NOCTURNE is a placeholder brand, not a real company. There is no shop, no prices and no orders.

## How it works

- The film is a numbered image sequence drawn on a `<canvas>`. Scroll position maps straight to a frame, so scrolling
  back plays it backward and stopping freezes on the exact frame (`src/components/FilmExperience.tsx`).
- Frames load progressively (`src/lib/frames.ts`): the first frame alone gates the reveal, the rest arrive
  coarse-to-fine, and frames near the viewer always jump the queue.
- Wide screens get 16:9 frames (1280×720); portrait screens get a separate portrait crop (608×1080) that keeps the cup
  centred (`src/lib/film.ts`).
- GSAP ScrollTrigger + Lenis drive the scroll; all text is HTML over the canvas.

## The film

The clip is AI-generated video (Google Gemini), 10 s at 1280×720, split into 240 frames at native size.

## Run

```bash
npm install
npm run dev
```

Next.js 16, React 19, GSAP, Lenis.
