# デザインシステム要約

`docs/design-doc.md` §2 の実装向け要約。**UIを書く前にこれを読む。**
逸脱が必要なときは、コードより先に design-doc.md を更新する。

---

## 原則

1. **Calm & Dense** — 管理画面らしい情報密度。装飾ではなく整列・余白・タイポで階層を作る
2. **Monochrome first** — 色は意味を持つときだけ。彩色は primary のみ、それ以外はニュートラルスケール
3. **Motion is opt-in** — アニメーションは状態変化の理解を助けるときだけ

---

## カラー

トークンの定義は `src/app/globals.css` の一箇所だけ。ニュートラルは **zinc**（純グレーよりわずかに寒色）。
アクセントは **Blue `hsl(221 83% 53%)`**（= `#2563EB`、白背景に対して 4.5:1 以上）。

| トークン | Tailwindクラス | 用途 |
|---|---|---|
| `--background` / `--foreground` | `bg-background` / `text-foreground` | 地と本文 |
| `--card` | `bg-card` | カード面 |
| `--elevated` | `bg-elevated` | サイドバー等の一段沈んだ面 |
| `--muted` / `--muted-foreground` | `bg-muted` / `text-muted-foreground` | 補助面・説明文・メタ情報 |
| `--border` / `--border-strong` | `border-border` / `border-border-strong` | 境界線 |
| `--primary` | `bg-primary` `text-primary` | **唯一の彩色** |
| `--ring` | `ring-ring` | フォーカスリング |
| `--destructive` | `text-destructive` | エラーのみ |
| `--star` | `text-star` / `fill-star` | お気に入り（☆）の黄色。**これ以外では使わない** |

### primary / グラデーションを使ってよい場所（これ以外では使わない）

- 主アクション（お問い合わせ / 送信）のボタン → `variant="brand" size="cta"`（グラデーション + 太字）。
  ホバーでグラデーションの位置が流れる（`bg-brand-sweep` が `background-size: 220%` を敷いている）
- アクティブなナビ項目のアイコン
- フォーカスリング
- **アイブロウのドット**（`Eyebrow` コンポーネント内の小さな丸）
- **スキルカードのアイコンタイル**（`tile-1`〜`tile-6`）
- **ページ上部のにじみ**（`bg-glow`）とセクションの下地（`bg-surface-gradient`）

それ以外の表現:

- **リンク** → 下線 + `text-foreground`（青リンクにしない）
- **バッジ** → `variant="secondary"` または `variant="outline"`（`default` は primary 塗りなので使わない）
- **状態の強調** → `bg-muted` + `font-medium`

### グラデーション

**色数は増やさない。** primary(blue) から violet へ抜ける1系統だけを使い、階調で表情を出す。

| トークン | ユーティリティ | 用途 |
|---|---|---|
| `--gradient-brand` | `bg-brand` / `text-brand` | アイブロウのドット、タイムラインの点 |
| `--gradient-brand` | `bg-brand-sweep` | 主アクションのボタン。ホバーで位置が動くよう広く敷く |
| `--gradient-surface` | `bg-surface-gradient` | アプリシェル全体の下地 |
| `--gradient-glow` | `bg-glow` | ページ上部・CTAブロックの淡いにじみ |
| `--tile-1` 〜 `--tile-6` | `tile-1` 〜 `tile-6` | スキルカードのアイコンタイル（blue → violet の6段） |

面をグラデーションで塗らない。**点（ドット・アイコンタイル）と、ほとんど見えない下地にだけ使う。**

### ダークモード

v1 スコープ外。ただし `.dark` のトークンは定義済みなので、**生の色値を書かない限り**
`<html class="dark">` を足すだけで動く状態を保つ。

---

## タイポグラフィ

**欧文は Noto Sans、和文は游ゴシック**（OS標準）。
Noto Sans は latin サブセットだけ読むので、和文は自動的にスタックの次点へ落ちる。
本文基準は **14px**。マーケサイト的な大文字ヒーローは作らない。

```
--font-sans: var(--font-noto-sans), "Yu Gothic Medium", "游ゴシック Medium",
             YuGothic, "游ゴシック体", "Yu Gothic", "游ゴシック", "Hiragino Sans",
             "Hiragino Kaku Gothic ProN", Meiryo, system-ui, sans-serif;
--font-mono: var(--font-sans);   /* 字面は同じ。数字だけ tabular-nums で揃える */
```

