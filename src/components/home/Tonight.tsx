"use client";

import { useSyncExternalStore } from "react";
import { HOURS, clock, type Hours } from "@/lib/cafe";

/* ---- a clock that ticks once a minute; null on the server so the first client render matches it ---- */
const subscribe = (fn: () => void) => {
  const t = setInterval(fn, 30_000);
  return () => clearInterval(t);
};
const minuteNow = () => Math.floor(Date.now() / 60_000);

/** Riyadh is UTC+3 all year. Returns the weekday (0 Sunday) and the hour as a decimal, or null before hydration. */
function useRiyadhNow() {
  const minute = useSyncExternalStore(subscribe, minuteNow, () => null);
  if (minute === null) return null;
  const d = new Date(minute * 60_000 + 3 * 3_600_000);
  return { day: d.getUTCDay(), hour: d.getUTCHours() + d.getUTCMinutes() / 60 };
}

const byDay = (day: number) => HOURS.find((h) => h.day === ((day % 7) + 7) % 7)!;

/** Which opening window is running now (it may have started yesterday evening), if any. */
function running(now: { day: number; hour: number }): { row: Hours; at: number } | null {
  const today = byDay(now.day);
  if (now.hour >= today.open && now.hour < today.close) return { row: today, at: now.hour };
  const yesterday = byDay(now.day - 1);
  if (now.hour + 24 < yesterday.close) return { row: yesterday, at: now.hour + 24 };
  return null;
}

/** "مفتوح الآن حتى 2:00 ص" / "نفتح اليوم 4:00 م" */
export function OpenStatus() {
  const now = useRiyadhNow();
  if (!now) return <span className="status">نفتح كل ليلة من {clock(16)}</span>;
  const run = running(now);
  if (run)
    return (
      <span className="status is-open">
        <i aria-hidden="true" />
        مفتوح الآن حتى {clock(run.row.close)}
      </span>
    );
  const today = byDay(now.day);
  const next = now.hour < today.open ? today : byDay(now.day + 1);
  return (
    <span className="status">
      <i aria-hidden="true" />
      مغلق الآن، نفتح {next === today ? "اليوم" : "غداً"} {clock(next.open)}
    </span>
  );
}

/* the timeline runs from noon to 4 am */
const T0 = 12;
const SPAN = 16;
const pos = (h: number) => `${((h - T0) / SPAN) * 100}%`;
const TICKS = [12, 16, 20, 24, 28];

/** The week drawn as nights: each row is an evening, the bar is when we are open, the line is now. */
export function NightHours() {
  const now = useRiyadhNow();
  const run = now ? running(now) : null;
  // the row "now" belongs to: before 4 am it is still last night's row
  const nowRow = now ? (now.hour < 4 ? byDay(now.day - 1).day : now.day) : -1;
  const nowAt = now ? (now.hour < 4 ? now.hour + 24 : now.hour) : 0;

  return (
    <div className="nights">
      <div className="nights-scale" aria-hidden="true">
        <span />
        <div>
          {TICKS.map((t) => (
            <b key={t} style={{ insetInlineStart: pos(t) }}>
              {clock(t)}
            </b>
          ))}
        </div>
      </div>
      <ul>
        {HOURS.map((h) => {
          const isNow = h.day === nowRow;
          return (
            <li key={h.day} className={isNow ? "is-today" : undefined}>
              <span className="nights-day">{h.name}</span>
              <div className="nights-track">
                <span className="nights-bar" style={{ insetInlineStart: pos(h.open), width: `${((h.close - h.open) / SPAN) * 100}%` }} />
                {isNow && nowAt >= T0 && <span className={`nights-now${run ? " is-open" : ""}`} style={{ insetInlineStart: pos(nowAt) }} aria-hidden="true" />}
              </div>
              <span className="nights-time">
                {clock(h.open)} إلى {clock(h.close)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
