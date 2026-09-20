import type { Roast } from "@/lib/coffees";

/**
 * Roast level drawn as a moon phase: a bright full moon is the lightest roast, a thin sliver is the darkest.
 */
export function Moon({ roast, size = 44, label }: { roast: Roast; size?: number; label?: string }) {
  const lit = 1 - ((roast - 1) / 4) * 0.86; // 1 .. 0.14 of the disc is lit
  const r = 20;
  const rx = r * Math.abs(1 - 2 * lit);
  // right limb, then the terminator: it bulges left when more than half is lit, right when less
  const d = `M24 4 A${r} ${r} 0 0 1 24 44 A${rx} ${r} 0 0 ${lit > 0.5 ? 1 : 0} 24 4 Z`;
  return (
    <svg className="moon" width={size} height={size} viewBox="0 0 48 48" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <circle cx="24" cy="24" r={r} fill="#140d08" stroke="rgba(242,234,223,.22)" />
      <path d={d} fill="#e9d9bf" />
    </svg>
  );
}