ウェイトのメリハリで階層をつくる。見出しは `font-bold`、本文は通常ウェイト。

| 用途 | クラス |
|---|---|
| トップの導入 (h1, hero) | `text-3xl sm:text-[2.125rem] font-bold tracking-tight`（1行目 foreground / 2行目 muted の2トーン） |
| ページタイトル (h1) | `text-2xl font-bold tracking-tight` |
| セクション見出し (h2) | `text-xl font-bold tracking-tight` |
| カード見出し | `text-[0.9375rem] font-bold tracking-tight` |
| ラベル | `text-sm font-medium` |
| 本文・説明文 | `text-sm text-muted-foreground` |
| メタ情報（日付・タグ） | `text-xs text-muted-foreground` |
| 数値・ドメイン・キー | `font-mono text-xs`（游ゴシック + `tabular-nums`） |

`h1`〜`h4` には `font-feature-settings: "palt"` が globals.css で当たっている（和文の字間詰め）。

---

## スペーシング・レイアウト

- 4px グリッド（Tailwind デフォルト）
- カード内 padding は `p-4`〜`p-6`、セクション間は `gap-6` / `gap-8`
- **兄弟要素の間隔は margin ではなく親の `gap`**
- アプリシェル: **ヘッダー `h-14` が画面幅いっぱい**（sticky, z-40）。その下に サイドバー `w-60` + メイン
  （モバイルはサイドバーを Sheet でドロワー化）
- ヘッダー: 左に メニュー(モバイル) / ロゴ、右に 外部リンク(GitHub・Zenn) / ダークモード / お問い合わせCTA
- サイドバー: `Menu` 見出し + 開閉ボタン / ナビ / 最下部に屋号カード。`sticky top-14`
- **パンくずはヘッダーではなくコンテンツの先頭**（`PageHeader` が描画する）
- **コンテンツの左右余白は `px-4 sm:px-6 lg:px-10`（PCで40px固定）。中央寄せの最大幅は取らない**（`AppShell` の `GUTTER`）
- ヘッダーの余白は `px-4 sm:px-6 lg:pl-4 lg:pr-10`（`HEADER_GUTTER`）。
  左はサイドバーの内側（`p-4`）に合わせてロゴを縦のラインに乗せ、右はコンテンツの余白に合わせる
- サイドバーは開閉できる。畳むと `w-16` のアイコンレール（ツールチップ付き）になり、
  状態は localStorage に保存する（`lib/sidebar-store.ts`）。**開閉ボタンはサイドバー内に置く**
- **開閉しても中身は再レイアウトしない。** 中身は常に `w-60` で描画し、外側の `aside` の幅だけを
  アニメーションさせて、はみ出た分を `overflow-hidden` で切り取る。
  幅が縮む途中で文字が折り返される問題を避けるための構造（`whitespace-nowrap` も併用）
- **畳んでも開閉ボタンとナビのアイコンは動かない。** レール幅 64px の中心（32px）に対し、
  ナビのアイコン中心 31.5px（`p-4` + `px-2` + 15px/2）、開閉ボタン中心 32px（`size-8`、ロゴ枠を 0 幅にする）
  が揃うように寸法を決めている。ヘッダー行の高さは `h-8` 固定なので縦位置も変わらない
- 出し入れする要素は `opacity` でクロスフェードする（開くときは `delay-150` で幅の変化の後に出す）。
  `motion-reduce:transition-none` で、モーションを減らす設定は尊重する
- サイドバーは上から ロゴ / Menu / （下寄せで）Links / 屋号カード。
  **メニューに視線を集めたいので、外部リンクは下に寄せる**
- カード境界は `border` + `rounded-lg`

## 影

2段階だけ。

- `shadow-sm` — 既定。カード等
- `shadow-md` — ポップオーバー・ドロワーだけ

`shadow-lg` 以上は使わない。

## 角丸

`--radius: 0.5rem` の1つを基準に、`rounded-sm/md/lg/xl` が相対値で導出される。
コンポーネントに固定 px の角丸を書かない。

