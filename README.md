# ポートフォリオサイト

UIデザイナー / フロントエンドエンジニアの個人サイト。管理画面風の白黒UI。

## セットアップ

```bash
npm install
cp .env.example .env.local   # 値を埋める
npm run dev
```

## 環境変数

| キー | 用途 | 未設定時 |
|---|---|---|
| `NOTION_TOKEN` | Notion Integration のトークン | Articles が「API失敗」の空状態になる |
| `NOTION_DB_DESIGN` / `NOTION_DB_DEVELOP` / `NOTION_DB_OTHER` | 3つのブックマークDBのID | 同上 |
| `RESEND_API_KEY` | お問い合わせフォームの送信 | 送信時にエラーを返す（サイトは動く） |
| `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` | 問い合わせの宛先 / 差出人 | `lib/site.ts` の値にフォールバック |
| `NEXT_PUBLIC_SITE_URL` | OGPの絶対URL・sitemap | `https://example.com` |

## コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm start` | ビルド結果を起動 |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | 型チェック |

## ドキュメント

- `docs/design-doc.md` — 設計書
- `docs/design-system.md` — デザインシステム要約（UIを書く前に読む）
- `docs/resources.md` — 外部リソースの使い分け
- `docs/style-guide.html` — スタイルガイド（ブラウザで開く）
- `CLAUDE.md` — AI向けの実装ルール

## コンテンツの追加

- **実績** — `content/works/*.md` を追加する。ファイル名と frontmatter の `slug` を一致させる。
  frontmatter は `src/lib/works.ts` の zod スキーマで検証され、不正ならビルドが落ちる
- **記事** — Notion側で追加する。ISR（1時間）で自動反映される
- **スキル・略歴・つくれるサイト** — `src/lib/profile.ts`
