@AGENTS.md

# ポートフォリオサイト

UIデザイナー / フロントエンドエンジニアの個人サイト。管理画面風の白黒UI。

## ドキュメント

- 設計の全体像: `docs/design-doc.md`
- デザインシステム要約: `docs/design-system.md` ← UIを書く前に必ず読む
- 外部リソースの使い分け: `docs/resources.md` ← 参考実装を探すとき / UIレビューのときだけ読む
- 見た目の確認: `docs/style-guide.html`（ブラウザで開く）

## 実装ルール

1. **色は必ずトークン経由で参照する。** コンポーネントに生の色値（hex / oklch / `bg-blue-500`）を書かない。
   Tailwindのセマンティッククラス（`bg-primary` `text-muted-foreground` `border-border`）を使い、
   素のCSSが必要なときだけ `var(--primary)` と書く。トークンの定義は `src/app/globals.css` の一箇所だけ。
   （shadcn/ui v4 + Tailwind v4 ではトークンが完全な色値を保持する。`hsl(var(--primary))` 形式ではない）
2. **新しいUIはまず既存コンポーネントの組み合わせで検討する。** 足りないときだけ新規作成
3. **shadcnの追加は `npx shadcn@latest add` で行う。** 手書きしない
4. **外部コンポーネントは `docs/resources.md` の区分に従う。** 区分Bのものはコードを持ち込まず、挙動だけ真似て自前のトークンで組み直す
5. **primaryを使ってよいのは** 主アクション・アクティブなナビ・フォーカスリングだけ。リンクは下線 + foreground、バッジはmutedで表現する
6. **アニメーションは状態変化を説明するときだけ。** ページ遷移演出は付けない
7. **余白は情報のまとまりで決める。** 兄弟要素の間隔は margin ではなく親の `gap` で作るが、
   1つの `gap` でグループ内を等間隔にしない。関連する要素を入れ子の箱にまとめ、
   **まとまりの中は狭く、まとまりの間は広く**取る（等間隔は階層を潰す）

## コマンド

- 開発: `npm run dev`
- ビルド: `npm run build`
- 型チェック: `npx tsc --noEmit`
- Lint: `npm run lint`

## 環境変数

`.env.local`（`.env.example` を参照）。Notionの3つのDB IDとトークン、Resendのキー。
未設定でもサイトは落ちない（Articlesが「API失敗」の空状態になる）。
