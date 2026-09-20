import type { Metadata, Viewport } from "next";
import { Amiri, Inter_Tight, JetBrains_Mono, Tajawal } from "next/font/google";
import "./globals.css";
import "./landing.css";

// Arabic display: Amiri, a classic naskh serif (headlines). Arabic text: Tajawal. Inter Tight is only for the NOCTURNE wordmark.
const display = Amiri({
  variable: "--font-display",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const body = Tajawal({
  variable: "--font-body",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const brand = Inter_Tight({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "نوكتورن — قهوة مختصة تُحمَّص بعد حلول الليل", template: "%s · نوكتورن" },
  description: "موقع تجريبي لعلامة قهوة مختصة: فيلم يتحرك مع التمرير، وستة محاصيل بأسماء النجوم، ودليل تحضير مع حاسبة.",
};

export const viewport: Viewport = {
  themeColor: "#070504",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${display.variable} ${body.variable} ${brand.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
