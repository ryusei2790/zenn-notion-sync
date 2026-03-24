---
title: "【初心者向け】Chrome拡張のコードを丁寧に読み解く｜定数・変数・関数の役割とバグの見つけ方"
emoji: "🔍"
type: "tech"
topics: ["AI", "task"]
published: true
---

## はじめに

プログラミングを始めたばかりのころ、他の人が書いたコードを読んでも「変数の名前は見えるけど、何をしているのかよくわからない」という経験はありませんでしたか？

私も最初はそうでした。関数の定義と呼び出しの区別がつかなかったり、`async/await` が何をしているのかピンとこなかったり…。

今回は、Chrome拡張機能のバックグラウンドスクリプトとして実際に使われるコードを題材に、**変数・定数・関数・ライブラリ（API）それぞれが何をしているのか**を初心者の方向けに丁寧に整理してみます。

また、このコードには **バグが1つ潜んでいる** ので、最後にその解説もします。コードレビューの練習にもなるので、ぜひ最後まで読んでみてください。

---

## 対象コード

```javascript
const ALARM_NAME = "daily-article";
const STORAGE_KEY_GAS_URL = "gasUrl";
const NOTIFICATION_ID = "blog-read-forced";

async function getGasUrl() {
    const result = await chrome.storage.local.get(STORAGE_KEY_GAS_URL);
    return result[STORAGE_KEY_GAS_URL] || null;
}

async function fetchRandomArticle(gasUrl) {
    const res = await fetch(gasUrl, { method: "GET" });
    if (res.ok) {
        throw new Error(`GAS fetch failed: ${res.status}`);
    }
    return res.json();
}
```

---

## 登場する概念の整理

このコードには、次の要素が登場します。

- **定数（**`**const**`**）** ：変わらない値に名前をつけたもの
- **非同期関数（**`**async function**`**）** ：時間がかかる処理を待てる関数
- **ライブラリ（Chrome API / Fetch API）** ：ブラウザが提供する便利な機能群
---

## 1. 定数（const）の解説

### 定数とは？

「定数」とは、**プログラムの中で使用する値、特にプログラムの中でずっと同じ値に名前をつけたもの**です。`const` キーワードで宣言すると、あとから値を変えることができません。

```javascript
const ALARM_NAME = "daily-article";　
const STORAGE_KEY_GAS_URL = "gasUrl";
const NOTIFICATION_ID = "blog-read-forced";
```

一個めを例にすると、ALAEM_NAMEっていう箱の中にdaily-articleっていう値、文字を入れておく感じです。

### なぜ名前をつけるの？

たとえば、コードの中で 2個めの`"gasUrl"` という文字列(ここにはURLが入力されます。)をそのまま何度も書くと、こんな問題が起きます。

- タイポ（誤字）があっても気づきにくい、同じURLを何回もコピペや直書きしてミスしやすい。
- 後から変更するときに、全部の下手書き箇所を探し直す必要がある
名前をつけておけば、その名前を変えるだけで一括変更できますし、**名前を見れば意味がわかる**ので、コードが読みやすくなります。

### 各定数の意味

> 💡 定数名がすべて大文字のスネークケース（`ALARM_NAME` のように単語を `_` でつなぐ）になっているのは、JavaScriptのよくある慣習で「これは定数ですよ」と他の開発者に伝えるためのルールです。

---

## 2. ライブラリ（Chrome API）の解説

### ライブラリとは？

**ライブラリ**とは、**誰かがあらかじめ作っておいてくれた便利な機能の集まり**です。自分でゼロから書かなくても、ライブラリを使えば複雑な処理を数行で実現できます。

微分したい時に１から微分を定義して関数にする必要がなく、関数をbibun();みたいにして()の中に微分したい関数をny

このコードでは、以下の2つのライブラリ（API）が使われています。

### chrome（Chrome Extensions API）

