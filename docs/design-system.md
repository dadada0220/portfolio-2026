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
| `--star` | `text-star` / `fill-star` | おすすめ（☆）の黄色。**これ以外では使わない** |

### primary / グラデーションを使ってよい場所（これ以外では使わない）

- 主アクション（お問い合わせ / 送信）のボタン → `variant="brand" size="cta"`（グラデーション + 太字）。
  ホバーでグラデーションの位置が流れる（`bg-brand-sweep` が `background-size: 220%` を敷いている）
- アクティブなナビ項目のアイコン
- フォーカスリング
- **アイブロウのドット**（`Eyebrow` コンポーネント内の小さな丸）
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

面をグラデーションで塗らない。**点（ドット・アイコンタイル）と、ほとんど見えない下地にだけ使う。**

### ダークモード

v1 スコープ外。ただし `.dark` のトークンは定義済みなので、**生の色値を書かない限り**
`<html class="dark">` を足すだけで動く状態を保つ。

---

## タイポグラフィ

**欧文・和文とも Zen Kaku Gothic New**（`next/font/google` で self-host）。
OSごとの字面の差を作らないため、和文もWebフォントで揃える。

可変フォントではないので、**使うウェイトは 400 / 500 / 700 の3つだけ**。
`font-semibold`(600) は当てない（持っていないウェイトは合成太字になる）。
本文基準は **14px**。マーケサイト的な大文字ヒーローは作らない。

