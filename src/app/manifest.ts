import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * PWAマニフェスト。ホーム画面に追加したときの名前とアイコンだけを持つ。
 * アイコンの実体は `public/images/favicon/`（favicon.ico / icon.svg / apple-icon.png は
 * Next のファイル規約で `src/app/` 直下に置いてある）。
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.nameEn,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/images/favicon/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/favicon/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
