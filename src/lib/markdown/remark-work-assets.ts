import type { Root } from "mdast";
import { visit } from "unist-util-visit";

/**
 * 本文の相対パス画像を、配信用のURLに書き換える。
 *
 * 素材は記事と同じディレクトリ（`content/works/<slug>/`）に置く。
 * `content/` は public ではないので、`![](figma-01.png)` のままでは配信されない。
 * ここで `/works/<slug>/media/figma-01.png` に直し、同名のルートハンドラが実ファイルを返す。
 *
 * `http(s):` と `/` 始まりのパスは書き換えない（外部画像と public 直下の素材はそのまま通す）。
 */
export function remarkWorkAssets({ slug }: { slug: string }) {
  return (tree: Root) => {
    visit(tree, "image", (node) => {
      if (/^([a-z]+:)?\/\//i.test(node.url) || node.url.startsWith("/")) return;
      node.url = `/works/${slug}/media/${node.url.replace(/^\.\//, "")}`;
    });
  };
}
