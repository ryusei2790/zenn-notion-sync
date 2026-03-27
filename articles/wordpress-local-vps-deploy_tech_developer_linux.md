---
title: "【保存版】WordPressをローカルからVPSへ3ステップでデプロイする方法"
emoji: "🚀"
type: "tech"
topics: ["ローカル開発"]
published: true
---

## はじめに

「ローカルで作ったWordPressのテーマ、サーバーにどうやって反映するんだろう？」

最初にVPSへのデプロイに取り組んだとき、私もそんな疑問を抱えていました。`scp`コマンドを叩いても権限エラーが出たり、ファイルを置く場所を間違えてサイトに何も反映されなかったり……。試行錯誤しながら、ようやくひとつの流れとして理解できてきたので、私なりに整理してみました。

この記事では、**WordPressの基本構造の理解からVPSへのファイル転送・権限設定まで**、実際に手を動かして学んだことをまとめています。

---

## 1. WordPressの基本構造を理解する

WordPressは大きく3つの要素で構成されています。

### ① コアファイル（基本的に触らない）

```javascript
wp-admin/
wp-includes/
```

### ② コンテンツ領域（開発対象）

```javascript
wp-content/
  ├── themes/
  ├── plugins/
  └── uploads/
```

### ③ データベース

投稿・設定・ユーザー情報が保存される場所。ファイル転送だけでは移行されない。

---

## 2. 環境構成を把握する

---

## 3. WordPress設置場所の特定

```bash
sudo find / -name wp-config.php 2>/dev/null
```

---

## 4. Linux権限の仕組み

```javascript
root       → 管理者
ubuntu     → 作業ユーザー
www-data   → Webサーバー実行ユーザー
```

`/var/www/html` はroot所有のため、ubuntuでは直接書き込み不可。**ホームディレクトリ経由で転送**するのが解決策です。

---

## 5. ファイル転送（scp）

```bash
scp -r <theme-folder> <user>@<server>:~

sudo mv ~/<theme-folder> /var/www/html/wp-content/themes/
sudo chown -R www-data:www-data /var/www/html/wp-content/themes/<theme-folder>
```

---

## 6. 最重要理解

```javascript
/var/www/html = 公開される場所
/home/ubuntu  = 作業する場所
```

Webに表示されるのは `/var/www/html` 以下のファイルだけです。

---

## まとめ

- WordPress構造の理解（コア・コンテンツ・DB）
- Linux権限の基本（ubuntu / www-data / root）
- scpによるデプロイとchownによる権限調整
- 公開領域と作業領域の区別
次のステップはGitによるデプロイ自動化とデータベース移行に挑戦予定です。

