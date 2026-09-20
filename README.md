# NOCTURNE · نوكتورن

An Arabic (RTL) site for a night café and roastery. The home page opens with a film that plays as you scroll, then
continues as a full landing page.

**Concept site.** NOCTURNE is a placeholder brand, not a real company. The coffees, address, hours and prices are sample
data and the site says so next to them. There is no shop and no checkout. The general coffee facts and brew ratios are
real, commonly used starting points.

## What is in it

- **Home:** scroll film → live "open now" status → the idea → six coffees → the menu → the roastery steps → a dose
  calculator → location, a hand-drawn night map and the week's hours drawn as nights → common questions.
- **`/coffees`** and **`/coffees/[slug]`**: six coffees named after night stars, filter by roast. The moon next to a name
  is the roast level (full moon = lightest).
- **`/ritual`**: five brew methods (V60, espresso, French press, cold brew, Saudi coffee) with steps and a calculator.
- **`/origin`**, **`/about`**, a 404 page.

## How the film works

- The film is a numbered image sequence drawn on a `<canvas>`; scroll position maps straight to a frame
  (`src/components/FilmExperience.tsx`). It is mirrored so the cup handle sits on the left and Arabic type has the right.
- Frames load progressively (`src/lib/frames.ts`): the first frame gates the reveal, the rest arrive coarse-to-fine, and
  frames near the viewer jump the queue.
- Wide screens get 1280×720 frames, portrait screens a 608×1080 crop (`src/lib/film.ts`).

## Content and credits

- Copy and data: `src/lib/site.ts`, `coffees.ts`, `brew.ts`, `cafe.ts`.
- The film is AI-generated video (Google Gemini). The café and roastery photographs are freely licensed photos from
  Wikimedia Commons, colour-graded; authors and licences are in `public/images/CREDITS.md` and on the about page.
- Type: Amiri (headlines), Tajawal (text), Inter Tight (the wordmark).

## Run

```bash
npm install
npm run dev
```

Next.js 16, React 19, GSAP, Lenis, Framer Motion.
