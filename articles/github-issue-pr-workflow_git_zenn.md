---
title: "【保存版】GitHub IssueとPRを連携させる開発フローを完全解説"
emoji: "🔗"
type: "tech"
topics: ["blog"]
published: true
---

## この記事でわかること

- GitHub Issueの役割と基本的な使い方
- CLIとGUI、それぞれでIssueを作成する方法
- IssueとPRを連携させて自動クローズさせる方法
- `gh issue develop` でブランチを自動生成する方法
- 1 Issue = 1 PR の基本的な開発フローの全体像
---

## GitHub Issueとは

GitHub Issueとは、バグ報告・機能改劄・TODO・質問などを「チケット」として登録・追跡できる機能です。

コードの変更履歴はgitで管理できますが、**「なぜその変更をしたか」の文脈はIssueで管理します**。

---

## Issueの基本的な書き方

Issueに書くべき内容は以下の通りです。

粒度の目安は **「1つの改善 = 1つのIssue」** です。

```javascript
◯ ヘッダーの背景色が被って見づらい
◯ 全体的な余白が大きすぎる
✗ デザイン周りを全部改善する（大きすぎる）
```

---

## Issueに使うラベル

GitHubにはデフォルトでラベルが用意されています。

デザイン改善なら `enhancement`、バグなら `bug` を使います。

---

## IssueをCLIで作成する（ghコマンド）

`gh` コマンドを使えばターミナルから直接Issueを作成できます。

```bash
gh issue create \
  --title "ヘッダーの背景色が被って視認性が低い" \
  --body "## 概要
ヘッダーの背景色と他の要素の色がかぶっていて見づらい。

## 改善案
- ヘッダーに背景色を設定して要素と分離する
- または背景を透過させてデザインを整理する" \
  --label "enhancement"
```

一覧確認も簡単です。

```bash
gh issue list
```

---

## IssueをGitHub GUIで作成する

1. リポジトリの **Issues** タブを開く
1. **New issue** ボタンをクリック
1. タイトルと本文を入力
1. 右サイドバーの **Labels** から `enhancement` などを選択
1. **Submit new issue** で作成
---

## Issue → 実装 → 自動クローズの流れ

IssueとPRを連携させると、PRがマージされた瞬間にIssueが自動クローズされます。

全体の流れは以下の通りです。

```javascript
Issue作成 → ブランチ作成 → 実装 → PR作成 → マージ → Issueが自動クローズ
```

### ステップ1：Issueを作成する

```bash
gh issue create --title "ヘッダーの背景色が被って見づらい" --label "enhancement"
# → Issue #1 が作られる
```

### ステップ2：Issue専用のブランチを作る

**手動で作る場合：**

```bash
git checkout -b fix/issue-1-header-background
```

ブランチ名にIssue番号を入れるのが慣習です。

**ghコマンドで自動生成する場合（おすすめ）：**

```bash
gh issue develop 1 --checkout
```

これを実行すると `1-ヘッダーの背景色が被って見づらい` のようなブランチが自動生成されてチェックアウトまで完了します。

### ステップ3：実装してコミット

```bash
git add .
git commit -m "fix: ヘッダーに背景色を追加して視認性を改善"
```

### ステップ4：PRを作成するときに `Closes #番号` を書く

```bash
gh pr create \
  --title "ヘッダーの背景色修正" \
  --body "## 変更内容
- ヘッダーに背景色を追加

Closes #1"
```

`**Closes #1**`** を書くことがポイントです。** これがPR本文に含まれていると、PRがmainにマージされた瞬間にIssue #1が自動で閉じられます。

`Closes` 以外にも以下のキーワードが使えます。

---

## まとめ

- GitHub Issueはバグ・改善・TODOを「チケット」として管理する機能
- `enhancement`（改善）・`bug`（不具合）などのラベルで種類を分類できる
- CLIは `gh issue create`、GUIはIssuesタブの「New issue」から作成できる
- PR本文に `Closes #番号` を書くと、マージ時にIssueが自動クローズされる
- `gh issue develop 番号 --checkout` でIssueに紐づいたブランチを自動生成できる
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

