"use client";

import { useState } from "react";
import type { Coffee } from "@/lib/coffees";
import { CoffeeRow } from "./CoffeeRow";

const FILTERS = [
  { id: "all", label: "الكل", test: () => true },
  { id: "light", label: "فاتح", test: (c: Coffee) => c.roast <= 2 },
  { id: "medium", label: "وسط", test: (c: Coffee) => c.roast === 3 },
  { id: "dark", label: "داكن", test: (c: Coffee) => c.roast >= 4 },
] as const;

/** The coffee index with a roast filter. */
export function CoffeeIndex({ coffees }: { coffees: Coffee[] }) {
  const [active, setActive] = useState<(typeof FILTERS)[number]["id"]>("all");
  const filter = FILTERS.find((f) => f.id === active)!;
  const shown = coffees.filter(filter.test);

  return (
    <>
      <div className="chips" role="group" aria-label="تصفية حسب درجة التحميص">
        {FILTERS.map((f) => (
          <button key={f.id} className="chip" aria-pressed={f.id === active} onClick={() => setActive(f.id)}>
            {f.label}
          </button>
        ))}
        <span className="chips-count num" aria-live="polite">
          {String(shown.length).padStart(2, "0")} / {String(coffees.length).padStart(2, "0")}
        </span>
      </div>
      <div className="cindex">
        {shown.map((c) => (
          <CoffeeRow key={c.slug} coffee={c} />
        ))}
      </div>
    </>
  );
}
