import Link from "next/link";
import { ROAST_LABEL, type Coffee } from "@/lib/coffees";
import { Moon } from "./Moon";

/** One line of the coffee index: number, moon (roast), name, origin, notes. The whole row is the link. */
export function CoffeeRow({ coffee: c }: { coffee: Coffee }) {
  return (
    <Link href={`/coffees/${c.slug}`} className="crow">
      <span className="num crow-n">{c.n}</span>
      <span className="crow-moon">
        <Moon roast={c.roast} label={ROAST_LABEL[c.roast]} />
      </span>
      <span className="crow-name">
        <span className="display">{c.name}</span>
        <span className="crow-origin">
          {c.country} · {c.region}
        </span>
      </span>
      <span className="crow-notes">{c.notes.join(" · ")}</span>
      <span className="crow-meta">
        <span>{c.process}</span>
        <span>{ROAST_LABEL[c.roast]}</span>
      </span>
      <span className="arrow crow-arrow" aria-hidden="true" />
    </Link>
  );
}
