"use client";

import { useEffect, useRef } from "react";
import { atmosphere } from "@/lib/atmosphere";

type Mote = { x: number; y: number; z: number; r: number; vx: number; vy: number; phase: number; ember: number; rank: number };

function sprite(color: string, size = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color);
  grad.addColorStop(0.35, color.replace(/[\d.]+\)$/, "0.45)"));
  grad.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/**
 * Atmospheric dust and roasting embers on a single 2D canvas — far cheaper than WebGL for ~100 soft points.
 * Depth (z) scales size, speed and scroll parallax; the scroll timeline sets how dense and warm the air is.
 */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dust = sprite("rgba(236, 214, 188, 1)");
    const ember = sprite("rgba(255, 150, 70, 1)");
    let w = 0, h = 0, dpr = 1;
    let motes: Mote[] = [];

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const count = Math.round(Math.min(130, (w * h) / 14000));
      motes = Array.from({ length: count }, (_, i) => {
        const z = Math.pow(Math.random(), 1.8) * 0.9 + 0.1;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.6 + z * z * 5 + (Math.random() < 0.05 ? 10 : 0),
          vx: (Math.random() - 0.5) * 0.12,
          vy: -0.05 - Math.random() * 0.18,
          phase: Math.random() * Math.PI * 2,
          ember: Math.random(),
          rank: i / count,
        };
      });
    };
    resize();
    addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(48, now - last) / 16.67;
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const vel = reduced ? 0 : atmosphere.velocity;
      const t = now * 0.001;
      for (const m of motes) {
        if (m.rank > atmosphere.density) continue;
        const speed = reduced ? 0.25 : 1;
        m.x += (m.vx * m.z + Math.sin(t * 0.3 + m.phase) * 0.08 * m.z) * dt * speed;
        m.y += (m.vy * m.z - vel * m.z * 0.28) * dt * speed;
        if (m.y < -20) m.y = h + 20;
        if (m.y > h + 20) m.y = -20;
        if (m.x < -20) m.x = w + 20;
        if (m.x > w + 20) m.x = -20;
        const twinkle = 0.55 + 0.45 * Math.sin(t * (0.6 + m.ember) + m.phase * 3);
        const isEmber = m.ember < atmosphere.warmth * 0.6;
        // very large near motes are out-of-focus bokeh: faint
        const a = (m.r > 8 ? 0.06 : 0.12 + m.z * 0.38) * twinkle;
        ctx.globalAlpha = a;
        const s = m.r * 2;
        ctx.drawImage(isEmber ? ember : dust, m.x - m.r, m.y - m.r, s, s);
      }
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="fx-layer particles" style={{ width: "100%", height: "100%" }} aria-hidden="true" />;
}
