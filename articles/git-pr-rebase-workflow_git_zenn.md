---
title: "【保存版】現場で使えるGit PRの送り方：rebaseでコンフリクトを防ぐ手順"
emoji: "🔀"
type: "tech"
topics: ["blog", "task"]
published: true
---

## この記事でわかること

- `git rebase` と `git merge` の違いと使い分け
- mainの最新をdevに取り込んでからPRを送るまでの手順
- rebase後に必要な `--force-with-lease` の意味と使い方
- `non-fast-forward` エラーの原因と解消方法
- コンフリクトを起こさないための実践的なコツ
## 前提知識・環境

- Gitの基本操作（commit / push / pull）がわかる方
- GitHubでPull Requestを作成する流れを知りたい方
## PRを送る前になぜmainを取り込む必要があるのか

チーム開発では、自分が作業しているあいだにmainブランチが更新されることがよくあります。

その状態でそのままPRを送ると、mainとの差分が大きくなり、コンフリクトが発生しやすくなります。

PRを送る直前にmainの最新を自分のブランチに取り込むことで、コンフリクトを事前に解消し、レビュワーの負担も下げられます。

## rebase と merge の違い

`git merge main` と `git rebase main` はどちらも「mainの変更を取り込む」操作ですが、履歴の形が変わります。

### merge の場合

```javascript
main:  A --- B --- C
                    \
dev:   A --- B --- X --- Y --- M  ← マージコミットが生成される
```

マージコミット（M）が追加され、履歴が枝分かれします。

### rebase の場合

```javascript
main:  A --- B --- C
                    \
dev:                C --- X' --- Y'  ← 一直線になる
```

devのコミット（X, Y）をmainの最新（C）の上に積み直します。履歴が一直線になるので読みやすくなります。

## 実際の手順：mainを取り込んでPRを送るまで

### 1. mainの最新を取得する

```bash
git checkout main
git pull origin main
```

### 2. devに戻してrebaseする

```bash
git checkout dev
git rebase main
```

### 3. コンフリクトが出た場合

コンフリクトしたファイルをエディタで手動修正した後、以下を実行します。

```bash
git add .
git rebase --continue
```

中断したい場合は `git rebase --abort` で元の状態に戻せます。

### 4. devをプッシュする

rebaseで履歴を書き換えているため、すでにリモートにpushしている場合は通常のpushが弾かれます。

```bash
git push origin dev --force-with-lease
```

`--force-with-lease` は、他の人が同じブランチにpushしていた場合は強制プッシュを中断してくれる安全なオプションです。単純な `--force` より必ずこちらを使いましょう。

### 5. GitHubでPRを作成する

`dev → main` のPRをGitHub上で作成して送ります。

## non-fast-forward エラーが出たときの対処

rebase後にpushすると以下のエラーが出ることがあります。

```javascript
! [rejected] dev -> dev (non-fast-forward)
error: failed to push some refs
```

**原因：** rebaseで履歴を書き換えたため、リモートの `dev` と食い違いが生じています。

**解決策：**

```bash
git push origin dev --force-with-lease
```

## コンフリクトを起こさないための3つのコツ

- **PRを出す直前に必ずmainを取り込む** — 時間が経つほど差分が大きくなる
- **1つのPRを小さく保つ** — 変更ファイルが少ないほどコンフリクトしにくい
- **長期間mainから乖離させない** — 定期的にrebaseする習慣をつける
## まとめ

- PRを送る前は `git rebase main` でmainの最新を取り込む
- rebaseはマージコミットを生成せず、履歴が一直線になる
- rebase後のpushは `--force-with-lease` を使う
- `non-fast-forward` エラーはrebaseによる履歴の書き換えが原因
- コンフリクトを防ぐには、小さいPR・こまめなrebaseが効果的
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

