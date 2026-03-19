---
title: "【保存版】Tailwind CSSのクラス名、1個ずつ丁寧に読み解いてみた〜フォームUI編〜"
emoji: "🎨"
type: "tech"
topics: ["react", "next.js"]
published: true
---

「このTailwindのクラス名、なんとなくコピペしているけど、実際に何をやっているのかよくわかっていない…」

私もそうでした。特にフォームのUI部分は、クラスが多くて読むだけでお腹いっぱいになってしまいます。

そこで今回は、実際に使ったフォームUIのTailwindクラスを、ひとつずつ丁寧に読み解いてみました。「なんとなく動いているコード」を「ちゃんと理解して書けるコード」に変えるきっかけになれば嬉しいです。

---

## テキスト入力（`<input type="text">`）のクラスを読む

まずはテキスト入力欄のクラスから見ていきましょう。

```javascript
"flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
```

`flex-1`は「フレックスコンテナの中で残りのスペースを全部使う」という指定です。隣にボタンがある場合、ボタンのサイズは固定で、入力欄だけが残りのスペースいっぱいに広がるイメージです。

次にテキストスタイルです。

```javascript
"text-sm text-zinc-100 placeholder-zinc-500"
```

ダークUIでは、入力テキストはほぼ白（`zinc-100`）にして、まだ何も入力していないときのガイドテキスト（プレースホルダー）は控えめなグレー（`zinc-500`）にするのがよく使われるパターンです。

最後にフォーカス時の見た目。

```javascript
"focus:border-indigo-500 focus:outline-none"
```

`focus:outline-none`は、ブラウザが自動でつける「青い輪っか」を消すためのものです。ただし、アクセシビリティの観点から、outlineを消す場合は代わりに`focus:border-indigo-500`のような視覚的フィードバックを必ずセットで用意しましょう。このコードはその模範例になっています。

---

## ラベル（`<label>`）のクラスを読む

```javascript
"text-xs text-zinc-500 whitespace-nowrap"
```

`whitespace-nowrap`は、「重み」「件数」などの短いラベルが途中で改行されてしまうのを防ぎます。横並びのレイアウトで特に効いてくるクラスです。

---

## 数値入力（`<input type="number">`）のクラスを読む

```javascript
"w-16 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-2"
```

テキスト入力との違いは、`flex-1`の代わりに`w-16`で**幅を固定**している点です。数字は1〜2桁しか入らないので、広げる必要がないわけですね。

```javascript
"text-sm text-zinc-100 text-center"
```

`text-center`で数字を中央揃えにしているのも、数値入力ならではの細かい配慮です。

> ⚠️ **バグメモ**：`focuss:outline-none`（`s`が2つ）はタイポです。正しくは`focus:outline-none`です。Tailwindのクラスは存在しないものは単純に無視されるので、エラーは出ませんが効いていません。こういうミスは気づきにくいので要注意です。

---

## ボタン（`<button>`）のクラスを読む

```javascript
"rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
```

```javascript
"transition-colors hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
```

`disabled:`系のクラスは、UIの状態をユーザーに伝えるうえでとても重要です。「なんかクリックできない？」ではなく「あ、これは今使えないんだ」とひと目でわかるようにする工夫です。

---

## 色の体系を理解する（zinc / indigo）

Tailwindには`zinc`と`indigo`という2つのカラーパレットが登場します。

グレーの流れをおさえておくと、コードを読むのがぐっと楽になります。

```javascript
zinc-100（ほぼ白）→ zinc-500（中間グレー）→ zinc-700/800（ダーク）
```

- **テキスト色**：`zinc-100`（明るく読みやすい）
- **プレースホルダー**：`zinc-500`（控えめ）
- **枠線・背景**：`zinc-700 / zinc-800`（ダークUI向け）
このように、数字の意味を知っておくだけで「この色は何のため？」がすぐわかるようになります。

---

## まとめ

今回はフォームUIを例に、Tailwind CSSのクラスをひとつずつ読み解いてみました。私なりに整理したポイントはこんな感じです。

- `flex-1` と `w-16` の使い分け（伸びる vs 固定）
- `focus:outline-none` は視覚的フィードバックとセットで使う
- `disabled:` 系クラスでUI状態をユーザーに伝える
- zinc / indigoのカラー体系を数字で理解する
「なんとなくコピペしていたコード」が、少しでも「意図を持って書けるコード」に変わるきっかけになれば嬉しいです。

