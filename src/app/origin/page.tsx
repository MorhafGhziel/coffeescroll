import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { PageHead, SiteShell } from "@/components/SiteShell";
import { COFFEES } from "@/lib/coffees";

export const metadata: Metadata = {
  title: "المنشأ",
  description: "رحلة القهوة من الكرزة على الشجرة إلى الكوب: الزراعة والقطاف والمعالجة والتحميص.",
};

const STAGES = [
  {
    n: "01",
    title: "المرتفعات",
    text: "تنمو قهوة الأرابيكا الجيدة في المرتفعات، حيث الليالي الباردة تُبطئ نضج الكرزة فتتكوّن فيها سكريات ونكهات أكثر. لهذا نذكر الارتفاع مع كل محصول.",
    image: "/images/04-coffee-beans.webp",
    alt: "كوب إسبريسو على خشب خشن بجانب حبوب محمّصة",
  },
  {
    n: "02",
    title: "القطاف",
    text: "لا تنضج الكرزات في وقت واحد، فيعود القاطفون إلى الشجرة نفسها أكثر من مرة ليأخذوا الحمراء الناضجة فقط. هذه أول خطوة في الجودة، وأكثرها تعباً.",
  },
  {
    n: "03",
    title: "المعالجة",
    text: "بعد القطاف تُفصل الحبة عن الثمرة، والطريقة تغيّر طعم الكوب كله.",
    list: [
      ["مغسولة", "تُزال الثمرة ثم تُغسل الحبة قبل التجفيف. النتيجة كوب نظيف بحموضة واضحة."],
      ["مجففة", "تُجفَّف الكرزة كاملة تحت الشمس. النتيجة حلاوة أعلى ونكهات فواكه وقوام أثقل."],
      ["عسلية", "تُترك طبقة من لبّ الثمرة على الحبة أثناء التجفيف. النتيجة بين الاثنتين."],
    ],
  },
  {
    n: "04",
    title: "التحميص",
    text: "التحميص هو ما يحوّل الحبة الخضراء إلى قهوة. الفاتح يُبقي نكهات المنشأ ظاهرة، والداكن يعطي قواماً أثقل ومرارة محببة. نحن نحمّص دفعات صغيرة حتى نضبط كل واحدة.",
    image: "/images/02-top-down.webp",
    alt: "إسبريسو من الأعلى على طاولة خشب داكنة حولها حبوب محمّصة",
  },
  {
    n: "05",
    title: "الكوب",
    text: "آخر خطوة عندك أنت: طحنة طازجة، وماء جيد، ومقادير مضبوطة. الباقي في دليل التحضير.",
    link: { href: "/ritual", label: "دليل التحضير" },
  },
];

export default function OriginPage() {
  return (
    <SiteShell>
      <PageHead
        n="01"
        label="المنشأ"
        title={
          <>
            من الكرزة
            <br />
            إلى الكوب.
          </>
        }
        lead="القهوة ثمرة قبل أن تكون مشروباً. هذه خمس محطات تمرّ بها الحبة، وكل واحدة منها تترك أثراً تذوقه في النهاية."
        image="/images/01-floating-cup.webp"
      />

      <div className="stages">
        {STAGES.map((s) => (
          <section key={s.n} className={`stage-row${s.image ? " has-image" : ""}`}>
            <Reveal className="stage-n">
              <span className="num">{s.n}</span>
            </Reveal>
            <div className="stage-copy">
              <Reveal as="h2" className="display">
                {s.title}
              </Reveal>
              <Reveal as="p" className="prose">
                {s.text}
              </Reveal>
              {s.list && (
                <Reveal as="dl" className="process-list">
                  {s.list.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </Reveal>
              )}
              {s.link && (
                <Reveal>
                  <Link href={s.link.href} className="cta">
                    {s.link.label} <span className="arrow" />
                  </Link>
                </Reveal>
              )}
            </div>
            {s.image && (
              <Reveal className="stage-img">
                <img src={s.image} alt={s.alt} loading="lazy" width={1600} height={900} />
              </Reveal>
            )}
          </section>
        ))}
      </div>

      <section className="band" aria-labelledby="regions">
        <Reveal as="h2" className="display band-title">
          <span id="regions">مناطق محاصيلنا</span>
        </Reveal>
        <ul className="regions">
          {COFFEES.filter((c) => c.process !== "خلطة").map((c) => (
            <Reveal as="li" key={c.slug}>
              <Link href={`/coffees/${c.slug}`}>
                <span className="display">{c.country}</span>
                <span>{c.region}</span>
                <span className="num">{c.altitude}</span>
                <span>{c.name}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
