"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { atmosphere } from "@/lib/atmosphere";
import { CHAPTERS } from "@/lib/chapters";
import { frameLayout } from "@/lib/cover";
import { FinalCta } from "./FinalCta";
import { Loader } from "./Loader";
import { Nav } from "./Nav";
import { Particles } from "./Particles";
import { ScrollIndicator } from "./ScrollIndicator";
import { Steam } from "./Steam";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Timeline length in "beats"; each beat is SCROLL_PER_BEAT % of the viewport height of scrolling. */
const DURATION = 14.4;
const SCROLL_PER_BEAT = 85;
/** Timeline time at which chapters 02…06 take over (drives the 01/06 counter and lazy loading). */
const HANDOFFS = [1.7, 4.0, 6.3, 9.0, 11.6];
/** Where nav anchors land, in timeline beats. */
const ANCHORS: Record<string, number> = { top: 0, about: 2.9, roasts: 5.0, origin: 7.9, ritual: 13.0 };

type Geo = { fx: number; fy: number; dx: number; dy: number };

const Line = ({ children }: { children: React.ReactNode }) => (
  <span className="line">
    <span>{children}</span>
  </span>
);

export function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const warp = useRef<SVGFEDisplacementMapElement>(null);
  const geo = useRef<Record<number, Geo>>({});
  const lenis = useRef<Lenis | null>(null);
  const story = useRef<ScrollTrigger | null>(null);

  const [heroLoaded, setHeroLoaded] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [chapter, setChapter] = useState(0);
  // images for chapters beyond this count are not requested yet
  const [mounted, setMounted] = useState(1);

  /* ------------------------------------------------------------ smooth scroll */
  useEffect(() => {
    history.scrollRestoration = "manual";
    scrollTo(0, 0);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const l = new Lenis({ duration: 1.3, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: !reduced, autoRaf: false });
    lenis.current = l;
    l.stop();
    l.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      atmosphere.velocity = e.velocity;
    });
    const raf = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    document.fonts.ready.then(() => setFontsReady(true));
    // never trap the visitor behind the loader if the hero image stalls
    const safety = setTimeout(() => setHeroLoaded(true), 8000);
    return () => {
      clearTimeout(safety);
      gsap.ticker.remove(raf);
      l.destroy();
    };
  }, []);

  const onMenuToggle = useCallback((open: boolean) => {
    if (!revealed) return;
    if (open) lenis.current?.stop();
    else lenis.current?.start();
  }, [revealed]);

  /* ------------------------------------------------------------ responsive framing */
  useLayoutEffect(() => {
    const apply = () => {
      const el = layer.current!;
      const st = stage.current!;
      const W = el.offsetWidth, H = el.offsetHeight;
      const vw = st.offsetWidth, vh = st.offsetHeight;
      const ox = (W - vw) / 2, oy = (H - vh) / 2;
      let portrait = false;
      for (const c of CHAPTERS) {
        const L = frameLayout(W, H, c.focal);
        portrait = L.portrait;
        const f = L.point(c.focal);
        const d = L.point(c.detail ?? c.focal);
        const plate = el.querySelector<HTMLElement>(`.plate[data-n="${c.n}"]`)!;
        const set = (k: string, v: number) => plate.style.setProperty(k, `${v.toFixed(1)}px`);
        set("--ix", L.x); set("--iy", L.y); set("--iw", L.w); set("--ih", L.h);
        set("--fx", f.x); set("--fy", f.y); set("--dx", d.x); set("--dy", d.y);
        geo.current[c.n] = { fx: f.x, fy: f.y, dx: d.x, dy: d.y };
      }
      const pct = (x: number, total: number) => `${((x / total) * 100).toFixed(2)}%`;
      const g1 = geo.current[1], g4 = geo.current[4], g5 = geo.current[5], g6 = geo.current[6];
      st.style.setProperty("--vx", pct(g1.fx - ox, vw));
      st.style.setProperty("--vy", pct(g1.fy - oy, vh));
      st.style.setProperty("--wx", pct(g5.dx - ox, vw));
      st.style.setProperty("--wy", pct(g5.dy - oy, vh));
      st.style.setProperty("--cx", `${(g4.fx - ox).toFixed(1)}px`);
      st.style.setProperty("--cy", `${(g4.fy - oy).toFixed(1)}px`);
      const plate6 = el.querySelector<HTMLElement>('.plate[data-n="6"]')!;
      plate6.style.setProperty("--sx", `${g6.dx.toFixed(1)}px`);
      plate6.style.setProperty("--sy", `${g6.dy.toFixed(1)}px`);
      plate6.style.setProperty("--steam-scale", String(Math.max(0.55, W / 1920)));
      root.current!.classList.toggle("is-portrait", portrait);
    };
    apply();
    const ro = new ResizeObserver(() => {
      apply();
      ScrollTrigger.refresh();
    });
    ro.observe(stage.current!);
    return () => ro.disconnect();
  }, []);

  /* ------------------------------------------------------------ reveal */
  const onLoaderDone = useCallback(() => {
    setRevealed(true);
    setMounted(3);
    lenis.current?.start();
  }, []);

  useEffect(() => {
    if (!revealed) return;
    // warm the cache for the remaining frames once the page is idle
    const idle = setTimeout(() => setMounted(6), 2500);
    return () => clearTimeout(idle);
  }, [revealed]);

  /* ------------------------------------------------------------ the film */
  useGSAP(
    () => {
      if (!revealed) return;
      const P = (n: number) => `.plate[data-n="${n}"]`;
      const I = (n: number) => `${P(n)} .plate-img`;
      const D = (n: number) => `${P(n)} .plate-depth`;
      const g = (n: number) => geo.current[n];
      const diag = () => Math.hypot(layer.current!.offsetWidth, layer.current!.offsetHeight);
      const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      // on portrait screens the headline sits right above the cup, so it splits apart less
      const splitY = () => (innerWidth / innerHeight < 0.9 ? 0.035 : 0.1);

      // opening: the hero settles out of darkness
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(I(1), { scale: 1.22, filter: "blur(14px) brightness(0.25)" }, { scale: 1, filter: "blur(0px) brightness(1)", duration: 2.6 }, 0)
        .from(".hero-word .line > span", { yPercent: 115, duration: 1.5, stagger: 0.09 }, 0.35)
        .from(".hero-meta, .nav-inner, [data-indicator]", { opacity: 0, y: -12, duration: 1.4, stagger: 0.1 }, 0.9);

      gsap.set(".copy-2 .line > span, .c3-head .line > span, .c4-head .line > span, .c5-head .line > span, .c6-head .line > span", { yPercent: 115 });
      gsap.set(".tech li, .c5-body > *", { opacity: 0, y: 22 });
      gsap.set(".marker", { opacity: 0 });
      gsap.set(".marker .rule", { scaleX: 0 });
      gsap.set(".plate", { filter: "blur(0px) brightness(1)" });

      let last = -1;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage.current,
          start: "top top",
          end: () => `+=${(DURATION * SCROLL_PER_BEAT * innerHeight) / 100}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * DURATION;
            const idx = HANDOFFS.filter((h) => t >= h).length;
            if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`;
            if (idx !== last) {
              last = idx;
              setChapter(idx);
              setMounted((m) => Math.max(m, idx + 3));
              document.querySelector(I(3))?.classList.toggle("warp", idx === 2 && finePointer && !reduced);
            }
          },
        },
      });

      /* 01 — hero: the cup drifts toward us while the words make room */
      tl.to(P(1), { scale: 1.14, yPercent: -1.2, duration: 1 }, 0)
        .to(".w-wake", { xPercent: -34, yPercent: -26, duration: 1 }, 0)
        .to(".w-the", { xPercent: 34, yPercent: -26, duration: 1 }, 0)
        .to(".w-senses", { xPercent: 20, yPercent: 32, duration: 1 }, 0)
        .to(".hero-meta", { opacity: 0, y: -16, duration: 0.5 }, 0.15)
        .to(atmosphere, { density: 0.75, duration: 1 }, 0);

      /* 01 → 02 — push through the cup, into espresso-dark, out of the zoom from above */
      tl.to(P(1), { scale: 3.8, duration: 1.15, ease: "power2.in" }, 1)
        .to(P(1), { filter: "blur(22px) brightness(0.4)", duration: 0.8, ease: "power1.in" }, 1.3)
        .to(".copy-1", { opacity: 0, filter: "blur(12px)", duration: 0.5 }, 1)
        .to(".veil", { opacity: 1, duration: 0.35, ease: "power1.in" }, 1.55)
        .fromTo(P(2), { autoAlpha: 0, scale: 1.9, filter: "blur(26px) brightness(0.55)" }, { autoAlpha: 1, scale: 1.06, filter: "blur(0px) brightness(1)", duration: 0.85, ease: "power3.out", immediateRender: false }, 1.8)
        .to(".veil", { opacity: 0, duration: 0.5, ease: "power1.out" }, 1.9)
        .set(P(1), { autoAlpha: 0 }, 2.7);

      /* 02 — the first moment */
      tl.to(I(2), { rotate: 3.5, scale: 1.07, duration: 2 }, 1.9)
        .to(D(2), { xPercent: 1.1, yPercent: -2.4, duration: 2 }, 1.9)
        .to(".copy-2 .line > span", { yPercent: 0, stagger: 0.08, duration: 0.5, ease: "power3.out" }, 2.25)
        .fromTo(".c2", { y: 60 }, { y: -40, duration: 1.5, immediateRender: false }, 2.2)
        .to(".warm", { opacity: 0.45, duration: 1.2 }, 2.2)
        .to(atmosphere, { warmth: 0.45, duration: 1.2 }, 2.2);

      /* 02 → 03 — the camera falls into the crema, which opens from the centre of the cup */
      tl.to(".copy-2 .line > span", { yPercent: -115, stagger: 0.05, duration: 0.4, ease: "power2.in" }, 3.3)
        .to(P(2), { scale: 2.8, duration: 1.15, ease: "power2.in" }, 3.4)
        .to(P(2), { filter: "blur(8px) brightness(0.7)", duration: 0.6 }, 3.9)
        .to(".warm", { opacity: 0.1, duration: 0.8 }, 3.6)
        .fromTo(
          P(3),
          { autoAlpha: 1, clipPath: () => `circle(0px at ${g(2).fx}px ${g(2).fy}px)` },
          { clipPath: () => `circle(${diag()}px at ${g(2).fx}px ${g(2).fy}px)`, duration: 0.95, ease: "power2.inOut", immediateRender: false },
          3.7,
        )
        .fromTo(I(3), { scale: 1.45 }, { scale: 1.06, duration: 1, ease: "power3.out", immediateRender: false }, 3.7)
        .set(P(2), { autoAlpha: 0 }, 4.7);

      /* 03 — crema */
      tl.to(".c3-head .line > span", { yPercent: 0, stagger: 0.08, duration: 0.55, ease: "power3.out" }, 4.3)
        .to(I(3), { scale: 1.3, xPercent: -3.5, duration: 1.9 }, 4.7)
        .to(warp.current, { attr: { scale: 16 }, duration: 0.8, ease: "sine.inOut" }, 4.7)
        .to(warp.current, { attr: { scale: 0 }, duration: 0.8, ease: "sine.inOut" }, 5.6)
        .to(".c3-head", { opacity: 0, filter: "blur(10px)", y: -40, duration: 0.6 }, 5.3)
        .to(".tech li", { opacity: 1, y: 0, stagger: 0.12, duration: 0.45, ease: "power3.out" }, 5.4);

      /* 03 → 04 — the crema sinks into shadow as the next frame is wiped in on a diagonal */
      tl.to(".tech li", { opacity: 0, y: -12, stagger: 0.05, duration: 0.3 }, 6.05)
        .to(P(3), { scale: 1.25, rotate: -2, filter: "blur(0px) brightness(0.12)", duration: 0.9, ease: "power2.in" }, 5.95)
        .fromTo(
          P(4),
          { autoAlpha: 1, clipPath: "polygon(0% 100%, 100% 125%, 100% 125%, 0% 100%)", scale: 1.22, rotate: 2.5, filter: "blur(0px) brightness(0.45)" },
          { clipPath: "polygon(0% -25%, 100% 0%, 100% 100%, 0% 100%)", scale: 1.04, rotate: 0, filter: "blur(0px) brightness(1)", duration: 1, ease: "power3.inOut", immediateRender: false },
          6.15,
        )
        .set(P(3), { autoAlpha: 0 }, 7.2);

      /* 04 — from bean to ritual: three depth planes at three speeds */
      tl.to(I(4), { yPercent: -2.5, duration: 2.2 }, 6.9)
        .to(D(4), { yPercent: -7, xPercent: -1.5, duration: 2.2 }, 6.9)
        .to(".c4-head .line > span", { yPercent: 0, stagger: 0.08, duration: 0.5, ease: "power3.out" }, 7)
        .fromTo(".c4-head", { y: 80 }, { y: -110, duration: 2, immediateRender: false }, 7)
        .to(atmosphere, { density: 1, warmth: 0.7, duration: 1 }, 7);
      gsap.utils.toArray<HTMLElement>(".marker").forEach((m, i) => {
        tl.to(m, { opacity: 1, duration: 0.25 }, 7.4 + i * 0.3).to(m.querySelector(".rule"), { scaleX: 1, duration: 0.3, ease: "power2.out" }, 7.4 + i * 0.3);
      });

      /* 04 → 05 — a crane move: the frame lifts away as the pour rises in from below */
      tl.to([".c4-head", ".marker"], { opacity: 0, duration: 0.4 }, 8.5)
        .to(P(4), { yPercent: -16, scale: 1.18, filter: "blur(6px) brightness(0.35)", duration: 1, ease: "power2.in" }, 8.55)
        .fromTo(P(5), { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)", filter: "blur(0px) brightness(0.6)" }, { clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px) brightness(1)", duration: 1, ease: "power3.inOut", immediateRender: false }, 8.75)
        .fromTo(I(5), { yPercent: 14, scale: 1.12 }, { yPercent: 0, scale: 1, duration: 1.1, ease: "power3.out", immediateRender: false }, 8.75)
        .to(atmosphere, { density: 0.8, duration: 0.8 }, 8.8)
        .set(P(4), { autoAlpha: 0 }, 9.9);

      /* 05 — crafted in the moment */
      tl.to(".c5-head .line > span", { yPercent: 0, stagger: 0.09, duration: 0.55, ease: "power3.out" }, 9.6)
        .to(I(5), { scale: 1.32, yPercent: 3.5, duration: 1.9 }, 9.85)
        // the headline splits apart: first line lifts away, last line drops, the middle thins out
        .to(".c5-head .line:nth-child(1)", { y: () => -innerHeight * splitY() * 0.7, x: () => -innerWidth * 0.015, duration: 0.9 }, 10.25)
        .to(".c5-head .line:nth-child(2)", { opacity: 0.3, x: () => innerWidth * 0.03, duration: 0.9 }, 10.25)
        .to(".c5-head .line:nth-child(3)", { y: () => innerHeight * splitY() * 0.9, duration: 0.9 }, 10.25)
        .to(".c5-body > *", { opacity: 1, y: 0, stagger: 0.12, duration: 0.45, ease: "power3.out" }, 10.35)
        .to(".warm", { opacity: 0.9, duration: 1.2 }, 9.9)
        .to(atmosphere, { warmth: 1, duration: 1 }, 9.9);

      /* 05 → 06 — everything goes quiet and dark; the last frame surfaces from the black */
      tl.to([".c5-head", ".c5-body"], { opacity: 0, filter: "blur(8px)", duration: 0.5 }, 11.05)
        .to(P(5), { scale: 1.12, filter: "blur(4px) brightness(0)", duration: 0.9, ease: "power2.in" }, 11.1)
        .to(".warm", { opacity: 0, duration: 0.7 }, 11.1)
        .to(atmosphere, { density: 0.35, warmth: 0.25, duration: 1 }, 11.2)
        .fromTo(P(6), { autoAlpha: 0, scale: 1.28, filter: "blur(10px) brightness(0.2)" }, { autoAlpha: 1, scale: 1.12, filter: "blur(0px) brightness(1)", duration: 1.1, ease: "power2.out", immediateRender: false }, 11.6)
        .set(P(5), { autoAlpha: 0 }, 12.8);

      /* 06 — stay a little longer */
      tl.to(".steam", { opacity: 1, duration: 0.8 }, 12)
        .to(".c6-head .line > span", { yPercent: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" }, 12.2)
        .to(P(6), { scale: 1, duration: 1.8 }, 12.7);

      /* out — fade to the black of the closing section */
      tl.to(".c6-head", { opacity: 0, y: -30, duration: 0.5 }, 13.7)
        .to(P(6), { filter: "blur(0px) brightness(0)", duration: 0.7, ease: "power1.in" }, 13.7)
        .to(".steam", { opacity: 0, duration: 0.6 }, 13.7)
        .to(atmosphere, { density: 0.15, duration: 0.7 }, 13.7)
        .to({}, { duration: 0.01 }, DURATION - 0.01);

      story.current = tl.scrollTrigger ?? null;

      /* nav: smaller and quieter once the journey starts, glass once scrolled */
      gsap.to(".nav-inner", { scale: 0.94, opacity: 0.82, ease: "none", scrollTrigger: { start: 0, end: () => innerHeight * 0.8, scrub: true } });
      ScrollTrigger.create({ start: 40, end: "max", onToggle: (self) => document.querySelector("[data-nav]")?.classList.toggle("is-scrolled", self.isActive) });

      /* cursor parallax: a few pixels, desktop only */
      if (finePointer && !reduced) {
        const xTo = gsap.quickTo(layer.current, "x", { duration: 1.6, ease: "power3" });
        const yTo = gsap.quickTo(layer.current, "y", { duration: 1.6, ease: "power3" });
        const move = (e: PointerEvent) => {
          xTo((e.clientX / innerWidth - 0.5) * -18);
          yTo((e.clientY / innerHeight - 0.5) * -12);
        };
        addEventListener("pointermove", move);
        return () => removeEventListener("pointermove", move);
      }
    },
    { scope: root, dependencies: [revealed] },
  );

  /* nav anchors jump to their moment in the film */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const key = a.getAttribute("href")!.slice(1);
      const st = story.current;
      if (key in ANCHORS && st) {
        e.preventDefault();
        lenis.current?.scrollTo(st.start + (ANCHORS[key] / DURATION) * (st.end - st.start), { duration: 2.2 });
      } else if (key === "shop" || key === "collection") {
        e.preventDefault();
        lenis.current?.scrollTo("#shop", { duration: 2.2 });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={root} id="top">
      {!revealed && <Loader ready={heroLoaded && fontsReady} onDone={onLoaderDone} />}
      <Nav onMenuToggle={onMenuToggle} />
      <ScrollIndicator index={chapter} total={CHAPTERS.length} fillRef={fill} />

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="crema-warp" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.009" numOctaves="2" seed="7" />
          <feDisplacementMap ref={warp} in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <main className="story">
        <div className="stage" ref={stage}>
          <div className="mouse" ref={layer}>
            {CHAPTERS.map((c) => {
              const show = c.n <= mounted;
              const img = (alt: string) =>
                show ? (
                  <Image
                    src={c.src}
                    alt={alt}
                    width={1672}
                    height={941}
                    quality={82}
                    sizes="(max-aspect-ratio: 9/10) 160vw, 108vw"
                    loading="eager"
                    preload={c.n === 1}
                    fetchPriority={c.n === 1 ? "high" : "auto"}
                    draggable={false}
                    onLoad={c.n === 1 && alt ? () => setHeroLoaded(true) : undefined}
                  />
                ) : null;
              return (
                <div key={c.id} className="plate" data-n={c.n}>
                  <div className="plate-img">{img(c.alt)}</div>
                  {c.depth && <div className="plate-depth" aria-hidden="true">{img("")}</div>}
                  {c.n === 6 && <Steam />}
                </div>
              );
            })}
          </div>

          <div className="fx-layer warm" />
          <div className="fx-layer vignette" />
          <Particles />
          <div className="fx-layer veil" />

          {/* 01 */}
          <section className="copy copy-1" aria-label="Wake the senses">
            <h1 className="sr-only">Wake the senses.</h1>
            <span className="hero-word display w-wake" aria-hidden="true"><Line>Wake</Line></span>
            <span className="hero-word display w-the" aria-hidden="true"><Line>The</Line></span>
            <span className="hero-word display w-senses" aria-hidden="true"><Line>Senses.</Line></span>
            <p className="hero-meta mono">Specialty coffee<br />Roasted after dark</p>
          </section>

          {/* 02 */}
          <section className="copy copy-2" aria-label="The first moment">
            <div className="c2">
              <span className="label-row mono"><Line>02 — The first moment</Line></span>
              <p className="quote">
                <Line>“Every roast begins</Line>
                <Line>with attention to detail.”</Line>
              </p>
            </div>
          </section>

          {/* 03 */}
          <section className="copy copy-3" aria-label="Depth in every pour">
            <h2 className="c3-head display">
              <Line>Depth</Line>
              <Line>In every</Line>
              <Line>Pour.</Line>
            </h2>
            <ul className="tech mono">
              <li><span>01</span><span>Single origin</span></li>
              <li><span>02</span><span>Small batch</span></li>
              <li><span>03</span><span>Craft roasted</span></li>
            </ul>
          </section>

          {/* 04 */}
          <section className="copy copy-4" aria-label="From bean to ritual">
            <h2 className="c4-head display">
              <Line>From</Line>
              <Line>Bean</Line>
              <Line>To ritual.</Line>
            </h2>
            <div className="markers">
              {[
                { k: "Origin", v: "Huila, Colombia · 1,750 m", ox: "19vw", oy: "-22vh" },
                { k: "Roast", v: "Medium-dark · 11 min", ox: "23vw", oy: "-3vh" },
                { k: "Character", v: "Cacao, dark cherry, panela", ox: "20vw", oy: "15vh" },
              ].map((m) => (
                <div key={m.k} className="marker mono" style={{ "--ox": m.ox, "--oy": m.oy } as CSSProperties}>
                  <span className="dot" />
                  <span className="rule" />
                  <span className="text">
                    <span>{m.k}</span>
                    <span className="value">{m.v}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 05 */}
          <section className="copy copy-5" aria-label="Crafted in the moment">
            <h2 className="c5-head display">
              <Line>Crafted</Line>
              <Line>In the</Line>
              <Line>Moment.</Line>
            </h2>
            <div className="c5-body">
              <p>Roasted in small batches for a cup with depth, balance and character.</p>
              <a href="#collection" className="cta mono">
                Explore the roast <span className="arrow" />
              </a>
            </div>
          </section>

          {/* 06 */}
          <section className="copy copy-6" aria-label="Stay a little longer">
            <h2 className="c6-head display">
              <Line>Stay</Line>
              <Line>A little</Line>
              <Line>Longer.</Line>
            </h2>
          </section>

          <div className="fx-layer grain" />
        </div>
      </main>

      <FinalCta />
    </div>
  );
}
