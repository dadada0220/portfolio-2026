import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { site } from "@/lib/site";

import "./globals.css";

/**
 * 欧文は Noto Sans、和文は游ゴシック（OS標準）。
 * Noto Sans は latin サブセットだけ読むので、和文はスタックの次点＝游ゴシックに落ちる。
 * 実際の合成は globals.css の --font-sans。
 */
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${notoSans.variable} h-full`}>
      <body className="min-h-full">
        {/* ツールチップはアイコンだけのボタンの補足なので、待たせずに即出す */}
        <TooltipProvider delayDuration={0}>
          <AppShell>{children}</AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
