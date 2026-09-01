import type { Root } from "mdast";
import { visit } from "unist-util-visit";

import { workBlocks } from "@/lib/markdown/blocks";

/**
 * `:::name` のディレクティブを、`data-block="name"` を持つ要素に変換する。
 *
 * 対応表は `blocks.ts` の1箇所だけ。知らない名前が来たらビルドを止める
 * （素通しすると、書いたつもりのブロックが本文にそのまま出てしまい気づけない）。
 */
export function remarkWorkBlocks({ source }: { source: string }) {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type !== "containerDirective" &&
        node.type !== "leafDirective" &&
        node.type !== "textDirective"
      ) {
        return;
      }

      const known = Object.keys(workBlocks).join(" / ");

      if (node.type !== "containerDirective") {
        throw new Error(
          `${source}: :${node.name} は使えません。カスタムブロックは ::: で開く形式だけです（${known}）`
        );
      }

      const render = workBlocks[node.name];
      if (!render) {
        throw new Error(
          `${source}: :::${node.name} は未定義のブロックです。使えるのは ${known}`
        );
      }

      let rendered;
      try {
        rendered = render(node);
      } catch (error) {
        throw new Error(
          `${source}: ${error instanceof Error ? error.message : String(error)}`
        );
      }

      node.data = {
        ...node.data,
        hName: rendered.tagName ?? "div",
        hProperties: {
          ...rendered.properties,
          "data-block": node.name,
        },
      };
    });
  };
}
