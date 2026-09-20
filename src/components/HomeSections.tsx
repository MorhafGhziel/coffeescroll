import Link from "next/link";
import { FAQ, FEATURES, MENU, PLACE, ROASTING } from "@/lib/cafe";
import { COFFEES, ROAST_LABEL } from "@/lib/coffees";
import { BrewMini } from "./home/BrewMini";
import { NightMap } from "./home/NightMap";
import { NightHours, OpenStatus } from "./home/Tonight";
import { Moon } from "./Moon";
import { Reveal } from "./Reveal";

/** Everything after the film: tonight, the idea, the coffees, the menu, the roastery, the calculator, the visit, questions. */
export function HomeSections() {
  return (
    <>
      {/* ---- tonight: are we open, and where ---- */}
      <section className="tonight" id="tonight" aria-label="الليلة">
        <p className="tonight-status display">
          <OpenStatus />
        </p>
        <p className="tonight-place">
          {PLACE.line}
          <Link href="/#visit" className="cta">
            الموقع والأوقات <span className="arrow" />
          </Link>
        </p>
      </section>

      {/* ---- the idea ---- */}
      <section className="band statement">
        <Reveal as="p" className="statement-text display">
          مقهى ومحمصة لا يفتحان إلا بعد العصر. نحمّص حين يهدأ كل شيء، دفعات صغيرة ومحصول واحد في كل كيس، وكوب يستحق أن تتمهّل معه.
        </Reveal>
        <ul className="facts">
          <li>
            <strong className="num-xl">6</strong>
            <span>محاصيل بأسماء نجوم الليل</span>
          </li>
          <li>
            <strong className="num-xl">5</strong>
            <span>طرق تحضير مع حاسبة للمقادير</span>
          </li>
          <li>
            <strong>4 م إلى 2 ص</strong>
            <span>نفتح كل ليلة، ونتأخر في نهاية الأسبوع</span>
          </li>
        </ul>
      </section>

      {/* ---- the coffees ---- */}
      <section className="band" id="coffees" aria-labelledby="home-coffees">
        <div className="band-head">
          <div>
            <h2 className="display band-title" id="home-coffees">
              محاصيل بأسماء النجوم
            </h2>
            <p className="lead">القمر بجانب كل اسم يدلّك على درجة التحميص. كلما اكتمل كان التحميص أفتح.</p>
          </div>
          <Link href="/coffees" className="cta">
            كل المحاصيل <span className="arrow" />
          </Link>
        </div>
        <ul className="reel">
          {COFFEES.map((c) => (
            <li key={c.slug}>
              <Link href={`/coffees/${c.slug}`} className="reel-card">
                <span className="reel-img">
                  <img src={c.image} alt="" loading="lazy" width={1600} height={1067} style={{ objectPosition: c.focus }} />
                </span>
                <span className="reel-top">
                  <Moon roast={c.roast} size={40} label={ROAST_LABEL[c.roast]} />
                  <span>{ROAST_LABEL[c.roast]}</span>
                </span>
                <span className="reel-copy">
                  <span className="display">{c.name}</span>
                  <span className="reel-origin">
                    {c.country}، {c.region}
                  </span>
                  <span className="reel-notes">{c.notes.join("، ")}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- the menu ---- */}
      <section className="band menu-band" id="menu" aria-labelledby="home-menu">
        <div className="band-head">
          <h2 className="display band-title" id="home-menu">
            قائمة الليلة
          </h2>
          <p className="menu-unit">الأسعار بالريال السعودي</p>
        </div>
        <div className="board">
          {MENU.map((g) => (
            <div key={g.title} className="board-col">
              <h3 className="display">{g.title}</h3>
              <ul>
                {g.items.map((it) => (
                  <li key={it.name}>
                    <span className="board-line">
                      <span className="board-name">{it.name}</span>
                      <span className="board-dots" aria-hidden="true" />
                      <span className="num-xl board-price">{it.price}</span>
                    </span>
                    {it.note && <span className="board-note">{it.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="concept-note">{PLACE.sample}</p>
      </section>

      {/* ---- the roastery ---- */}
      <section className="band craft" id="craft" aria-labelledby="home-craft">
        <div className="craft-photos">
          <Reveal className="craft-photo-a">
            <img src="/images/roast-drop.webp" alt="حبوب قهوة محمّصة تنزل من المحمصة إلى صينية التبريد" loading="lazy" width={1600} height={1065} />
          </Reveal>
          <Reveal className="craft-photo-b" delay={120}>
            <img src="/images/roast-cool.webp" alt="حبوب ساخنة تدور في صينية التبريد ويتصاعد منها الدخان" loading="lazy" width={1600} height={1128} />
          </Reveal>
        </div>
        <div className="craft-copy">
          <h2 className="display band-title" id="home-craft">
            من الحبة الخضراء إلى كوبك
          </h2>
          <ol className="steps">
            {ROASTING.map(([t, d], i) => (
              <li key={t}>
                <span className="steps-n display" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="display">{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/origin" className="cta">
            رحلة القهوة من المنشأ <span className="arrow" />
          </Link>
        </div>
      </section>

      {/* ---- the calculator ---- */}
      <section className="band brew-band" id="brew" aria-labelledby="home-brew">
        <div className="brew-copy">
          <h2 className="display band-title" id="home-brew">
            حضّرها في البيت بالمقادير الصحيحة
          </h2>
          <p className="lead">اختر طريقتك وحرّك المؤشر. الحاسبة تعطيك وزن القهوة، والدليل الكامل يشرح الخطوات واحدة واحدة.</p>
          <Reveal className="brew-photo">
            <img src="/images/bar-tamp.webp" alt="باريستا يكبس القهوة في ذراع ماكينة الإسبريسو" loading="lazy" width={1600} height={1067} />
          </Reveal>
        </div>
        <BrewMini />
      </section>

      {/* ---- the visit ---- */}
      <section className="band visit" id="visit" aria-labelledby="home-visit">
        <div className="band-head">
          <div>
            <h2 className="display band-title" id="home-visit">
              زُرنا بعد العصر
            </h2>
            <p className="lead">
              {PLACE.line}. {PLACE.hint}.
            </p>
          </div>
          <p className="visit-status">
            <OpenStatus />
          </p>
        </div>

        <div className="visit-grid">
          <NightMap />
          <div className="visit-hours">
            <h3 className="display">أوقات العمل</h3>
            <NightHours />
          </div>
        </div>

        <ul className="features">
          {FEATURES.map(([t, d]) => (
            <li key={t}>
              <h3 className="display">{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
        <p className="concept-note">{PLACE.sample}</p>
      </section>

      {/* ---- questions ---- */}
      <section className="band faq" id="faq" aria-labelledby="home-faq">
        <h2 className="display band-title" id="home-faq">
          أسئلة تتكرر علينا
        </h2>
        <div className="faq-list">
          {FAQ.map(([q, a], i) => (
            <details key={q} open={i === 0}>
              <summary>
                <span>{q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
