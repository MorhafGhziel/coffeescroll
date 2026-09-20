import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Moon } from "@/components/Moon";
import { Reveal } from "@/components/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { getMethod } from "@/lib/brew";
import { COFFEES, ROAST_LABEL, getCoffee } from "@/lib/coffees";
import { SITE } from "@/lib/site";

export const generateStaticParams = () => COFFEES.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: PageProps<"/coffees/[slug]">): Promise<Metadata> {
  const c = getCoffee((await params).slug);
  return c ? { title: `${c.name} · ${c.country}`, description: c.line } : {};
}

export default async function CoffeePage({ params }: PageProps<"/coffees/[slug]">) {
  const c = getCoffee((await params).slug);
  if (!c) notFound();
  const method = getMethod(c.method)!;
  const next = COFFEES[(COFFEES.indexOf(c) + 1) % COFFEES.length];

  const specs = [
    ["المنشأ", c.country],
    ["المنطقة", c.region],
    ["الارتفاع", c.altitude],
    ["السلالة", c.variety],
    ["المعالجة", c.process],
    ["التحميص", ROAST_LABEL[c.roast]],
  ];

  return (
    <SiteShell>
      <article className="coffee">
        <header className="coffee-head">
          <div className="coffee-img" aria-hidden="true">
            <img src={c.image} alt="" width={1600} height={1067} style={{ objectPosition: c.focus }} />
          </div>
          <div className="coffee-head-copy">
            <p className="label">
              <Link href="/coffees">المحاصيل</Link> / <span className="num">{c.n}</span>
            </p>
            <h1 className="display">{c.name}</h1>
            <p className="coffee-star">{c.star}</p>
            <div className="coffee-roast">
              <Moon roast={c.roast} size={56} />
              <span>
                {ROAST_LABEL[c.roast]}
                <small>
                  {c.country} · {c.region}
                </small>
              </span>
            </div>
          </div>
        </header>

        <section className="band coffee-body">
          <div>
            <Reveal as="p" className="label">
              في الكوب
            </Reveal>
            <Reveal as="ul" className="notes display">
              {c.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </Reveal>
            <Reveal as="p" className="lead">
              {c.line}
            </Reveal>
            <Reveal as="p" className="prose">
              {c.body}
            </Reveal>
          </div>

          <Reveal as="dl" className="specs">
            {specs.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </Reveal>
        </section>

        <section className="band band-tight">
          <Reveal>
            <Link href={`/ritual?m=${method.id}`} className="brewcard">
              <span className="label">التحضير المقترح</span>
              <span className="display brewcard-name">{method.name}</span>
              <span className="brewcard-meta">
                <span>
                  النسبة <b className="num">1:{method.ratio}</b>
                </span>
                <span>
                  الحرارة <b>{method.temp}</b>
                </span>
                <span>
                  الطحنة <b>{method.grind}</b>
                </span>
              </span>
              <span className="cta">
                افتح الدليل والحاسبة <span className="arrow" />
              </span>
            </Link>
          </Reveal>
          <p className="concept-note">{SITE.concept}</p>
        </section>

        <Link href={`/coffees/${next.slug}`} className="nextlink">
          <span className="label">المحصول التالي</span>
          <span className="display">{next.name}</span>
        </Link>
      </article>
    </SiteShell>
  );
}
