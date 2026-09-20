"use client";

import Link from "next/link";
import { useState } from "react";
import { METHODS, type MethodId } from "@/lib/brew";

/** The home-page calculator: pick a method, set the amount, read the coffee dose. The full guide has the steps. */
export function BrewMini() {
  const [id, setId] = useState<MethodId>("v60");
  const [amounts, setAmounts] = useState<Partial<Record<MethodId, number>>>({});
  const m = METHODS.find((x) => x.id === id)!;
  const amount = amounts[id] ?? m.start;
  const dose = amount / m.ratio;
  const grams = dose >= 100 ? Math.round(dose) : Math.round(dose * 10) / 10;

  return (
    <div className="mini">
      <div className="mini-methods" role="group" aria-label="طريقة التحضير">
        {METHODS.map((x) => (
          <button key={x.id} className="chip" aria-pressed={x.id === id} onClick={() => setId(x.id)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className="mini-row">
        <label htmlFor="mini-amount">{m.amountLabel}</label>
        <output htmlFor="mini-amount">
          <span className="num-xl">{amount}</span> {m.unit}
        </output>
      </div>
      <input
        id="mini-amount"
        type="range"
        min={m.min}
        max={m.max}
        step={m.step}
        value={amount}
        onChange={(e) => setAmounts((a) => ({ ...a, [id]: Number(e.target.value) }))}
        style={{ "--p": `${((amount - m.min) / (m.max - m.min)) * 100}%` } as React.CSSProperties}
      />

      <div className="mini-result" aria-live="polite">
        <span>تحتاج من القهوة</span>
        <strong>
          <span className="num-xl">{grams}</span> غ
        </strong>
      </div>

      <dl className="mini-params">
        <div>
          <dt>الحرارة</dt>
          <dd>{m.temp}</dd>
        </div>
        <div>
          <dt>الطحنة</dt>
          <dd>{m.grind}</dd>
        </div>
        <div>
          <dt>الوقت</dt>
          <dd>{m.time}</dd>
        </div>
      </dl>

      <Link href={`/ritual?m=${id}`} className="cta">
        خطوات {m.name} كاملة <span className="arrow" />
      </Link>
    </div>
  );
}
