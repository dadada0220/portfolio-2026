import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { site } from "@/lib/site";

import "./globals.css";

/**
 * 欧文・和文とも Zen Kaku Gothic New。
 *
 * 可変フォントではないので、使うウェイトを明示する。
 * **本文 500 / 太字 700 の2つだけ**（400は使わない。和文が細く見えるため本文を500に置いている）。
 * `subsets` は**プリロードする範囲**の指定で、実際に配信されるのはこれだけではない。
 * 和文のグリフは unicode-range で細かく分割された woff2 として同時に self-host され、
 * ブラウザは必要な範囲だけを取りに行く（Google Fonts に "japanese" という
 * 名前付きサブセットが無いため、`subsets` には latin しか渡せない）。
 * 実際の合成は globals.css の --font-sans。
 */
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  weight: ["500", "700"],
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
    <html lang="ja" className={`${zenKakuGothicNew.variable} h-full`}>
      <body className="min-h-full">
        {/* ツールチップはアイコンだけのボタンの補足なので、待たせずに即出す */}
        <TooltipProvider delayDuration={0}>
          <AppShell>{children}</AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
