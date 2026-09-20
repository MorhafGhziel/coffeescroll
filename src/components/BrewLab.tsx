"use client";

import { useState } from "react";
import { METHODS, type MethodId } from "@/lib/brew";

/** Method picker, a dose calculator driven by the method's ratio, and the steps. */
export function BrewLab({ initial }: { initial: MethodId }) {
  const [id, setId] = useState<MethodId>(initial);
  const m = METHODS.find((x) => x.id === id)!;
  const [amounts, setAmounts] = useState<Partial<Record<MethodId, number>>>({});
  const amount = amounts[id] ?? m.start;
  const coffee = amount / m.ratio;
  const grams = coffee >= 100 ? Math.round(coffee) : Math.round(coffee * 10) / 10;

  return (
    <div className="lab">
      <div className="lab-tabs" role="tablist" aria-label="طريقة التحضير">
        {METHODS.map((x) => (
          <button key={x.id} role="tab" id={`tab-${x.id}`} aria-selected={x.id === id} aria-controls="lab-panel" className="lab-tab" onClick={() => setId(x.id)}>
            <span>{x.name}</span>
            <span className="num">{x.latin}</span>
          </button>
        ))}
      </div>

      <div className="lab-panel" role="tabpanel" id="lab-panel" aria-labelledby={`tab-${id}`}>
        <div className="lab-intro">
          <h2 className="display">{m.name}</h2>
          <p className="lead">{m.line}</p>
        </div>

        <div className="lab-calc">
          <label htmlFor="lab-amount" className="label">
            {m.amountLabel}
          </label>
          <output className="lab-amount display" htmlFor="lab-amount">
            <span className="num-xl">{amount}</span> {m.unit}
          </output>
          <input
            id="lab-amount"
            type="range"
            dir="ltr"
            min={m.min}
            max={m.max}
            step={m.step}
            value={amount}
            onChange={(e) => setAmounts((a) => ({ ...a, [id]: Number(e.target.value) }))}
            style={{ "--p": `${((amount - m.min) / (m.max - m.min)) * 100}%` } as React.CSSProperties}
          />
          <div className="lab-result" aria-live="polite">
            <span className="label">تحتاج من القهوة</span>
            <span className="display">
              <span className="num-xl">{grams}</span> غ
            </span>
          </div>
        </div>

        <dl className="lab-params">
          <div>
            <dt>النسبة</dt>
            <dd className="num">1:{m.ratio}</dd>
          </div>
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

        <ol className="lab-steps">
          {m.steps.map((s, i) => (
            <li key={s}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <p>{s}</p>
            </li>
          ))}
        </ol>
        {m.note && <p className="lab-note">{m.note}</p>}
      </div>
    </div>
  );
}
