import type { Metadata } from "next";
import { BrewLab } from "@/components/BrewLab";
import { PageHead, SiteShell } from "@/components/SiteShell";
import { getMethod } from "@/lib/brew";

export const metadata: Metadata = {
  title: "التحضير",
  description: "خمس طرق لتحضير القهوة مع حاسبة للمقادير: التقطير، الإسبريسو، الفرنش برس، الكولد برو، والقهوة السعودية.",
};

export default async function RitualPage({ searchParams }: PageProps<"/ritual">) {
  const m = (await searchParams).m;
  const initial = getMethod(typeof m === "string" ? m : undefined)?.id ?? "v60";

  return (
    <SiteShell>
      <PageHead
        n="03"
        label="التحضير"
        title={
          <>
            الطقس
            <br />
            قبل الكوب.
          </>
        }
        lead="اختر طريقتك وحرّك المؤشر، والحاسبة تعطيك وزن القهوة. الأرقام نقطة بداية معروفة عند أهل القهوة المختصة، عدّلها حتى تصل إلى كوبك."
        image="/images/05-the-pour.webp"
      />
      <section className="band band-tight">
        <BrewLab initial={initial} />
      </section>
    </SiteShell>
  );
}
