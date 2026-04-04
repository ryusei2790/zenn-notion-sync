---
title: "JavaScript初心者でもわかる！fetch関数とasync/awaitの使い方【GAS連携編】"
emoji: "🔍"
type: "tech"
topics: ["blog"]
published: false
---

## はじめに

「JavaScriptでAPIを叩く」って聞いたとき、最初はちんぷんかんぷんですよね。

この記事では、こんな方に向けて書きました。

- `fetch`って何？って思ってる人
- `async`と`await`の意味がわからない人
- GAS（Google Apps Script）と連携するコードを読みたい人
この記事を読めば、以下のことがわかります。

- ✅ `fetch`関数の役割と使い方
- ✅ `async/await`の書き方と意味
- ✅ `fetchRandomArticle`関数の全行解説
それでは、さっそく行きましょう！

---

## fetchって何？まずは「お使い」のイメージで覚えよう

`fetch`は、**外のサーバーにデータをもらいに行く関数**です。

日常生活に例えると、「コンビニにお使いに行って、商品を持ち帰る」感じです。

- コンビニ = GAS（Google Apps Script）のサーバー
- 商品 = JSONデータ
- お使いする人 = `fetch`関数
```javascript
const res = await fetch(gasUrl, { method: "GET" });
```

このコードは「`gasUrl`というURLのお店へ、GETという方法で取りに行ってください」という指示です。

**ポイント：**`**fetch**`**はURLを指定してデータを取ってくる関数です。**

---

## async/awaitって何？「待って」を表現するキーワード

JavaScriptは**超高速で処理を進める**言語です。でも、外のサーバーにデータをもらいに行くときは、**返事が来るまで待つ必要**があります。

そのための仕組みが`async/await`です。

`await`をつけないと、データが来る前に次の処理に進んでしまって、エラーになります。気をつけましょう！

---

## fetchRandomArticle関数をまるごと解説

では、今回の関数をコードごと丸ごと見ていきましょう！

```javascript
async function fetchRandomArticle(gasUrl) {
  const res = await fetch(gasUrl, { method: "GET" });
  if (!res.ok) {
    throw new Error(`GAS fetch failed: ${res.status}`);
  }
  return res.json();
}
```

全体で6行だけです。シンプルですね！順番に見ていきます。

### ① gasUrlって何？（引数の話）

`gasUrl`は**引数（ひきすう）**です。この関数を呼び出すときに外から渡すURLのことです。

GAS（Google Apps Script）で作ったWeb APIのURLを渡す想定になっています。

### ② fetch(gasUrl, { method: "GET" })の意味

- `fetch(gasUrl, ...)` → 指定したURLにアクセスする
- `{ method: "GET" }` → 「データを取得したい（GETリクエスト）」という意味
- `await` → 返事が来るまで待つ
- `const res = ...` → 返ってきた「レスポンス（返事）」を`res`に入れる
`res`はまだ「生の返事」の状態です。この時点ではJSONのデータはまだ入っていません。

### ③ if (!res.ok) のエラーチェック

`res.ok`は、**通信が成功したかどうかを表すフラグ**です。

- 成功（200番台）→ `res.ok`が`true`
- 失敗（404や500など）→ `res.ok`が`false`
`!res.ok`は「成功じゃなかったら」という意味なので、失敗したときに`throw new Error(...)`でエラーを投げます。

`res.status`にはHTTPステータスコード（404とか500とか）が入るので、エラーメッセージにそのまま入れています。

**ポイント：エラーチェックを入れておくと、何が失敗したか一目でわかります。**

### ④ return res.json()

最後の行です。`res.json()`は、**「生の返事」をJavaScriptのオブジェクトに変換するメソッド**です。

GASから返ってくるデータはJSON形式なので、これで使いやすい形に変換します。

---

## 実際にどう使う？呼び出し方を見てみよう

関数の定義だけではわからないので、実際に使う側のコードも見てみましょう。

```javascript
const GAS_URL = "https://script.google.com/macros/s/xxxx/exec";

async function main() {
  try {
    const article = await fetchRandomArticle(GAS_URL);
    console.log("取得した記事:", article);
  } catch (error) {
    console.error("エラーが発生しました:", error.message);
  }
}

main();
```

`**try/catch**` を使うことで、`throw new Error(...)`で投げたエラーをしっかりキャッチできます。

関数の外でも`await`を使うので、呼び出す側の関数も`async`にするのを忘れずに！

---

## よくある質問（FAQ）

### Q1. `await`を忘れるとどうなりますか？

`await`を忘れると、返事が来る前に次の処理が走ります。`res`がPromiseオブジェクトのままになってしまい、`res.ok`などが正しく動きません。必ずつけましょう。

### Q2. `{ method: "GET" }`は省略できますか？

`fetch`のデフォルトはGETなので、省略可能です。ただし、コードの意図を明示するために書いておく方が読みやすくなります。

### Q3. GASのURLはどこで確認できますか？

Google Apps Scriptの「デプロイ」→「ウェブアプリとしてデプロイ」から確認できます。`exec`で終わるURLがAPIのエンドポイントです。

### Q4. `res.json()`の前に`await`は不要ですか？

`res.json()`はPromiseを返します。本来は`await res.json()`とすべきですが、`return`と組み合わせた場合は呼び出し元の`await`が処理するため動作します。ただし明示的に`await res.json()`と書くほうが安全です。

### Q5. エラーが出たとき`res.status`には何が入りますか？

HTTPステータスコードが入ります。URLが間違っている場合は`404`、サーバーエラーなら`500`が入ります。

---

## まとめ

今回の`fetchRandomArticle`関数で学んだことをまとめます。

- ✅ `fetch`は外のサーバーにデータを取りに行く関数
- ✅ `async/await`で「待ち処理」を表現する
- ✅ `res.ok`でエラーチェックするのが基本パターン
- ✅ `res.json()`でJSONデータをオブジェクトに変換する
- ✅ 呼び出し側でも`async/await`と`try/catch`をセットで使う
たった6行のコードですが、JavaScriptのAPI連携の基本がぎゅっと詰まっています。

ぜひ自分のプロジェクトにも取り入れてみてください！

---

## この記事を書いた人

**ryusei Ueda**

動画編集 × プログラミング学習中。DaVinci Resolve を使った動画編集と、Web開発・統計学習を並行して進めています。学んだことをZenn・note・WordPressで発信中。

- 📺 YouTube: [ryuseiUeda チャンネル](http://www.youtube.com/@ryuseiUeda-0106)
- 📸 Instagram: [@obako_illustrate](https://www.instagram.com/obako_illustrate/?hl=ja)
- 🐦 X (Twitter): [@zzkptrjmj36b7ic](https://x.com/zzkptrjmj36b7ic)
---

## 📲 LINE 公式アカウント

限定情報やお役立ちコンテンツをLINEで配信しています。ぜひ登録してください！

👉 [LINE公式アカウントに登録する](https://line.me/R/ti/p/@202qpxlu)

