"use client";

import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Minimal loading screen. The line creeps toward ~80% while the hero frame and fonts load,
 * completes once they are ready (never faster than ~1s, so it doesn't flash), then the curtain lifts.
 */
export function Loader({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const progress = useMotionValue(0);
  const [visible, setVisible] = useState(true);
  const [started] = useState(() => (typeof performance !== "undefined" ? performance.now() : 0));
  const counter = useCounter(progress);

  useEffect(() => {
    const creep = animate(progress, 0.8, { duration: 2.6, ease: [0.2, 0.7, 0.2, 1] });
    return () => creep.stop();
  }, [progress]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const wait = Math.max(0, 1000 - (performance.now() - started));
    const timer = setTimeout(async () => {
      await animate(progress, 1, { duration: 0.6, ease: EASE });
      if (!cancelled) setVisible(false);
    }, wait);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ready, progress, started]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="loader"
          role="status"
          aria-label="جارٍ التحميل"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.div className="loader-inner" exit={{ opacity: 0, y: -24, transition: { duration: 0.5, ease: EASE } }}>
            <div className="brand">NOCTURNE</div>
            <div className="loader-line">
              <motion.div style={{ scaleX: progress }} />
            </div>
            <div className="loader-row">
              <span className="label">نُحمِّص لك الآن</span>
              <span className="num">{counter}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function useCounter(progress: ReturnType<typeof useMotionValue<number>>) {
  const [n, setN] = useState(0);
  useEffect(() => progress.on("change", (v) => setN(Math.round(v * 100))), [progress]);
  return `${String(n).padStart(3, "0")}`;
}