`chrome.storage.local` は、**Chrome拡張機能専用のデータ保存機能**です。ブラウザを閉じてもデータが消えない「ローカルストレージ」にアクセスできます。

```javascript
chrome.storage.local.get(キー名)  // データを取得する
chrome.storage.local.set(...)     // データを保存する
```

### fetch（Fetch API）

`fetch` は、**インターネット上のURLにリクエストを送る機能**です。Google Apps Script（GAS）のウェブアプリのURLにアクセスする場面でよく登場します。

```javascript
fetch(url, { method: "GET" })  // URLにGETリクエストを送る
```

---

## 3. 非同期関数（async function）の解説

普通のプログラムは「1行目→2行目→3行目」と順番に進みます。しかしネットワーク通信やストレージの読み書きは、**処理が完了するまでに時間がかかります**。

`async/await` を使うと、「この処理が終わるまで待ってから次に進んでね」と書けるようになります。

- `async` ：「この関数は非同期処理を含みますよ」という宣言
- `await` ：「この行が終わるまで待ってから次に進んでね」という指示
---

## 4. `getGasUrl()` 関数の解説

```javascript
async function getGasUrl() {
    const result = await chrome.storage.local.get(STORAGE_KEY_GAS_URL);
    return result[STORAGE_KEY_GAS_URL] || null;
}
```

一言でいうと、「**Chrome のローカルストレージから GAS の URL を取り出す関数**」です。

`chrome.storage.local.get("gasUrl")` を呼び出すと、ストレージに保存されている `{ gasUrl: "https://..." }` のようなオブジェクトが返ってきます。`await` をつけているので、取得が完了するまで次に進みません。

`result["gasUrl"]` でURLの値を取り出します。もし保存されていなければ `undefined` になるので、その場合は `null` を返します。`||` は「左が偽なら右を使う」という演算子です。

---

## 5. `fetchRandomArticle()` 関数の解説

```javascript
async function fetchRandomArticle(gasUrl) {
    const res = await fetch(gasUrl, { method: "GET" });
    if (res.ok) {
        throw new Error(`GAS fetch failed: ${res.status}`);
    }
    return res.json();
}
```

一言でいうと、「**GASのURLにアクセスして、ランダムな記事データを取得する関数**」です。`fetch` でGASのURLにGETリクエストを送り、レスポンスをJSON形式で返します。

`res.ok` は、通信が成功したとき（HTTPステータスコードが200番台のとき）に `true` になります。

---

## ⚠️ バグを発見！

このコードには **バグが1つ** あります。

```javascript
// ❌ バグあり
if (res.ok) {
    throw new Error(`GAS fetch failed: ${res.status}`);
}

// ✅ 正しくはこう
if (!res.ok) {
    throw new Error(`GAS fetch failed: ${res.status}`);
}
```

`res.ok` は通信が**成功したとき** `true` になります。つまり現在のコードは「**成功したときにエラーを投げ、失敗したときは素通りする**」という逆の動きをしてしまっています。

正しくは `!res.ok`（`!` で否定）とすることで、「**失敗したときだけエラーを投げる**」になります。このような条件の逆転バグは実際の開発でも起きやすいミスです。

---

## まとめ

- **定数（**`**const**`**）** は変わらない値に名前をつけることで、コードを読みやすく・変更しやすくする
- **Chrome API** や **Fetch API** はブラウザが提供するライブラリで、ゼロから書かずに便利な機能を使える
- `**async/await**` は時間のかかる処理を「待つ」ための仕組み
- `**||**`**（OR演算子）** はデフォルト値を返す場面でよく使われる
- `**res.ok**` は通信成功時に `true`、失敗時に `false` になる真偽値
コードを読むときは「変数/定数が何を表しているか」「関数が何をして何を返すか」を1行ずつ確認していくのが理解への近道です。この記事が、コードリーディングのちょっとしたきっかけになれば嬉しいです。

