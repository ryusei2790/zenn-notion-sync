---
title: "「コピペが面倒くさい」を10分で解決したら、AI駆動開発の入口が見えた話　AI業務効率化の第一歩は、小さなツールを自分で作ることだった"
emoji: "📝"
type: "tech"
topics: []
published: false
---

**最近、「AIを使って何か作りたい」って思ってる人、多くないですか？**

ChatGPTやClaudeに指示を出せばコードが書ける時代。「自分もAI駆動でツールを作って、仕事を効率化したい！」という声をよく聞くようになりました。

でも実際やってみようとすると、こんな壁にぶつかりません？

> *「そもそもどこから始めればいいかわからない」「AIが書いてくれたコードの意味が全然わからない」「何を作ればいいのかすら思いつかない」*

そんな方に伝えたいのが、**「まず小さいものを一個作ってみる」** という体験の大切さ。

今回私が作ったのは、**ページのタイトルとURLをワンクリックでコピーできるChrome拡張機能**。めちゃくちゃ地味です。でもこれが、AI駆動開発の練習台として最高でした。

## 

## 必要なもの

- テキストエディタ（メモ帳でもVS Codeでも何でもOK）
- Google Chrome
- 10分くらいの時間
ほんとにこれだけです。「え、そんなので作れるの？」って感じですよね。私も最初そう思ってました。

## 作り方

### ステップ1：フォルダを作る

まず、どこか適当な場所に新しいフォルダを作ります。名前は何でもOKです。私は `page-copy-extension` にしましたが、`my-extension` でも `test` でも何でも。

### ステップ2：3つのファイルを作る

このフォルダの中に、ファイルを3つ置くだけで完成します。

### 1. manifest.json

拡張機能の「自己紹介シート」みたいなものです。このツールの設定、名前や説明、どんな権限が必要かを書いておきます。

json

`{
  "manifest_version": 3,
  "name": "ページ情報コピー",
  "version": "1.0",
  "description": "現在のページのタイトルとURLをコピーします",
  "action": {
    "default_popup": "popup.html",
    "default_title": "ページ情報をコピー"
  },
  "permissions": [
    "activeTab",
    "clipboardWrite"
  ]
}`

`permissions` のところだけ意識しておくといいです。「いま開いてるタブの情報を見ていいですか」「クリップボードに書いていいですか」という許可をここで宣言しています。ここらへんをわかっていればAIに聞きながらでもより使えるアプリになると思います。

### 2. popup.html

拡張機能のボタンを押したときに出てくる小窓の中身です。見た目の部分ですね。

html

`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      width: 300px;
      padding: 15px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    h3 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .info {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
      word-wrap: break-word;
    }
    .label {
      font-weight: bold;
      color: #666;
      font-size: 12px;
    }
    .value {
      margin-top: 5px;
      font-size: 14px;
      color: #333;
    }
    button {
      width: 100%;
      padding: 10px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
    }
    button:hover { background: #45a049; }
    button:active { background: #3d8b40; }
    .success {
      color: #4CAF50;
      text-align: center;
      margin-top: 10px;
      font-size: 12px;
      display: none;
    }
  </style>
</head>
<body>
  <h3>ページ情報</h3>
  <div class="info">
    <div class="label">タイトル:</div>
    <div class="value" id="title">読み込み中...</div>
  </div>
  <div class="info">
    <div class="label">URL:</div>
    <div class="value" id="url">読み込み中...</div>
  </div>
  <button id="copyBtn">コピー</button>
  <div class="success" id="message">コピーしました！</div>
  <script src="popup.js"></script>
</body>
</html>`

普通のHTMLです。CSS も全部同じファイルに書いちゃってます。ファイルを分けると管理が面倒なので、このくらいの規模なら一体化が楽です。

HTML、CSSについて知りたい方はこちらから。
簡単な説明は以下に書いておくので気になる方はぜひ

### 3. popup.js

実際の動きを担当するファイルです。

javascript

`document.addEventListener('DOMContentLoaded', async () => {
  // 今開いているタブの情報を取ってくる
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // タイトルとURLを画面に表示
  document.getElementById('title').textContent = tab.title;
  document.getElementById('url').textContent = tab.url;
  
  // コピーボタンを押したときの処理
  document.getElementById('copyBtn').addEventListener('click', () => {
    const text = `${tab.title}\n${tab.url}`;
    
    navigator.clipboard.writeText(text).then(() => {
      const message = document.getElementById('message');
      message.style.display = 'block';
      setTimeout(() => {
        message.style.display = 'none';
      }, 1500);
    });
  });
});
```

やってることは2つだけ。`chrome.tabs.query()` でタブ情報を取得して、`navigator.clipboard.writeText()` でコピーする。それだけです。

### ステップ3：Chromeに読み込ませる

ここが一番「おっ」ってなるところです。

1. アドレスバーに `chrome://extensions/` と入力してEnter
2. 右上の「デベロッパーモード」をONにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. さっきのフォルダを選択

以上！自分で作ったものがブラウザに現れる瞬間、ちょっと感動しますよ。

## 使ってみると

ボタンをクリックすると小さなポップアップが開いて、タイトルとURLが並んで表示されます。「コピー」を押したら、そのままメモ帳やSlackに貼り付けられる。
```
ChatGPTとの付き合い方を考えてみた
https://example.com/blog/ai-thoughts`

こういう形で貼り付けられるので、ブログの参考リンクをまとめるときとか、調べ物を記録しておくときに地味に重宝します。

.jsというJavaScriptで書かれたものはwebブラウザの動きやアニメーションに必要な言語です。
ここら辺も詳しくなっておくとAI駆動開発では有利になると思うので、ぜひこちらも参考にしてみてください。

## ひとつだけつまずいた話

`manifest.json` の `manifest_version` を最初 `2` にしてたんですよ。古い記事を参考にしてたせいで。動かなくて「なんで？」ってなりました。

今は `3` が正解です。ちょっと前の記事だとまだ `2` で書いてあるものも多いので、もし動かなかったらそこを疑ってみてください。

## おわりに

「拡張機能って難しそう」と思ってたんですが、ふたを開けてみたら HTML と JavaScript が少し書ければ全然いける話でした。

完成したのはすごく地味なツールだけど、**自分の「面倒くさい」を自分で解決できた**という感覚が気持ちよかったです。これがたぶん、AI駆動で何かを作ることの面白さの入口なんだと思います。

もし「こんな機能があったら便利なのに」って思うものがあれば、ぜひ一度試してみてください。思ってるより全然難しくないです。

