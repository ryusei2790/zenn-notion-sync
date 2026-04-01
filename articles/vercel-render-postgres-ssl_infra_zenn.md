---
title: "【保存版】Vercel + Render PostgreSQL で500エラーが出たら？"
emoji: "🔐"
type: "tech"
topics: ["next.js", "sql"]
published: true
---

## この記事でわかること

- Vercel（外部）から Render の PostgreSQL に接続するときに必要な設定
- `DATABASE_URL` に `?sslmode=require` を付けないと何が起きるか
- 500エラーの原因を Vercel のログから特定する方法
- 同じ構成（Vercel + Render DB）を使うときの注意点
---

## 環境

- フロントエンド・API：Next.js（App Router）→ Vercel にデプロイ
- データベース：PostgreSQL → Render にデプロイ
- ORM：Prisma 7（Driver Adapter 方式）
---

## 何が起きたか

新規登録フォームを送信すると、ブラウザのコンソールに以下のエラーが表示されました。

```javascript
api/auth/signup:1  Failed to load resource: the server responded with a status of 500 ()
```

ローカル環境では正常に動作していたため、デプロイ固有の問題だと判断しました。

---

## 原因：`?sslmode=require` の欠如

Vercel の Environment Variables に設定していた `DATABASE_URL` はこれでした。

```javascript
postgresql://user:password@dpg-xxxxxxx.ohio-postgres.render.com/mydb
```

一見問題なさそうに見えますが、**Render の PostgreSQL に外部（Vercel など）から接続する場合は SSL が必須**です。

SSL 設定なしで接続しようとすると、Prisma がエラーを投げてサーバーが 500 を返します。

---

## 解決策：URLの末尾に `?sslmode=require` を追加する

```javascript
postgresql://user:password@dpg-xxxxxxx.ohio-postgres.render.com/mydb?sslmode=require
```

`/データベース名` の後ろに `?sslmode=require` を追加するだけです。

Vercel のダッシュボードで Environment Variables を更新し、再デプロイすれば解決します。

---

## なぜこれが必要なのか

PostgreSQL への接続には **SSL（暗号化通信）** を使うかどうかを指定できます。

ローカル環境では同一マシン内で通信するため SSL なしでも動きます。しかし Vercel から Render への通信は**インターネットを経由する外部通信**なので、Render 側が SSL 接続を要求します。

この設定が抜けていると、接続時にエラーが発生して Prisma Client の初期化に失敗し、API が 500 を返します。

---

## エラーの根本：Prisma Client の初期化失敗

今回のプロジェクトでは Prisma 7 の Driver Adapter 方式を使っており、`db.ts` は以下のような実装でした。

```typescript
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL が環境変数に設定されていません");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}
```

`DATABASE_URL` は設定されていたので `throw` はされません。しかし `new PrismaPg({ connectionString })` の接続確立時に SSL エラーが発生し、リクエスト処理中に例外が投げられて 500 になっていました。

---

## 500エラーの原因を特定する方法

500 エラーが出た場合、まず **Vercel のログ**を確認するのが最短ルートです。

1. Vercel ダッシュボード → プロジェクトを選択
1. 「Logs」タブを開く
1. エラーが発生した時刻のログを確認
ログには Prisma や Node.js が投げた例外メッセージが表示されます。今回のケースであれば SSL に関するエラーメッセージが出ていたはずです。

---

## まとめ

- Vercel から Render の PostgreSQL に接続するときは `?sslmode=require` が必要
- `DATABASE_URL` の末尾（`/データベース名` の後）に追加するだけで解決する
- ローカルでは動くのに本番で 500 が出る場合、Vercel のログで原因を特定できる
- 同じ構成（Vercel + Render DB）を使う場合は最初から `?sslmode=require` を付けておく
---

## 📺 YouTube でも解説しています

この記事の内容を動画でも解説しています。手を動かしながら学びたい方はこちらもどうぞ！

👉 [ryuseiUeda のYouTubeチャンネル](http://www.youtube.com/@ryuseiUeda-0106)

---

## 📲 SNS でもつながりましょう

最新情報や学習の進捗はSNSで発信しています。

- 📸 Instagram: [@obako_illustrate](https://www.instagram.com/obako_illustrate/?hl=ja)
- 💬 LINE公式: [LINE登録はこちら](https://line.me/R/ti/p/@202qpxlu)
---

