"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Nav({ onMenuToggle }: { onMenuToggle?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const main = NAV.slice(0, 4);
  const aside = NAV[5];

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    onMenuToggle?.(open);
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onMenuToggle]);

  const current = (href: string) => (path === href || path.startsWith(href + "/") ? "page" : undefined);

  return (
    <>
      <header className={`nav${scrolled ? " is-scrolled" : ""}`} data-nav>
        <div className="nav-inner">
          <Link href="/" className="brand" aria-label="نوكتورن، الصفحة الرئيسية">
            NOCTURNE
          </Link>
          <nav className="nav-links" aria-label="الأقسام">
            {main.map((l) => (
              <Link key={l.href} href={l.href} className="navlink" aria-current={current(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-right">
            <Link href={aside.href} className="navlink shop" aria-current={current(aside.href)}>
              {aside.label}
            </Link>
            <button className="burger" aria-label="افتح القائمة" aria-expanded={open} onClick={() => setOpen(true)}>
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
            aria-label="القائمة"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          >
            <div className="menu-top">
              <span className="brand">NOCTURNE</span>
              <button className="navlink" onClick={() => setOpen(false)}>
                إغلاق
              </button>
            </div>
            <nav className="menu-links" aria-label="القائمة">
              {[{ href: "/", label: "الرئيسية" }, ...NAV].map((l, i) => (
                <span className="line" key={l.href}>
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: "0%", transition: { delay: 0.35 + i * 0.06, duration: 0.9, ease: EASE } }}
                    exit={{ y: "110%", transition: { duration: 0.4 } }}
                    style={{ display: "block" }}
                  >
                    <Link href={l.href} className="display" onClick={() => setOpen(false)}>
                      {l.label}
                    </Link>
                  </motion.span>
                </span>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
