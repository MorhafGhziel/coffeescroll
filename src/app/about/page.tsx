import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { PageHead, SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "عن نوكتورن",
  description: "فكرة نوكتورن: قهوة مختصة لليل. موقع تجريبي لعلامة غير حقيقية.",
};

const PRINCIPLES = [
  ["الليل", "اسم «نوكتورن» يعني مقطوعة موسيقية لليل. الفكرة كلها عن تلك الساعة الهادئة التي يصير فيها الكوب طقساً وليس عادة."],
  ["القليل المتقن", "ستة محاصيل فقط، وكل واحد منها موصوف بوضوح: من أين جاء، وكيف عولج، وكيف تحضّره."],
  ["الوضوح", "لا مصطلحات معقّدة. القمر يخبرك بدرجة التحميص، والحاسبة تخبرك بالمقادير."],
];

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHead
        n="04"
        label="عن نوكتورن"
        title={
          <>
            قهوة
            <br />
            لساعات الليل.
          </>
        }
        lead="نوكتورن تصوّر لعلامة قهوة مختصة مبنية على فكرة واحدة: أن أجمل كوب هو الذي تشربه حين يهدأ كل شيء."
        image="/images/06-final-ritual.webp"
      />

      <section className="band">
        <ol className="principles">
          {PRINCIPLES.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 80}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="display">{t}</h2>
              <p className="prose">{d}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="band disclosure" aria-labelledby="disclosure">
        <Reveal as="h2" className="display band-title">
          <span id="disclosure">بصراحة: هذا موقع تجريبي.</span>
        </Reveal>
        <Reveal as="div" className="disclosure-body">
          <p className="prose">
            نوكتورن ليست شركة حقيقية. لا توجد محمصة ولا منتجات ولا بيع، والمحاصيل الستة بيانات توضيحية. المعلومات العامة عن
            مناطق القهوة وطرق المعالجة ومقادير التحضير صحيحة ومتعارف عليها، ويمكنك استخدام دليل التحضير فعلاً.
          </p>
          <p className="prose">
            الفيلم في الصفحة الرئيسية مولَّد بالذكاء الاصطناعي، ومقسَّم إلى صور متتالية يحرّكها التمرير. صُنع الموقع ليُظهر
            كيف يمكن لعلامة قهوة عربية أن تحكي قصتها على الويب.
          </p>
          <p className="prose credits">
            صور القهوة والمحمصة والبار صور حقيقية من ويكيميديا كومنز، معدّلة الألوان: Shixart1985 وTony Webster ‏(CC BY 2.0)، Don LaVange ‏(CC BY-SA 2.0)، Jkafader ‏(CC BY-SA 3.0)، Jameswasswa ‏(CC BY-SA 4.0)، Zachary Newton وChevanon Photography ‏(CC0).
            وهي صور لأماكن أخرى استُخدمت للتوضيح. التفاصيل في{" "}
            <a href="/images/CREDITS.md">ملف المصادر</a>.
          </p>
          <Link href="/coffees" className="cta">
            تصفّح المحاصيل <span className="arrow" />
          </Link>
        </Reveal>
      </section>
    </SiteShell>
  );
}
