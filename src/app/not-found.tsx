import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <header className="phead">
        <div className="phead-copy">
          <p className="label">
            <span className="num">404</span> — الصفحة غير موجودة
          </p>
          <h1 className="display">
            ضعنا
            <br />
            في العتمة.
          </h1>
          <p className="lead">هذه الصفحة غير موجودة. ارجع إلى البداية، أو تصفّح المحاصيل.</p>
          <Link href="/" className="cta">
            الصفحة الرئيسية <span className="arrow" />
          </Link>
        </div>
      </header>
    </SiteShell>
  );
}
