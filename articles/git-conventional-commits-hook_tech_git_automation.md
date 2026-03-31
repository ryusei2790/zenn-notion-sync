---
title: "【保存版】Git commit-msg フックで Conventional Commits を自動強制する方法"
emoji: "🪝"
type: "tech"
topics: ["blog"]
published: true
---

## この記事でわかること

- `commit-msg` フックの仕組みと動作原理
- Conventional Commits 形式のバリデーション方法（`grep -E` による正規表現マッチング）
- `~/.gitconfig` の `includeIf` を使って**特定ディレクトリ配下のみ**にフックを適用する方法
- セットアップ手順を5ステップで完全再現できる
---

## なぜ commit-msg フックで強制するのか

コミットメッセージのフォーマットを統一する方法はいくつかあります。

- CI でコミットメッセージを検証する
- コミットツール（commitizen など）を使う
- **ローカルの Git フックで即時ブロックする**
CI による検証はプッシュ後に気づくため、修正のコストが高くなります。ローカルフックなら `git commit` の瞬間にエラーが返るため、即時フィードバックが得られます。

また、今回は**プロジェクト単位ではなくディレクトリ単位**（`~/Mywork/` 配下）でフックを適用したいケースを想定しています。各リポジトリに `.githooks/` を置く方式ではなく、グローバルな `includeIf` を使うのがポイントです。

---

## アーキテクチャ全体像

```javascript
git commit -m "..."  
    ↓  
commit-msg hook（~/.githooks/commit-msg）  
    ↓  
  マッチ OK → ✅ コミット成功  
  マッチ NG → ❌ エラー表示 & abort  

~/.gitconfig  
    └─ includeIf "gitdir/i:~/Mywork/"  
           └─ ~/.gitconfig-mywork  
                  └─ core.hooksPath = ~/.githooks  
```

`~/.gitconfig` の `includeIf` で `~/Mywork/` 配下のリポジトリにのみ `~/.gitconfig-mywork` を読み込ませ、`hooksPath` を `~/.githooks` に向けることで、フックを限定適用しています。

---

## セットアップ手順（5ステップ）

### Step 1: フックディレクトリを作成する

```bash
mkdir -p ~/.githooks
```

### Step 2: commit-msg スクリプトを作成する

```bash
cat > ~/.githooks/commit-msg << 'EOF'
#!/bin/sh
MSG=$(cat "$1")
if ! echo "$MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore): .+"; then
  echo "エラー: コミットメッセージの形式が正しくありません"
  echo "形式: feat|fix|docs|style|refactor|test|chore: 説明"
  echo "例: feat: ログイン機能を追加"
  exit 1
fi
EOF
```

**スクリプトの解説：**

### Step 3: 実行権限を付与する

```bash
chmod +x ~/.githooks/commit-msg
```

シェルスクリプトは実行権限がないと動きません。忘れがちなステップです。

### Step 4: `~/.gitconfig` に `includeIf` を追加する

```bash
git config --global includeIf."gitdir/i:~/Mywork/".path ~/.gitconfig-mywork
```

`gitdir/i:` の `i` は大文字・小文字を区別しない（case-insensitive）フラグです。macOS のファイルシステムはデフォルトで大文字小文字を区別しないため、`i` を付けておくと安全です。

### Step 5: Mywork 用の gitconfig を作成する

```bash
cat > ~/.gitconfig-mywork << 'EOF'
[core]
    hooksPath = ~/.githooks
EOF
```

`hooksPath` を指定することで、Git が参照するフックディレクトリをデフォルト（`.git/hooks/`）から `~/.githooks/` に変更できます。

---

## 動作確認

セットアップ後、`~/Mywork/` 配下の任意のリポジトリで動作を確認します。

```bash
cd ~/Mywork/<your-repo>

# hooksPath が設定されているか確認
git config core.hooksPath
# → ~/.githooks と表示されれば成功

# NG 例（エラーになるはず）
git commit --allow-empty -m "テスト"
# → エラー: コミットメッセージの形式が正しくありません

# OK 例（通るはず）
git commit --allow-empty -m "feat: テストコミット"
# → [main xxxx] feat: テストコミット
```

---

## 使用可能な type 一覧

---

## includeIf を使う際の注意点

**パスの末尾スラッシュを忘れない**

```plain text
# 正しい（末尾に / がある）
[includeIf "gitdir/i:~/Mywork/"]

# 動かない（末尾に / がない）
[includeIf "gitdir/i:~/Mywork"]
```

`gitdir/i:` の末尾に `/` がないとサブディレクトリにマッチしません。

`**~/Mywork/**`** 以外のリポジトリには適用されない**

グローバルな `~/.gitconfig` の `hooksPath` は変更していないため、`~/Mywork/` 以外のリポジトリでは通常の `.git/hooks/` が使われます。個人プロジェクトだけに強制したい場合に有効な構成です。

---

## まとめ

- `commit-msg` フックと `grep -E` でコミットメッセージをローカルで即時バリデーションできる
- `~/.gitconfig` の `includeIf "gitdir/i:"` で特定ディレクトリ配下のみにフックを限定適用できる
- `hooksPath` を `~/.githooks` に向けることでリポジトリをまたいでフックを共有できる
- セットアップは5ステップで完了し、macOS / Linux どちらでも動作する
- `includeIf` のパス末尾の `/` を忘れないことが唯一のハマりポイント
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

