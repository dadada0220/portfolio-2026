import {
  Blocks,
  Code2,
  Database,
  PenTool,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/**
 * 実績の種別。`content/works/<slug>/index.md` の frontmatter `type` と対応する。
 *
 * **ここだけは選択肢を固定する。** 一覧（`/works`）の絞り込みタブが
 * この一覧から作られるので、表記ゆれがあるとタブが増えてしまうため。
 * `roles` や `stack` はマスタを持たず、md に書いた文字列をそのまま出す。
 */
export const WORK_TYPES = ["website", "web-service", "other"] as const;

export type WorkType = (typeof WORK_TYPES)[number];

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  website: "Webサイト制作",
  "web-service": "Webサービス",
  other: "その他",
};

/**
 * スキル。トップの「できること」セクションで使う。
 * `tile` は globals.css の `--tile-N`（blue → violet の6段）に対応する。
 */
export const skills: {
  title: string;
  lines: string[];
  icon: LucideIcon;
  tile: 1 | 2 | 3 | 4 | 5 | 6;
}[] = [
  {
    title: "UIデザイン・情報設計",
    icon: PenTool,
    tile: 1,
    lines: [
      "SaaSや業務システムのUIデザインや情報設計、定量/定性データに基づいた改善提案",
      "Figmaを用いたデザインシステムやコンポーネントの設計",
      "その他、ランディングページやバナーのスクラッチ制作",
    ],
  },
  {
    title: "フロントエンド開発",
    icon: Code2,
    tile: 2,
    lines: [
      "ReactやTailwindを用いたWebアプリの開発",
      "HTML/CSS、SassやWordPressを用いたWeb制作系の実装",
      "フロントエンドで完結するサイト速度などのパフォーマンス改善",
    ],
  },
  {
    title: "バックエンド開発",
    icon: Database,
    tile: 3,
    lines: [
      "Laravelを用いたDBが絡む開発に対応でき、テーブル設計やデータ構造の検討から実装まで行えます。",
      "要件定義に基づいたシステム設計・API設計も対応可能です。",
      "WordPressのオリジナルテーマ制作やフルスクラッチでの機能開発にも対応できます。",
    ],
  },
  {
    title: "施策立案",
    icon: TrendingUp,
    tile: 4,
    lines: [
      "事業部と連携し、サービスの課題抽出から施策の立案・実行・効果測定までを一貫して行えます。",
      "Googleアナリティクスなどを用いた定量データ分析やKPI設計、CVR改善などの実績があります。",
      "ジャーニーマップやユーザーストーリーの作成を通じた現状把握・要件定義も得意です。",
    ],
  },
  {
    title: "AI開発",
    icon: Sparkles,
    tile: 5,
    lines: [
      "Claude Codeを軸に、デザインから実装まで一気通貫でAIを活用したサービス開発・運用を行えます。",
      "チーム開発におけるAIワークフローの設計（ルール整備・生産性改善）にも取り組んでいます。",
      "AIを前提とした開発プロセスの構築を、実務ベースで進めています。",
    ],
  },
  {
    title: "その他",
    icon: Blocks,
    tile: 6,
    lines: [
      "STUDIOなどのノーコード・ローコードツールでのサイト構築、Shopifyを用いたECサイト構築・導入サポートに対応できます。",
      "CRMやASPの導入、API連携など、要件に応じて幅広く対応可能です。",
    ],
  },
];

/** About の略歴。フリーランス（＝事務所の設立）を最後の項目にする。 */
export const timeline: {
  period: string;
  title: string;
  description: string;
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
export const intro = {
  headline: "デザインから運用まで、",
  headlineMuted: "プロダクト開発を一気通貫で推進",
  body: [
    // "UIデザインとフロントエンド開発を軸に、Webサイトとサービスの制作を行う個人事務所です。",
    // "近年はサービスの課題・施策検討、定量データ分析、Claude Codeを用いたサービス運用などの領域も対応しています。",
    "UIデザインとフロントエンド開発を軸に、新卒から約10年間Web業界に従事。",
    "近年は、プロダクトの課題整理や施策検討、定量データの分析、Claude Codeを用いたプロダクト運用など、幅広い領域に携わっています。",
  ],
};
