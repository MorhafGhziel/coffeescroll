import type { CSSProperties } from "react";

const PLUMES = [
  { s: 90, d: 7.5, delay: 0, sway: "-14px", rot: "-8deg", x: 0 },
  { s: 120, d: 9, delay: -2.4, sway: "18px", rot: "10deg", x: -12 },
  { s: 76, d: 6.4, delay: -4.1, sway: "-10px", rot: "6deg", x: 14 },
  { s: 140, d: 10.5, delay: -6.2, sway: "22px", rot: "-12deg", x: 4 },
  { s: 100, d: 8.2, delay: -1.3, sway: "-20px", rot: "9deg", x: -6 },
];

/** Soft, slowly rising plumes anchored above the cup (position comes from --sx/--sy set by the layout pass). */
export function Steam() {
  return (
    <div className="steam" data-steam aria-hidden="true">
      {PLUMES.map((p, i) => (
        <i
          key={i}
          style={
            {
              "--s": `calc(${p.s}px * var(--steam-scale, 1))`,
              "--d": `${p.d}s`,
              "--delay": `${p.delay}s`,
              "--sway": p.sway,
              "--rot": p.rot,
              marginLeft: `${p.x}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
