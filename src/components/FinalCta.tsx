"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", end: "top 10%", scrub: 1 } });
      tl.from(".final .line > span", { yPercent: 110, stagger: 0.08, ease: "power3.out" })
        .from(".final-glow", { opacity: 0, scale: 0.6, ease: "power2.out" }, 0)
        .from(".final-actions > *, .final-foot", { opacity: 0, y: 20, stagger: 0.06 }, 0.3);
    },
    { scope: root },
  );

  return (
    <section className="final" ref={root} id="shop" aria-labelledby="final-title">
      <div className="final-glow" aria-hidden="true" />
      <div className="final-inner">
        <h2 id="final-title" className="display">
          <span className="line">
            <span>NOCTURNE</span>
          </span>
        </h2>
        <p className="tagline">
          <span className="line">
            <span>Specialty coffee, crafted after dark.</span>
          </span>
        </p>
        <div className="final-actions">
          <a href="#collection" className="cta mono">
            Explore the collection <span className="arrow" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mono secondary">
            Instagram
          </a>
        </div>
      </div>
      <div className="final-foot mono">
        <span>Concept site · placeholder brand</span>
        <span>Roasted after dark</span>
      </div>
    </section>
  );
}