```
--font-sans: var(--font-zen-kaku), "Hiragino Sans",
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
| 数値・ドメイン・キー | `font-mono text-xs`（本文と同じ字面 + `tabular-nums`） |

`h1`〜`h4` には `font-feature-settings: "palt"` が globals.css で当たっている（和文の字間詰め）。

`next/font` の `subsets` は**プリロードする範囲**の指定。Google Fonts に "japanese" という
名前付きサブセットが無いので `["latin"]` しか渡せないが、和文のグリフは unicode-range で
分割された woff2 として同時に self-host され（3ウェイト × 121範囲 = 363ファイル）、
ブラウザが必要な範囲だけを取りに行く。

## 変数に書く本文

`src/lib/profile.tsx` の `skills.body` / `timeline.description` / `intro.body` は
**`string` ではなく `ReactNode`**。改行を入れたいときは `<>…<br />…</>` と書ける
（このファイルが `.tsx` なのはそのため）。

---

## スペーシング・レイアウト

- 4px グリッド（Tailwind デフォルト）
- カード内 padding は `p-4`〜`p-6`、セクション間は `gap-6` / `gap-8`
- **兄弟要素の間隔は margin ではなく親の `gap`**
- **ただし1つの `gap` でグループ内を等間隔にしない。** 関連する要素は入れ子の箱にまとめ、
  まとまりの中は狭く、まとまりの間は広く取る。等間隔は「どれとどれが一組か」を消してしまう。
  例（`WorkCard`）: 画像パネル ⇔ 本文パネル `8px` / 種別 ⇔ タイトルと概要 `10px` / タイトル ⇔ 概要 `4px`
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

## セグメントコントロール

絞り込みの切り替えは `Segmented`（`src/components/segmented.tsx`）1つに統一する。
実績一覧（リンク）とブックマーク（ボタン）で同じ見た目を共有する。

- **レールに枠線は引かない。** 一段沈んだ面（`bg-muted`）の上を、
  **選択中の1枚だけが白く浮く**（`bg-card` + `shadow-chip`）。構造は面の明暗と影だけで見せる
- レールの内側に 4px の余白を取り、つまみが浮いていることを見せる（全体の高さは 32px のまま）
- 文字は **13px**、**太さは選択状態で変えない**
- **選択で文字の太さを変えない**のは共通の原則。太さが変わると幅が動き、
  隣の項目が押し出されたり、タグの列が段落ちしたりする。
  状態は**面の色**（塗り／反転）で示す

## カード面

**箱の調子は `surface-card` 1つに集約する。** 角丸と影を各所で書かない。

| ユーティリティ | 中身 | 使う場所 |
|---|---|---|
| `surface-card` | `rounded-card` + `border` + `bg-card` + `shadow-lift` | サイト中のカード・パネル・リスト枠 |
| `surface-mat` | `rounded-card` + `bg-muted` + `shadow-lift` | 画像を額装するときの台紙。中に白いパネルを置く（`WorkCard`） |

- 基準は実績カード。角丸 **12.4px**（`--radius-card`）、影は**接地の1px + 遠くのやわらかい影の二段**（`--elevation-lift`）
- padding は箱ごとに違うので各コンポーネントで指定する
- **入れ子のパネルには `surface-card` を使わない。** 角丸が台紙と同じになって入れ子に見えなくなる。
  内側は一段小さい `rounded-lg` / `rounded-md` を当てる
- `surface-mat` は囲う画像があるときだけ。文字だけの箱に使うと、囲う対象が無いのに面が増える

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

例外は2つだけ。どちらも lucide が持っていないものを自前で用意している。
- `brand-icons.tsx` — GitHub / Zenn のブランドマーク（lucide v1 がブランドアイコンを廃止）
- `skill-icons.tsx` — スキルカードの**塗りアイコン**（lucide は線のセットで、塗りを持たない）

- サイズは 3段階: `size-[18px]` / `size-4`（16px, 既定）/ `size-[13px]`
- `stroke-width: 1.75` は globals.css で全体に適用済み
- サイドバーの各ナビ項目にアイコンを付け、**アクティブ時のみ** `text-primary`

## ホバー

**クリックできない要素にホバー効果を付けない。**
スキルカード・会社概要・略歴のように操作のないカードは、ホバーしても何も起きないのが正しい。
ホバーで反応してよいのはリンク・ボタン・チップだけ。

反応してよい場所では、**動かすのは1〜2要素まで**。文字は動かさない（読んでいる途中で行が逃げる）。

| 場所 | 動き |
|---|---|
| 実績カード（`WorkCard`） | カードが 4px 浮く + 画像だけ 1.05 倍に寄る（500ms）。文字は据え置き |
| 一覧への導線（`ViewAllLink`） | 下線が左から引かれる + 矢印が右へ抜けて次の矢印が左から入る |

いずれも `motion-reduce:` で無効化する。

## 画像の上の文字

ヒーローのように画像を背景にするときは、**覆い（`bg-hero-scrim`）を敷いてから
`text-on-image` / `text-on-image-muted` で置く**。素材の明るさに関わらず可読性が決まる。
`text-white` のような生の色をコンポーネントに書かない（トークンは `globals.css` の1箇所）。

**小さいタイルの上に白いグリフを置くとき**（スキルカードの24pxタイル）は、
**暗い覆いを敷かず、素材の彩度を上げて**（`saturate-220`）グリフを立たせる。
覆いで暗くすると素材の色が濁るため。仕上げに `drop-shadow-glyph` で輪郭を確保する。

素材は領域ごとに色で選ぶ（デザイン=赤 / フロント=黄橙 / バック=青 / 施策=緑 / AI=紫）。
**「その他」だけは色を持たせず `grayscale`**。カテゴリ色ではないことを無彩色で示す。
淡い素材（クリーム系・淡青系）は彩度を上げても白が沈むので、タイルには使わない。

## Markdown 本文（`.prose-work`）

実績詳細と記事モーダルで共有する。`@tailwindcss/typography` は入れず `globals.css` で定義する。

- **本文は `text-foreground`（黒）**。説明文・メタ情報を muted にするアプリ側のルールとは、
  ここだけ扱いが違う。長文を読ませる場所なので、段落・リスト・引用・テーブルのセルまで黒で置く
- 見出しは **20 / 16 / 14px**（`h2` = `text-xl` でセクション見出しに揃える、`h3` = `text-base`、本文 = `text-sm`）。
  いずれも `font-bold tracking-tight`
- `h2` に下線は付けない（`font-bold` で階層を作る）
- **箇条書きの丸はアクセントカラー**（`ul > li::marker { color: var(--primary) }`）。数字（`ol`）は色を変えない
- テーブルは `display: block` + `width: max-content` + `overflow-x: auto` で、
  幅が足りないときだけ横スクロールさせる（GitHub の markdown と同じ手法）。
  角丸は `pre` / `img` と同じ `rounded-lg`。`border-collapse` だと角がセルに欠かれるので
  **`border-separate` + `border-spacing: 0`** にして、外周の枠線と角丸はテーブル自身が持ち、
  セルは内側の罫線だけを引く（`overflow-x` が角丸のクリップも兼ねる）

### カスタムブロック

Markdown だけでは組めないレイアウトは **コンテナディレクティブ**（`:::名前{属性}` 〜 `:::`）で書く。
入れ子にするときは **外側のコロンを内側より多く** する。

| ブロック | 記法 | 用途 |
|---|---|---|
| `columns` / `col` | `::::columns{cols=3}` の中に `:::col` を並べる | 画像 + 見出し + 本文を横並びにするセクション。`cols` は 2 か 3（省略時は `col` の数）。狭い画面では1カラムまで落ちる |

```markdown
::::columns{cols=3}
:::col
![代替テキスト](figma-01.png)
### 見出し
本文
:::
::::
```

**ブロックを増やす手順は3つ。**

1. `src/lib/markdown/blocks.ts` の `workBlocks` に1件足す
2. `globals.css` の `.prose-work [data-block="名前"]` にスタイルを書く
3. この表に追記する

出力は必ず `data-block="名前"` を持つ要素になる。**Markdown から class は書かせない**
（任意の class を許すと、トークン外の見た目が本文に混ざるため）。
未定義の名前や不正な属性値はビルドを止める（素通しすると、書いたつもりのブロックが本文にそのまま出て気づけない）。

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
