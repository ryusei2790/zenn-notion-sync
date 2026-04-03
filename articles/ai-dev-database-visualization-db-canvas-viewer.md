---
title: "AIにコードは書かせられる。でもデータベースが見えないと詰む話【db-canvas-viewer】"
emoji: "🗄"
type: "idea"
topics: ["sql", "ローカル開発"]
published: true
---

## この記事でわかること

- AI駆動開発でDBが見えないと何が詰むのかが具体的にわかる
- TypeScript製CLIツール「db-canvas-viewer」の3つのビューと使い方がわかる
- SQLを書かずにER図・テーブルデータ・FK関係を一画面で把握する方法がわかる
- `docker compose up` 1コマンドで動く環境のセットアップ手順がわかる
---

## AIにコードは書かせられる。でもDBが見えないと詰む

AI駆動開発が普及して、「コードを書く」ハードルはかなり下がりました。

ChatGPTやClaude Codeに「このエンドポイントを実装して」と伝えれば、それなりに動くコードが出てきます。でも現場で実際にAIとコードを書き続けていて気づいたことがあります。

**AIへの指示の質は、DB構造をどれだけ把握しているかで決まる。**

```javascript
❌ 曖昧な指示（詰む）
「ユーザーの注文履歴を取得するAPIを作って」

✅ 具体的な指示（通る）
「usersテーブルのidとordersテーブルのuser_idがFKで繋がってる。
 ordersに紐づくorder_itemsも一緒に取得してほしい」
```

前者でAIが返してくるコードは大体テーブル名や列名が間違っていたり、JOINの向きが逆だったりします。後者なら一発で動くコードが出てきます。

**つまりDB構造が頭に入っていないと、AIを使いこなせない。**

でもSQLでスキーマを確認するのは初心者には辛いですし、慣れた人でも `SHOW TABLES`、`DESCRIBE テーブル名`、`SELECT * FROM` を繰り返すのは手間です。

この課題を解決するために作ったのが **db-canvas-viewer** です。

---

## db-canvas-viewerとは？

`db-canvas-viewer` は、PostgreSQLのデータベース構造を**SQL不要・1コマンドで視覚化するTypeScript製のCLIツール**です。

実行すると3種類のHTMLファイルが自動生成されます。

ブラウザで開くだけで、DBの全体像をひと目で把握できます。

---

## 3つのビューを解説

### ① キャンバスビュー（report.html）

全テーブルが1画面に並んで表示され、外部キー（FK）でつながっているカラム同士がSVGのベジェ曲線で結ばれます。

```javascript
┌──users──────┐      ┌──orders──────┐
│ id   │ name │──┐   │ id │ user_id │
│  1   │Alice │  └──►│  1 │    1    │
│  2   │ Bob  │      │  2 │    1    │
└─────────────┘      └─────────────┘
                             │
                      ┌──order_items──┐
                      │ id │ order_id │
                      │  1 │    1     │
                      └──────────────┘
```

テーブルはFKの依存関係に基づいてトポロジカルソートで自動配置されます。親テーブルが上、子テーブルが下に来るため、関係を直感的に追えます。

マウスのドラッグでパン、ホイールでズームが可能です。

### ② テーブルビューアー（viewer.html）

左パネルにER図、右パネルに選択したテーブルのデータをスプレッドシート形式で表示します。

- ER図のノードをクリックすると右パネルのデータが切り替わる
- フィルタリング・ソートに対応したTabulatorを使用
- CSVエクスポートボタンで全データをダウンロード可能
「あのテーブル何が入ってたっけ？」というときに一瞬で確認できます。

### ③ スキーマ概観（schema.html）

各テーブルのカラム一覧（🔑PK・🔗FK・通常カラムを色分け）をER図として全画面表示します。データは表示せず、スキーマ構造だけを一目で把握するためのビューです。

AIに渡す「DBの説明文」を作るときにこの画面を見ながら書くと、漏れがなくなります。

---

## セットアップ手順

### 前提条件

- Docker / Docker Compose がインストール済み
- Node.js 18以上
### インストールと実行

```bash
git clone https://github.com/ryuseiueda/database-to-csv.git
cd database-to-csv
npm install
```

`.env` ファイルを作成します。

```javascript
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

テスト用のDBをDockerで起動します。

```bash
docker compose up -d
```

ツールを実行します。

```bash
npm run generate
```

`output/` フォルダにHTMLが生成されます。ブラウザで開くだけで完成です。

```bash
open output/report.html
```

---

## 開発中に詰まった3つのポイント

実装で特にハマった部分を残しておきます。

### ① vis-networkのfit()タイミング問題

`physics: false` で階層レイアウトを使うと `stabilizationIterationsDone` イベントが発火しません。そのためネットワーク全体を画面に収める `fit()` が一度も呼ばれず、ノードが画面外に配置されたまま真っ白に見えました。

```typescript
// ❌ 発火しない
network.once("stabilizationIterationsDone", () => network.fit());

// ✅ こちらを使う
network.once("afterDrawing", function () {
  requestAnimationFrame(function () {
    network.fit({ animation: false });
  });
});
```

### ② Flexコンテナの高さ問題

`flex: 1` を設定してもER図パネルの高さが0になる問題がありました。

```css
/* ✅ min-height: 0 が必要 */
#er-diagram {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
```

Flexアイテムは `min-height` のデフォルトが `auto` なので、コンテンツの高さ以下には縮まらないのが原因です。

### ③ FKの依存関係によるテーブル配置

単純なグリッド配置だと関係のないテーブル同士がFK矢印で交差してしまいます。FK依存関係を元にトポロジカルソートで階層を算出し、親テーブルを上段・子テーブルを下段に配置することで解決しました。

```javascript
function computeLevels() {
  const deps = {};
  TABLE_DATA.forEach(t => deps[t.name] = []);
  FOREIGN_KEYS.forEach(fk => {
    if (deps[fk.fromTable]) deps[fk.fromTable].push(fk.toTable);
  });
  const levels = {};
  const visiting = {};
  function getLevel(name) {
    if (name in levels) return levels[name];
    if (visiting[name]) { levels[name] = 0; return 0; }
    visiting[name] = true;
    const deps_list = deps[name] || [];
    const maxDep = deps_list.reduce((m, dep) => Math.max(m, getLevel(dep)), -1);
    levels[name] = maxDep + 1;
    delete visiting[name];
    return levels[name];
  }
  TABLE_DATA.forEach(t => getLevel(t.name));
  return levels;
}
```

---

## まとめ

- AI駆動開発でコード生成の質を上げるには、DB構造の把握が欠かせない
- `db-canvas-viewer` はSQL不要でER図・テーブルデータ・FK関係を視覚化するCLIツール
- 3つのビュー（キャンバス・テーブルビューアー・スキーマ）で用途に応じて確認できる
- `docker compose up` + `npm run generate` だけで動く環境を用意している
- vis-networkのfit()問題・Flexの高さ問題・FK依存配置が実装の主なハマりポイント
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

