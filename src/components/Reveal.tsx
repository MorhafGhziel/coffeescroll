"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/** Fades content up once, when it enters the screen. One calm move; nothing loops. */
export function Reveal({ as: Tag = "div", className = "", delay = 0, children }: { as?: ElementType; className?: string; delay?: number; children: ReactNode }) {
  const el = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={el} className={`rv ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