**スーパー楕円（`corner-shape: superellipse(4)`）はピルにだけ使う。**

| ユーティリティ | 用途 |
|---|---|
| `pill` | 完全な角丸 + スーパー楕円。アイブロウ等のピル |
| `corner-smooth` | 既存の `rounded-*` に重ねてスーパー楕円だけ足す（現状は未使用） |

⚠️ **カードには使わない。** `superellipse(4)` は角の曲率が四角に寄るため、
半径の小さいカードに当てると「角が直角に見える」。ピルのように半径が大きい要素でだけ効果が出る。
`corner-shape` 未対応のブラウザでは通常の `border-radius` にフォールバックする。

## アイコン

**lucide-react のみ**（アイコンセットを2つ混ぜない）。

- サイズは 3段階: `size-[18px]` / `size-4`（16px, 既定）/ `size-[13px]`
- `stroke-width: 1.75` は globals.css で全体に適用済み
- サイドバーの各ナビ項目にアイコンを付け、**アクティブ時のみ** `text-primary`

## ホバー

**クリックできない要素にホバー効果を付けない。**
スキルカード・会社概要・略歴のように操作のないカードは、ホバーしても何も起きないのが正しい。
ホバーで反応してよいのはリンク・ボタン・チップだけ。

## Markdown 本文（`.prose-work`）

実績詳細と記事モーダルで共有する。`@tailwindcss/typography` は入れず `globals.css` で定義する。

- `h2` に下線は付けない（`font-bold` で階層を作る）
- **箇条書きの丸はアクセントカラー**（`ul > li::marker { color: var(--primary) }`）。数字（`ol`）は色を変えない
- テーブルは `display: block` + `width: max-content` + `overflow-x: auto` で、
  幅が足りないときだけ横スクロールさせる（GitHub の markdown と同じ手法）

## モーション

`tw-animate-css` の enter / exit のみ。ページ遷移アニメーションは付けない。
「かっこいいから」で入れたモーションはレビューで落とす。

**ツールチップは待たせない**（`TooltipProvider delayDuration={0}`）。
アイコンだけのボタンの意味を補うものなので、遅れて出ると用を成さない。
出現そのものは 150ms のフェードで、これは遅延ではなく描画のアニメーション。

---

## コンポーネント

**ベースは shadcn/ui**（コピー&オウン、`src/components/ui/`）。追加は `npx shadcn@latest add`。

導入済み: `button` `card` `badge` `tabs` `toggle-group` `dialog` `separator` `sheet`
`input` `textarea` `label` `skeleton` `tooltip` `scroll-area` `toggle`

`button` にはコピー&オウンで2つ足してある（主アクション専用。戻るボタン等は既存のサイズのまま）:

- `variant="brand"` — ブランドグラデーション塗り
- `size="cta"` — `h-10 px-5 font-bold`

独自コンポーネント（`src/components/`）:

| コンポーネント | 役割 |
|---|---|
| `AppShell` / `SideNav` / `MobileNav` / `Breadcrumb` | ダッシュボードレイアウト。サイドバー開閉・ダークモードの導線・お問い合わせCTAはヘッダーに集約 |
| `Logo` | 屋号のロゴ。`mark` でシンボルのみ（サイドバーを畳んだとき用）。色は `currentColor` |
| `Breadcrumb` | コンテンツ先頭に置く。`ホーム > セクション > 現在地`。**詳細ページでは親をリンクにして戻る導線を兼ねる**（個別の「戻る」ボタンは置かない）。トップは階層が無いので出さない |
| `PageHeader` / `SectionHeading` / `Eyebrow` | タイトル + 説明 + アクションのスロット。`size="hero"` はトップの導入だけ |
| `SkillItem` | グラデーションのアイコンタイル + 見出し + 説明文 |
| `WorkCard` / `WorkMeta` | 実績カード / 詳細のメタ情報 |
| `ArticleToolbar` | カテゴリTabs + タグchip + ☆ + 表示切替 |
| `ArticleRow` / `ArticleCard` / `ArticleDialog` | 記事の行 / カード / モーダル |
| `Thumbnail` | サムネイル + レターマークのフォールバック |
| `EmptyState` | 絞り込み0件 / API失敗 |
