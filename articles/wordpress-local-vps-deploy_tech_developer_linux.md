---
title: "【保存版】WordPressをローカルからVPSへ3ステップでデプロイする方法"
emoji: "🚀"
type: "tech"
topics: ["ローカル開発"]
published: false
---

「scpで送ればいいだけでしょ？」と思っていた時期が、私にもありました。

実際にやってみると権限エラーで弾かれ、そもそもVPS上のWordPressの場所もわからなくなり、気がついたら全然別のサーバーに入っていた……という状態を経験しました。

同じところで詰まっている方のために、私なりに整理した手順をまとめてみます。

## まず知っておきたいWordPressの3要素

デプロイを理解する前提として、WordPressが何でできているかを押さえておきます。

今回 `scp` で転送するのは `**wp-content**`** の中身だけ**です。記事やサイト設定はデータベースに入っているため、ファイル転送だけでは移行されません。

## STEP 1：VPS上のWordPressの場所を特定する

VPSにSSHで入っても「どこにWordPressが入っているかわからない」ことは珍しくありません。そういうときはこのコマンド一発で見つけられます。

```bash
sudo find / -name wp-config.php 2>/dev/null
```

出力例：

```javascript
/var/www/html/wp-config.php
```

`wp-config.php` があるディレクトリがWordPressのルートです。

## STEP 2：なぜ直接書き込めないのかを理解する

VPS上には3種類のユーザーが存在しています。

`/var/www/html` は `root` 所有のため、`ubuntu` ユーザーでは書き込みができません。セキュリティのための意図的な設計です。

## STEP 3：3ステップで安全にデプロイする

「いったんホームに置いてから移動する」パターンが一番シンプルです。

### ① ローカルからVPSのホームへ転送

```bash
scp -r <theme-folder> <user>@<server>:~
```

### ② 届いているか確認

```bash
ls ~
```

### ③ 本番ディレクトリへ移動して権限を整える

```bash
sudo mv ~/<theme-folder> /var/www/html/wp-content/themes/
sudo chown -R www-data:www-data /var/www/html/wp-content/themes/<theme-folder>
```

WordPressの管理画面からテーマを有効化できれば完了です。

## デプロイ日時を確認する方法

```bash
ls -lt /var/www/html/wp-content/themes
# または
stat <folder-name>
```

## まとめ

- WordPressは「コア・コンテンツ・DB」の3要素
- `find / -name wp-config.php` でWordPressの場所を特定できる
- `/var/www/html` は `root` 所有のため `ubuntu` では直接書き込めない
- 「`~/` に `scp` → `sudo mv` → `chown`」が安全なデプロイ手順
「なぜ入れないのか」がわかると、エラーが出たときに慌てなくて済みます。コマンドの意味を理解した上で手を動かせるようになると、サーバー周りの作業がぐっと楽になると思います。

