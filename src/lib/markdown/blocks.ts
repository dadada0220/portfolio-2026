import type { ContainerDirective } from "mdast-util-directive";

/**
 * Markdown 本文で使えるカスタムブロックの定義。
 *
 * 記法は remark-directive のコンテナディレクティブ。`:::名前{属性}` で開いて `:::` で閉じる。
 * 入れ子にするときは **外側のコロンを内側より多く** する（`::::columns` > `:::col`）。
 *
 * ここに1件足せば1ブロック増える。追加の手順は3つだけ。
 *   1. このオブジェクトに `名前: (node) => ({ properties })` を足す
 *   2. `globals.css` の `.prose-work [data-block="名前"]` にスタイルを書く
 *   3. `docs/design-system.md` の一覧に追記する
 *
 * 出力は必ず `data-block="名前"` を持つ要素になる。素の class 名は使わない
 * （Markdown から任意の class を書けるようにすると、トークン外の見た目が混ざるため）。
 */
export type BlockRenderer = (node: ContainerDirective) => {
  /** 既定は div */
  tagName?: string;
  /** `data-block` に加えて付ける属性 */
  properties?: Record<string, string>;
};

/** `{cols=3}` のような属性を、決められた値だけに絞って取り出す */
function pickEnum(
  node: ContainerDirective,
  key: string,
  allowed: readonly string[],
  fallback: () => string
): string {
  const raw = node.attributes?.[key];
  if (raw == null || raw === "") return fallback();
  if (!allowed.includes(raw)) {
    throw new Error(
      `:::${node.name} の ${key} は ${allowed.join(" / ")} のいずれかにしてください（受け取った値: ${raw}）`
    );
  }
  return raw;
}

const COLUMN_COUNTS = ["2", "3"] as const;

export const workBlocks: Record<string, BlockRenderer> = {
  /**
   * 画像 + 見出し + 本文を横に並べるセクション。
   *
   * ::::columns{cols=3}
   * :::col
   * ![代替テキスト](figma-01.png)
   * ### 見出し
   * 本文
   * :::
   * ::::
   *
   * `cols` は 2 か 3。省略すると `:::col` の数から決まる。
   * 幅が足りないときは 1カラムまで落ちる（スタイル側の責務）。
   */
  columns: (node) => {
    const childCount = node.children.filter(
      (child) => child.type === "containerDirective" && child.name === "col"
    ).length;

    if (childCount === 0) {
      throw new Error(":::columns の中には :::col を置いてください");
    }

    return {
      properties: {
        "data-cols": pickEnum(node, "cols", COLUMN_COUNTS, () => {
          const guess = String(childCount);
          if (!COLUMN_COUNTS.includes(guess as (typeof COLUMN_COUNTS)[number])) {
            throw new Error(
              `:::columns の col が ${childCount} 個あります。2 か 3 にするか、cols=2 / cols=3 を明示してください`
            );
          }
          return guess;
        }),
      },
    };
  },

  /** columns の1カラム。中身は普通の Markdown（画像・見出し・本文・リスト） */
  col: () => ({}),
};
