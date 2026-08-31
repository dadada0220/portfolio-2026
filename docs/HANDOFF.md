# 引き継ぎ — ポートフォリオサイト実装

ローカルのClaude Codeで実装を始めるための要約。詳細は `docs/design-doc.md`、見た目は `docs/style-guide.html` をブラウザで開いて確認する。

---

## 何を作るか

自分の情報を集約するパーソナルサイト。ポートフォリオ（実績・スキル・略歴）+ Notionで管理しているブックマーク記事の表示。

- **クリエイティブ職向け**: 実績・スキル・略歴
- **非クリエイティブ職向け**: 作れるサイト種別 → 実績への導線
- UIは**管理画面（ダッシュボード）風**。白黒ベースで、プライマリボタンだけ彩色
- CMSは使わない。実績はMarkdown、自己紹介は静的
- 今後もAI開発をするので、デザインシステムの定義を先に固める

## 技術構成

| 項目 | 選定 |
|---|---|
| フレームワーク | Next.js (App Router) + TypeScript |
| スタイリング | Tailwind CSS v4 + shadcn/ui |
| 実績 | `content/works/*.md`（gray-matter + zodでfrontmatter検証） |
| 記事 | Notion API（`@notionhq/client`）+ ISR `revalidate = 3600` |
| フォーム | Server Action + Resend |
| デプロイ | Vercel |
| アイコン | lucide-react |

## サイトマップ

```
/                トップ（Overview・非クリエイティブ職向け）
/about           自己紹介・略歴・スキル詳細
/works           実績一覧
/works/[slug]    実績詳細（Markdown）
/articles        ブックマーク記事
/articles/[id]   記事詳細（一覧から開くとモーダル）
/contact         お問い合わせ
```

アプリシェル: 左サイドバー（`w-60`、各項目にlucideアイコン）+ 固定ヘッダー（`h-14`）+ メイン（`max-w-5xl`）。モバイルはサイドバーをSheetでドロワー化。

---

## デザインシステム（要点）

- **ニュートラル: zinc**（純グレーだと無機質なので、わずかに寒色へ振る）
- **primaryは1色だけ**。使ってよいのは「主アクション（お問い合わせ・送信）」「アクティブなナビ」「フォーカスリング」のみ。リンクは下線 + foreground、バッジはmutedで表現する
- **タイポ**: Inter（欧文）+ Noto Sans JP（和文）+ JetBrains Mono（数値・トークン）。本文基準14px、和文見出しに`palt`
- **`--radius` 1つ**を基準に、ボタン・バッジは相対値で導出
- **影は `shadow-sm` まで**。`shadow` はポップオーバーやドロワーだけ
- **ダークモードはv1スコープ外**だが、色は必ずトークン経由で書く（後から `.dark` を足すだけで済む状態を保つ）

トークンのCSSは `docs/style-guide.html` の最下部「トークン出力」からコピーできる。

### 外部リソースの使い分け

> **体験は借りる、トンマナは自前。**

| 区分 | 意味 | 該当 |
|---|---|---|
| A: そのまま入れる | shadcnと同じCSS変数を参照するもの | lucide-react、reui.io |
| B: 体験だけ借りる | コードは持ち込まず、挙動だけ真似て自前で組む | rareui.com、coss.com/ui、lucide-animated |
| C: 判断基準として読ませる | 実装後のレビューでエージェントに渡す | refactoring-ui-plugin、ui-skills.com、designsystemchecklist |

reicon.dev は不採用（lucideと重複。アイコンセットを2つ混ぜない）。詳細は design-doc.md §2.6。

---

## Notion連携（確認済み）

**カテゴリ = DBの分かれ方。** design / develop / other はプロパティではなく、それぞれ別データベース。3つのDB IDを環境変数で持ち、取得時にカテゴリを付与してマージする。

```
NOTION_TOKEN=
NOTION_DB_DESIGN=
NOTION_DB_DEVELOP=
NOTION_DB_OTHER=
RESEND_API_KEY=
```

**プロパティ**: タイトル(title) / URL(url) / 概要(rich_text) / 種別(select) / タグ(multi_select) / 会社名(rich_text) / ☆(checkbox) / 作成日時(created_time)

種別・タグの値はハードコードせず、取得結果から動的に集計する。**タグの語彙はDBごとに異なる**ので、絞り込みチップは選択中カテゴリのタグだけ出す。

### 実装で必ず踏むポイント

1. **サムネイルはページの1番目のブロックの画像**（`blocks.children.list` の `page_size: 1`）。画像がないケースのフォールバックは必須
2. ⚠️ **Notionのファイル署名URLは約1時間で失効する。** URLをそのままHTMLに埋めるとキャッシュされたページで画像が切れるので、`/api/thumb/[pageId]` を挟んで都度最新URLを引いて中継する
3. **本文ブロックはモーダルを開いた時に初めて取得**する（一覧生成時には取りに行かない）
4. ページネーション（`has_more` / `next_cursor`）を最初から実装。レート制限は平均3req/secなので並列度は3程度に絞る

### 記事UIの仕様

- ツールバー: カテゴリTabs / タグchip（複数選択OR）/ ☆のみ / リスト・カード切替
- 状態はURLクエリに持たせる（`?cat=design&view=card&tags=UI,AI&star=1`）
- 一覧は**リストが既定**。カードは16:9サムネイル付き
- 詳細モーダルは **Parallel Routes + Intercepting Routes** で `/articles/[id]` に紐づける。一覧から開けばモーダル、URL直打ちなら単独ページ、ブラウザバックで閉じる
- 空状態は2種類（絞り込み0件 / API失敗）。API失敗でもサイト全体は落とさない

