---
title: "WordPressテーマのデプロイでハマった話｜scp失敗→rsync移行で完全解決した手順まとめ"
emoji: "🚀"
type: "tech"
topics: ["ローカル開発"]
published: true
---

## この記事でわかること

- `Permission denied` エラーの本当の原因（Gitは壊れていない）
- scpがデプロイに向いていない理由
- rsyncで `.git` を除外して安全にデプロイする具体的なコマンド
- 「転送は成功してるのに反映されない」問題の対処法
---

## はじめに

WordPressテーマをローカルで編集して本番サーバーにアップしようとしたら、こんなエラーが大量に出てきた経験はありませんか？

```bash
scp: dest open ".../.git/objects/..." Permission denied
scp: failed to upload directory ...
```

「Gitが壊れた？コマンドが間違ってる？サーバーの設定がおかしい？」と焦りますよね。

この記事では、**実際にハマった失敗の原因と、rsyncを使って完全に解決した手順**をまるごと解説します。

---

## そもそも何が起きていたのか？ エラーの原因を解剖する

### scpで `.git` ごとアップしようとしていた

最初に使っていたコマンドはこれです。

```bash
scp -P 2222 -r "/path/to/local/themes/my-theme" \
user@ssh.example.com:/path/to/server/wp-content/themes/
```

一見問題なさそうに見えますが、**テーマフォルダを丸ごと **`**-r**`**（再帰）でコピーしているため、**`**.git**`** フォルダも一緒に送ろうとしていた**のが問題でした。

### サーバー側が `.git` への書き込みを拒否していた

エラーを分解するとこうなります。

```javascript
scp: dest open ".../.git/objects/61/75ccd4..." Permission denied
```

- `.git/objects/` にファイルを書き込もうとした
- **サーバー側でそのディレクトリへの書き込み権限がない**
- 転送失敗
**結論：Gitが壊れているわけでも、コマンドが間違っているわけでもない。**`**.git**`** を送ろうとして権限で弾かれているだけ。**

### なぜ本番サーバーに `.git` を置いてはいけないのか

---

## 中途半端な状態が一番危険

scpが途中で失敗した場合、サーバー上はこんな状態になっています。

- テーマフォルダ自体は存在する
- でも中身のファイルが**欠けている**（一部だけアップ済み）
この状態でWordPressを動かすと、テンプレートの読み込みエラーやレイアウト崩れが起きる可能性があります。

### まず確認すること（SSH接続後）

```bash
cd /path/to/server/wp-content/themes/my-theme
ls -l
```

更新時刻を見て、ファイルが揃っているか確認しましょう。

---

## 解決策：rsyncで `.git` を除外してデプロイする

### rsyncとは？ scpとの違い

一言でいうと、**rsyncはscpの上位互換**です。デプロイ用途ではrsync一択と覚えておきましょう。

### 実際に使ったrsyncコマンド

ポート2222のSSHサーバー（ロリポップなど）に対応したコマンドはこちらです。

```bash
rsync -av -e "ssh -p 2222" --exclude='.git' \
"/path/to/local/themes/my-theme/" \
user@ssh.example.com:/path/to/server/wp-content/themes/my-theme/
```

### オプションの解説

### ⚠️ 末尾の `/` に要注意

```bash
# ✅ 正しい（中身だけコピー）
rsync ... /local/my-theme/  user@server:/remote/my-theme/

# ❌ 間違い（フォルダごとコピーで階層がズレる）
rsync ... /local/my-theme   user@server:/remote/my-theme/
```

スラッシュを忘れると `themes/my-theme/my-theme/` のように1階層ズレてWordPressがテーマを認識しなくなります。

### ローカルと完全同期したい場合

```bash
rsync -av --delete -e "ssh -p 2222" --exclude='.git' \
"/path/to/local/themes/my-theme/" \
user@ssh.example.com:/path/to/server/wp-content/themes/my-theme/
```

`--delete` をつけると、ローカルに存在しないファイルはサーバーからも削除されます。ローカルが「正」の状態を保ちたいときに有効です。

---

## 安全にやり直す手順（ステップバイステップ）

scpで中途半端になってしまった場合は、一度削除してからrsyncし直すのが最も安全です。

### STEP 1：サーバーの壊れたフォルダを削除

```bash
ssh -p 2222 user@ssh.example.com
rm -rf /path/to/server/wp-content/themes/my-theme
```

### STEP 2：rsyncで再アップ

```bash
rsync -av -e "ssh -p 2222" --exclude='.git' \
"/path/to/local/themes/my-theme/" \
user@ssh.example.com:/path/to/server/wp-content/themes/my-theme/
```

### STEP 3：ブラウザで確認

rsyncが成功していても見た目が変わっていない場合は、キャッシュが原因の可能性があります。

---

## 「rsyncは成功してるのに変更が反映されない」問題

転送が成功しているのに画面が変わらない原因はほぼ4パターンに絞られます。

### 原因① ブラウザキャッシュ（一番多い）

```javascript
Cmd + Shift + R（Mac）
Ctrl + Shift + R（Windows）
```

**シークレットモードで確認**するのが最も手っ取り早いです。

### 原因② WordPressのキャッシュプラグイン

WP Super CacheやW3 Total Cacheなどを使っている場合、管理画面からキャッシュをクリアしないと古いページが表示され続けます。

### 原因③ テンプレートファイルが違う

WordPressはテンプレート階層に従ってファイルを読み込みます。編集した `front-page.php` が使われていない場合、実際には `index.php` や `page.php` が使われているかもしれません。

### 原因④ 転送先のパスがズレている

```bash
# サーバー側でファイルの更新日時を確認
ls -l /path/to/server/wp-content/themes/my-theme/
```

ファイルの更新日時を見て、最新のファイルがアップされているか確認しましょう。

---

## よくある質問（FAQ）

**Q. scpとrsyncはどちらを使えばいい？**

デプロイ用途ではrsync一択です。scpは単純なファイルコピーには便利ですが、除外指定が弱く差分転送もできません。

**Q. **`**.git**`** フォルダを本番に置いてもいい？**

NGです。セキュリティリスク・容量の無駄・権限トラブルの3点から、本番サーバーには `.git` を置くべきではありません。

**Q. **`**--delete**`** オプションは使った方がいい？**

ローカルとサーバーを完全に同期したい場合に有効です。ただしサーバー側にだけあるファイルが削除されてしまうため、初回は `--delete` なしで試してから判断するのが安全です。

**Q. もっと楽にデプロイする方法はある？**

あります。`git pull` を使ったデプロイ構成にすると、サーバー側でコマンド1つ打つだけで最新状態に更新できます。GitHub ActionsやDeployHQなどを使った自動デプロイも選択肢です。

---

## まとめ

- `Permission denied` エラーはGitの破損ではなく、`**.git**`** フォルダをscpで送ろうとしたことが原因**
- 本番サーバーに `.git` を置くのはセキュリティ・権限・容量の観点からNG
- **rsync に **`**--exclude='.git'**`** をつけるのがデプロイのベストプラクティス**
- 末尾の `/` を忘れると階層がズレるので必ず確認する
- 「転送は成功なのに反映されない」はほぼ**キャッシュの問題**（強制リロードで解決）
- 次のステップとして `git pull` デプロイや自動化も検討しよう
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

