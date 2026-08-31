import type { MetadataRoute } from "next";

import { site } from "@/lib/site";
import { getWorks } from "@/lib/works";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const works = await getWorks();

  // 記事詳細はNotion側で増減するため、サイトマップには一覧だけ載せる
  const staticPaths = ["", "/about", "/works", "/articles", "/contact"];

  return [
    ...staticPaths.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...works.map((work) => ({
      url: `${site.url}/works/${work.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
