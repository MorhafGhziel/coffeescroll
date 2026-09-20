import Link from "next/link";
import { HOURS, PLACE, clock } from "@/lib/cafe";
import { NAV, SITE } from "@/lib/site";
import { OpenStatus } from "./home/Tonight";

export function Footer() {
  const week = HOURS[0];
  const weekend = HOURS[5];
  return (
    <footer className="footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="footer-top">
        <p className="footer-word display" aria-hidden="true">
          NOCTURNE
        </p>
        <p className="footer-tag">{SITE.tagline}</p>
      </div>
      <div className="footer-grid">
        <div className="footer-col">
          <h2>الموقع</h2>
          <p>{PLACE.line}</p>
          <p className="footer-status">
            <OpenStatus />
          </p>
        </div>
        <div className="footer-col">
          <h2>الأوقات</h2>
          <p>
            السبت إلى الأربعاء، {clock(week.open)} إلى {clock(week.close)}
          </p>
          <p>
            الخميس والجمعة، {clock(weekend.open)} إلى {clock(weekend.close)}
          </p>
        </div>
        <nav aria-label="روابط الموقع" className="footer-col footer-links">
          <h2>الصفحات</h2>
          <Link href="/">الرئيسية</Link>
          {NAV.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="footer-note">
        {SITE.concept} {PLACE.sample}
      </p>
    </footer>
  );
}
