import type { ReactNode } from "react";

import {
  ChartIcon,
  CodeIcon,
  LayoutIcon,
  MoreIcon,
  SparkIcon,
  StackIcon,
  type SkillIcon,
} from "@/components/skill-icons";

/**
 * 実績の種別。`content/works/<slug>/index.md` の frontmatter `type` と対応する。
 *
 * **ここだけは選択肢を固定する。** 一覧（`/works`）の絞り込みタブが
 * この一覧から作られるので、表記ゆれがあるとタブが増えてしまうため。
 * `roles` や `stack` はマスタを持たず、md に書いた文字列をそのまま出す。
 */
export const WORK_TYPES = ["website", "web-service", "extension", "other"] as const;

export type WorkType = (typeof WORK_TYPES)[number];

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  website: "Webサイト制作",
  "web-service": "Webサービス",
  extension: "拡張機能",
  other: "その他",
};

/**
 * スキル。トップの「できること」セクションで使う。
 *
 * 24px のタイルに塗りのアイコンを載せ、その横にタイトル、下に文章を置く。
 * タイルの下地は実績と同じ抽象素材（`public/images/works/`）。
 * **領域ごとに色を決めて素材を選んでいる**（デザイン=赤 / フロント=黄橙 / バック=青 /
 * 施策=緑 / AI=紫 / その他=無彩色）。実績が使う 1・2 とは番号を分けている。
 */
export const skills: {
  title: string;
  /**
   * 箇条書きにせず、地の文で書く（実績詳細の本文と同じ調子にするため）。
   * 改行したいところに `<br />` と書けばよい（文字列のままで効く）。
   */
  body: ReactNode;
  icon: SkillIcon;
  /** タイルの下地。24px に切り抜いて使う */
  thumbnail: string;
  /** 「その他」だけは色を持たせず無彩色にする */
  neutral?: boolean;
}[] = [
  {
    title: "デザイン・情報設計",
    icon: LayoutIcon,
    thumbnail: "/images/works/thumb-8.png",
    body: "プロダクトのUIデザインと情報設計、定量・定性データに基づく改善提案を行えます。<br />Figmaでのデザインシステム構築とコンポーネント管理は得意分野で、運用ルールの策定から実装側との連携まで一貫してリードできます。",
  },
  {
    title: "フロントエンド開発",
    icon: CodeIcon,
    thumbnail: "/images/works/thumb-10.png",
    body: "ReactやTailwind CSSを用いたWebアプリ開発から、HTMLコーディングやWordPressでのサイト制作までひとりで担えます。<br />また、表示速度のパフォーマンス改善が得意分野です。",
  },
  {
    title: "バックエンド開発",
    icon: StackIcon,
    thumbnail: "/images/works/thumb-4.png",
    body: "Laravelを用いたWebアプリ開発、データベースやAPIの設計を行えます。<br />また、WordPressのオリジナルテーマやプラグイン開発にも対応できます。",
  },
  {
    title: "施策立案",
    icon: ChartIcon,
    thumbnail: "/images/works/thumb-5.png",
    body: "プロダクトの課題抽出から施策立案、定量・定性データの分析（GA4のレポート作成も可）まで行えます。<br />デザインとフロントエンドがキャリアの原点なので、施策を要件に落とし込み、デザイン・開発サイドとの連携もリードできます。",
  },
  {
    title: "AI開発",
    icon: SparkIcon,
    thumbnail: "/images/works/thumb-3.png",
    body: "Claude Codeを用いたプロダクト開発の運用体制を構築できます。<br />ドキュメントやルールの設計、レビュー観点やデザインガイドラインの粒度調整、AIに任せるスコープの定義やガードレールの整備まで、プロダクトやチームの状況に合わせて設計できます。",
  },
  {
    title: "その他",
    icon: MoreIcon,
    thumbnail: "/images/works/thumb-6.png",
    neutral: true,
    body: "STUDIOやShopify（liquidのカスタマイズも可）、HubSpot、KARTEなど、Web制作やマーケティングで使われる主要なツールは一通り実務で触れています。<br />そのため、初見のツールでも過去の経験を活かしてスムーズに立ち回れます。",
  },
];

/** About の略歴。フリーランス（＝事務所の設立）を最後の項目にする。 */
export const timeline: {
  period: string;
  title: string;
  /** 文字列に `<br />` と書けば改行になる */
  description: ReactNode;
}[] = [
  {
    period: "—",
    title: "東京デザイン専門学校 卒業",
    description: "グラフィック / Webデザインの基礎を学ぶ。",
  },
  {
    period: "—",
    title: "株式会社メンバーズ",
    description: "Web制作・ディレクション。大規模サイトの運用に携わる。",
  },
  {
    period: "2020年4月 —",
    title: "ITDクリエイティブ事務所として独立",
    description:
      "不動産業界を中心にデザイン・開発を受託。総合不動産企業での常駐等を通じて、売買・賃貸のドメイン知識を獲得。現在はUIデザインからフロントエンド・サーバーサイド開発まで一貫して請け負っている。",
  },
];

/**
 * トップの導入文。
 * headline を2トーンの見出しに、body を補足として出す。
 */
export const intro: {
  headline: ReactNode;
  headlineMuted: ReactNode;
  /** 1要素が1行。行の中でさらに折りたいときは `<br />` と書く */
  body: ReactNode[];
} = {
  headline: "デザインから運用まで、",
  headlineMuted: "プロダクト開発を一気通貫で推進",
  body: [
    // "UIデザインとフロントエンド開発を軸に、Webサイトとサービスの制作を行う個人事務所です。",
    // "近年はサービスの課題・施策検討、定量データ分析、Claude Codeを用いたサービス運用などの領域も対応しています。",
    "UIデザインとフロントエンド開発を軸に、新卒から約10年間Web業界に従事。",
    "近年は、プロダクトの課題整理や施策検討、定量データの分析、Claude Codeを用いたプロダクト運用など、幅広い領域に携わっています。",
  ],
};
