import {
  BookOpen,
  Bookmark,
  Briefcase,
  Building2,
  Code,
  LayoutDashboard,
  Mail,
  type LucideIcon,
} from "lucide-react";

export const site = {
  /** 主語は個人ではなく事務所 */
  name: "ITDクリエイティブ事務所",
  nameEn: "ITD CREATIVE OFFICE",
  role: "UI Design / Frontend Development",
  description:
    "Webサイトを中心としたクリエイティブ制作を行う個人事務所です。UI/UXデザインからフロントエンド・サーバーサイド開発、情報設計・要件定義までを一貫して担当します。",
  email: "info@itd-creative.com",
  // 本番ドメインが決まったら差し替える（OGPの絶対URL生成に使う）
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
} as const;

/** 会社概要（About） */
export const company: { label: string; lines: string[] }[] = [
  { label: "代表", lines: ["ITDクリエイティブ事務所", "田中 大介"] },
  { label: "設立", lines: ["2020/4/1"] },
  { label: "連絡先", lines: [site.email] },
  {
    label: "事業内容",
    lines: [
      "Webサイトを中心としたクリエイティブ制作。",
      "（UI/UXデザイン、フロントエンド開発、サーバーサイド開発、情報設計、要件定義、ディレクション業務 等）",
    ],
  },
];

/**
 * ヘッダーに置く外部リンク。アイコンのみで出す。
 * lucide-react v1 はブランドアイコン（GitHub等）を廃止しているため、
 * 意味の近い汎用アイコンを当てて、名前はツールチップと aria-label で補っている。
 */
export const externalLinks: { label: string; href: string; icon: LucideIcon }[] =
  [
    { label: "GitHub", href: "https://github.com/dadada0220", icon: Code },
    { label: "Zenn", href: "https://zenn.dev/dadada", icon: BookOpen },
  ];

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    href: "/",
    label: "Overview",
    description: "事務所の概要・実績・できること",
    icon: LayoutDashboard,
  },
  {
    href: "/about",
    label: "About",
    description: "会社概要・略歴",
    icon: Building2,
  },
  {
    href: "/works",
    label: "Works",
    description: "実績",
    icon: Briefcase,
  },
  {
    href: "/articles",
    label: "Bookmark",
    description: "ブックマーク",
    icon: Bookmark,
  },
  {
    href: "/contact",
    label: "Contact",
    description: "お問い合わせ",
    icon: Mail,
  },
];

/** パス（`/works/foo` など）に対応するナビ項目を返す。 */
export function findNavItem(pathname: string): NavItem | undefined {
  return navItems.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );
}
