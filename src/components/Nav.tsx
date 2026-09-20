"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINKS = ["Origin", "Roasts", "Ritual", "About"];
const EASE = [0.16, 1, 0.3, 1] as const;

export function Nav({ onMenuToggle }: { onMenuToggle?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onMenuToggle?.(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, onMenuToggle]);

  return (
    <>
      <header className="nav" data-nav>
        <div className="nav-inner">
          <a href="#top" className="brand" aria-label="NOCTURNE home">
            NOCTURNE
          </a>
          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="mono">
                {l}
              </a>
            ))}
          </nav>
          <div className="nav-right">
            <a href="#shop" className="mono shop">
              Shop
            </a>
            <button className="burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          >
            <div className="menu-top">
              <span className="brand">NOCTURNE</span>
              <button className="mono" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <nav className="menu-links" aria-label="Menu">
              {[...LINKS, "Shop"].map((l, i) => (
                <span className="line" key={l}>
                  <motion.a
                    href={`#${l.toLowerCase()}`}
                    className="display"
                    onClick={() => setOpen(false)}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%", transition: { delay: 0.35 + i * 0.06, duration: 0.9, ease: EASE } }}
                    exit={{ y: "110%", transition: { duration: 0.4 } }}
                    style={{ display: "block" }}
                  >
                    {l}
                  </motion.a>
                </span>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
