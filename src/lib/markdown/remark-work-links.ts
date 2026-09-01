import type { Root } from "mdast";
import { visit } from "unist-util-visit";

/**
 * 本文のリンクは外部サイト前提なので、新規タブで開く。
 * `rel` は既存の外部リンク（記事カードなど）と同じ `noreferrer noopener`。
 */
export function remarkWorkLinks() {
  return (tree: Root) => {
    visit(tree, ["link", "linkReference"], (node) => {
      node.data = {
        ...node.data,
        hProperties: {
          target: "_blank",
          rel: ["noreferrer", "noopener"],
        },
      };
    });
  };
}
