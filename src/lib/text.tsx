import { Fragment, type ReactNode } from "react";

/**
 * 本文の文字列に書いた `<br>` / `<br />` を、実際の改行に変える。
 *
 * `profile.tsx` のような**データファイルの本文を素の文字列のまま書けるようにする**ためのもの。
 * HTMLを解釈しているわけではなく、`<br>` で区切って `<br />` 要素を挟み直しているだけなので、
 * 他のタグは書けない（書いてもそのまま文字として出る）。
 * 文字列以外（JSXで組んだ本文）はそのまま返すので、`<>…<br />…</>` と書いても動く。
 */
export function withLineBreaks(value: ReactNode): ReactNode {
  if (typeof value !== "string") return value;

  const parts = value.split(/<br\s*\/?>/i);
  if (parts.length === 1) return value;

  return parts.map((part, index) => (
    <Fragment key={index}>
      {index > 0 ? <br /> : null}
      {part}
    </Fragment>
  ));
}