---

## 実績（Works）

公開可のものは実名、クライアントワークは案件名をぼかす混在方針。画像が用意できないものが多いので、**サムネイルなしでも成立する**デザインにする。

frontmatterは design-doc.md §5.2 を参照。本文は「課題 → 取り組み → 成果」の3見出し。

初期投入するサンプル6件:

1. modulesss.com（実名・自主開発）
2. 賃貸物件検索サービスのCVR改善（ぼかし）
3. クリエイター向け工数管理SaaS（ぼかし）
4. カーボンクレジット品質評価サービス（ぼかし）
5. 制作会社マッチングメディアのリニューアル（ぼかし）
6. 不動産系サービスの店舗物件プラットフォーム（ぼかし）

---

## リポジトリ構成

```
.
├── CLAUDE.md                  # 下記の内容で作成
├── docs/
│   ├── design-doc.md          # 設計書（portfolio-design-doc.md をリネーム）
│   ├── style-guide.html       # スタイルガイド（portfolio-style-guide.html をリネーム）
│   ├── design-system.md       # design-doc.md §2 の要約（フェーズ0で作る）
│   └── resources.md           # design-doc.md §2.6 の切り出し（フェーズ0で作る）
├── content/works/*.md
└── src/
    ├── app/                   # 構成は design-doc.md §5.3
    ├── components/ui/         # shadcn（コピー&オウン）
    ├── components/            # AppShell, SkillItem, WorkCard, ArticleRow ...
    ├── lib/                   # notion.ts, works.ts, utils.ts
    └── styles/globals.css     # デザイントークン
```

---

## 実装フェーズ

各フェーズ後に動作確認してから次へ進む。

| # | 内容 | 完了条件 |
|---|---|---|
| 0 | Next.js + Tailwind v4 + shadcn/ui、トークン定義、CLAUDE.md / design-system.md / resources.md 作成 | トークンが反映されたButtonが出る |
| 1 | AppShell / SideNav / PageHeader、全ページの空実装 | ナビ遷移できる |
| 2 | トップ / About（スキル・略歴・作れるサイト） | 静的コンテンツが表示される |
| 3 | Markdownパイプライン、実績一覧・詳細、サンプル6件 | 6件が閲覧できる |
| 4 | Notion 3DB連携、ツールバー、リスト・カード、`/api/thumb`、詳細モーダル、ISR | 実データが絞り込み・両表示・モーダルで動く |
| 5 | Contactフォーム（Server Action + Resend + honeypot） | テスト送信が届く |
| 6 | メタデータ/OGP、レスポンシブ、refactoring-ui-plugin と ui-skills でUIレビュー、Vercelデプロイ | Lighthouse 90+、本番公開 |

**フェーズ4の最初のタスク**: Notion APIのレスポンスをダンプして、実プロパティ名と型を design-doc.md §5.1 の表と突き合わせる。

---

## まだ決まっていないこと

実装前か、途中で確定させる。

- [ ] **アクセントカラー** — 暫定はBlue `221 83% 53%`。Teal / Orange / Violet も候補。`docs/style-guide.html` をブラウザで開いて切り替えて決める（暖色を選ぶならニュートラルをzinc→stoneに変える）
- [ ] **Notion DB ID 3つ** — Integrationを作って各DBに接続してから取得
- [ ] **略歴の年表記** — design-doc.md §4.3 は草案
- [ ] **実績6件の本文** — サンプルとして入れてあるので、公開前に書き直す
- [ ] スキル・作れるサイトの文章（草案あり、要確認）

---

## CLAUDE.md（そのままリポジトリ直下に置く）

```md
# ポートフォリオサイト

UIデザイナー / フロントエンドエンジニアの個人サイト。管理画面風の白黒UI。

## ドキュメント

- 設計の全体像: `docs/design-doc.md`
- デザインシステム要約: `docs/design-system.md` ← UIを書く前に必ず読む
- 外部リソースの使い分け: `docs/resources.md` ← 参考実装を探すとき / UIレビューのときだけ読む
- 見た目の確認: `docs/style-guide.html`（ブラウザで開く）

## 実装ルール

1. **色は必ずトークン経由で参照する。** コンポーネントに生の色値（hex / oklch / `bg-blue-500`）を書かない。`hsl(var(--primary))` の形で書く
2. **新しいUIはまず既存コンポーネントの組み合わせで検討する。** 足りないときだけ新規作成
3. **shadcnの追加は `npx shadcn@latest add` で行う。** 手書きしない
4. **外部コンポーネントは `docs/resources.md` の区分に従う。** 区分Bのものはコードを持ち込まず、挙動だけ真似て自前のトークンで組み直す
5. **primaryを使ってよいのは** 主アクション・アクティブなナビ・フォーカスリングだけ。リンクは下線 + foreground、バッジはmutedで表現する
6. **アニメーションは状態変化を説明するときだけ。** ページ遷移演出は付けない
7. 兄弟要素の間隔は margin ではなく親の `gap` で作る

## コマンド

- 開発: `npm run dev`
- ビルド: `npm run build`
- 型チェック: `npx tsc --noEmit`
```

---

## 最初にやること

1. このファイルと `design-doc.md` / `style-guide.html` を `docs/` に置く
2. `style-guide.html` をブラウザで開き、アクセントカラーを決める → 最下部「トークン出力」からCSSをコピー
3. `npx create-next-app@latest` → `npx shadcn@latest init` → コピーしたトークンを `globals.css` に貼る
4. 上記の CLAUDE.md をリポジトリ直下に作成
5. フェーズ0から順に進める

---

追記

アクセントカラーは選択肢の中の青にする
