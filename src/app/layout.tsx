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

const defaultTitle = `${site.name} — ${site.role}`;

/**
 * サイト共通のメタデータ。
 *
 * アイコン（favicon.ico / icon.svg / apple-icon.png）と manifest は
 * `src/app/` 直下のファイル規約で自動的に <link> になるので、ここには書かない。
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "ja_JP",
    url: "/",
    title: defaultTitle,
    description: site.description,
    images: [{ ...site.ogImage, alt: defaultTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: site.description,
    images: [site.ogImage.url],
  },
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
