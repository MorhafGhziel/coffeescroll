"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useCallback, useEffect, useRef, useState } from "react";
import { FILM, FILM_SCROLL_VH } from "@/lib/film";
import { FrameStore, type FrameSet } from "@/lib/frames";
import { FinalCta } from "./FinalCta";
import { Loader } from "./Loader";
import { Nav } from "./Nav";
import { ScrollIndicator } from "./ScrollIndicator";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHAPTERS = 6;

const Line = ({ children }: { children: React.ReactNode }) => (
  <span className="line">
    <span>{children}</span>
  </span>
);

/**
 * One continuous rendered camera move, scrubbed by scroll. Scroll position maps straight to a frame index:
 * scrolling back plays it backward, stopping freezes on the exact frame. All type is HTML over a canvas.
 */
export function FilmExperience() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const store = useRef<FrameStore | null>(null);
  const frame = useRef(0);
  const drawn = useRef<unknown>(null);
  const showFrame = useRef<(i: number) => void>(() => {});
  const [heroReady, setHeroReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [chapter, setChapter] = useState(0);
  const revealedRef = useRef(false);
  const onMenuToggle = useCallback((open: boolean) => {
    if (!revealedRef.current) return;
    if (open) lenis.current?.stop();
    else lenis.current?.start();
  }, []);

  /* ---------------------------------------------------------------- canvas + frames */
  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d", { alpha: false })!;
    let set: FrameSet | null = null;
    let raf = 0;

    const draw = () => {
      raf = 0;
      const s = store.current;
      if (!s) return;
      const img = s.nearest(frame.current);
      if (!img) return;
      const w = cv.width, h = cv.height;
      const iw = s.set.width, ih = s.set.height;
      // cover, centred: both sequences are already composed for their aspect
      const k = Math.max(w / iw, h / ih);
      const dw = iw * k, dh = ih * k;
      // the source is 720p: ask for the best resampling when it is scaled up (resizing the canvas resets this)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      drawn.current = img;
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const setup = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      const next = cv.clientWidth / cv.clientHeight < 0.8 ? FILM.mobile : FILM.desktop;
      if (next !== set) {
        set = next;
        store.current?.destroy();
        const s = new FrameStore(next, (i) => {
          // redraw only if the new frame is closer to where the viewer is than what's on screen
          if (i === frame.current || drawn.current !== s.nearest(frame.current)) request();
        });
        store.current = s;
        s.loadOne(0).then(() => {
          setHeroReady(true);
          request();
          s.start();
          s.focus(frame.current);
        });
      }
      request();
    };
    setup();
    const ro = new ResizeObserver(setup);
    ro.observe(cv);

    showFrame.current = (i: number) => {
      frame.current = i;
      store.current?.focus(i);
      request();
    };
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      store.current?.destroy();
    };
  }, []);

  /* ---------------------------------------------------------------- smooth scroll */
  useEffect(() => {
    history.scrollRestoration = "manual";
    scrollTo(0, 0);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const l = new Lenis({ duration: 1.2, smoothWheel: !reduced, autoRaf: false });
    lenis.current = l;
    l.stop();
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
    };
  }, []);

  /* ---------------------------------------------------------------- scroll -> frame, and the type over it */
  useGSAP(
    () => {
      if (!revealed) return;
      let lastChapter = -1;

      gsap.from(".film-hero .line > span", { yPercent: 115, duration: 1.6, stagger: 0.1, ease: "expo.out", delay: 0.2 });
      gsap.from(".film-hero .mono, .nav-inner, [data-indicator]", { opacity: 0, y: -10, duration: 1.4, stagger: 0.08, ease: "expo.out", delay: 0.7 });

      // the film itself: progress maps linearly to frames; Lenis provides the smoothing, so no extra scrub lag
      ScrollTrigger.create({
        trigger: ".film",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const s = store.current;
          if (!s) return;
          const i = Math.round(self.progress * (s.set.count - 1));
          showFrame.current(i);
          if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`;
          const c = Math.min(CHAPTERS - 1, Math.floor(self.progress * CHAPTERS));
          if (c !== lastChapter) {
            lastChapter = c;
            setChapter(c);
          }
        },
      });

      // copy beats: each fades in and out over its own span of the film (as fractions of total progress)
      const beat = (sel: string, a: number, b: number, c?: number, d?: number) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".film", start: "top top", end: "bottom bottom", scrub: true } });
        tl.fromTo(sel, { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: b - a, ease: "power2.out", immediateRender: true }, a);
        if (c !== undefined && d !== undefined) tl.to(sel, { opacity: 0, y: -30, filter: "blur(8px)", duration: d - c, ease: "power2.in" }, c);
        tl.set({}, {}, 1); // timeline length == film length, so positions above are fractions of the film
      };
      // hero is already on screen; it only leaves
      gsap.timeline({ scrollTrigger: { trigger: ".film", start: "top top", end: "bottom bottom", scrub: true } })
        .to(".film-hero .w1", { xPercent: -18, opacity: 0, filter: "blur(10px)", duration: 0.2, ease: "power1.in" }, 0.06)
        .to(".film-hero .w2", { xPercent: -10, opacity: 0, filter: "blur(10px)", duration: 0.2, ease: "power1.in" }, 0.09)
        .to(".film-hero .w3", { xPercent: -6, opacity: 0, filter: "blur(10px)", duration: 0.2, ease: "power1.in" }, 0.12)
        .to(".film-hero .mono", { opacity: 0, duration: 0.1 }, 0.05)
        .set({}, {}, 1);
      beat(".beat-approach", 0.3, 0.38, 0.5, 0.56);
      beat(".beat-crema", 0.62, 0.7, 0.8, 0.86);
      beat(".beat-depth", 0.9, 0.97);

      gsap.to(".nav-inner", { scale: 0.94, opacity: 0.82, ease: "none", scrollTrigger: { start: 0, end: () => innerHeight * 0.8, scrub: true } });
      ScrollTrigger.create({ start: 40, end: "max", onToggle: (self) => document.querySelector("[data-nav]")?.classList.toggle("is-scrolled", self.isActive) });
    },
    { scope: root, dependencies: [revealed] },
  );

  return (
    <div ref={root} id="top">
      {!revealed && (
        <Loader
          ready={heroReady}
          onDone={() => {
            revealedRef.current = true;
            setRevealed(true);
            lenis.current?.start();
          }}
        />
      )}
      <Nav onMenuToggle={onMenuToggle} />
      <ScrollIndicator index={chapter} total={CHAPTERS} fillRef={fill} />

      <main className="film" style={{ height: `${FILM_SCROLL_VH}vh` }}>
        <div className="film-stage">
          <canvas ref={canvas} className="film-canvas" aria-label="A steaming black espresso cup on dark wood; the camera moves slowly into the crema" role="img" />
          <div className="film-shade" aria-hidden="true" />

          <section className="film-hero" aria-label="Wake the senses">
            <h1 className="display">
              <span className="w1"><Line>Wake</Line></span>
              <span className="w2"><Line>The</Line></span>
              <span className="w3"><Line>Senses.</Line></span>
            </h1>
            <p className="mono">Specialty coffee<br />Roasted after dark</p>
          </section>

          <section className="film-beat beat-approach" aria-label="The first moment">
            <span className="mono label">02 — The first moment</span>
            <p className="quote">“Every roast begins with attention to detail.”</p>
          </section>

          <section className="film-beat beat-crema" aria-label="Depth in every pour">
            <h2 className="display">Depth<br />in every<br />pour.</h2>
            <ul className="mono tech">
              <li>Single origin</li>
              <li>Small batch</li>
              <li>Craft roasted</li>
            </ul>
          </section>

          <section className="film-beat beat-depth" aria-label="Stay a little longer">
            <h2 className="display">Stay<br />a little<br />longer.</h2>
          </section>
        </div>
      </main>

      <FinalCta />
    </div>
  );
}
