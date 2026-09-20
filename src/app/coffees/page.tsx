import type { Metadata } from "next";
import { CoffeeIndex } from "@/components/CoffeeIndex";
import { PageHead, SiteShell } from "@/components/SiteShell";
import { COFFEES } from "@/lib/coffees";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "المحاصيل",
  description: "ستة محاصيل بأسماء نجوم الليل، من التحميص الفاتح إلى الداكن.",
};

export default function CoffeesPage() {
  return (
    <SiteShell>
      <PageHead
        n="02"
        label="المحاصيل"
        title={
          <>
            ستة محاصيل،
            <br />
            بأسماء النجوم.
          </>
        }
        lead="كل قهوة عندنا تحمل اسم نجم من نجوم الليل. والقمر بجانب الاسم يدلّك على درجة التحميص: كلما اكتمل كان التحميص أفتح."
      />
      <section className="band band-tight">
        <CoffeeIndex coffees={COFFEES} />
        <p className="concept-note">{SITE.concept}</p>
      </section>
    </SiteShell>
  );
}
