---
title: "【完全版】NotionからZennへの自動投稿システム構築手順書"
emoji: "📚"
type: "tech"
topics: []
published: true
---

## この手順書について

Notionで記事を書いて、ステータスを「完了」にするだけで自動的にZennに投稿されるシステムを構築します。

**所要時間:** 約60分

**難易度:** 中級（コマンドライン操作の基本知識が必要）

## 完成イメージ

`① Notionで記事を書く
② ステータスを「完了」に変更
③ 自動的にZennに投稿される ✨`

### このシステムでできること

- ✅ Notionのデータベースで記事を管理
- ✅ ステータス変更だけで自動投稿
- ✅ GitHub Actionsで定期的に同期（毎日3回）
- ✅ 手動での即時同期も可能
- ✅ 記事の下書き・公開管理が簡単
## 事前準備チェックリスト

以下を用意してください：

---

# STEP 1: Notionのセットアップ（15分）

## 1-1. Notionデータベースの作成

### 手順

1. **Notionを開く**
ブラウザで [Notion](https://www.notion.so/) を開いてログイン
1. **新しいページを作成**
  - 左サイドバーで「ページを追加」または「+」をクリック
  - ページタイトルに「Zenn記事管理」と入力
1. **テーブルデータベースを作成**
  - ページ内で `/table` と入力
  - 「Table - Full page」を選択
  - 表示されたテーブルがデータベースです
### 完了確認

---

## 1-2. データベースプロパティの設定

テーブルの列（プロパティ）を設定します。

### デフォルトで存在するプロパティ

- **名前** (Title型) → このまま使用（記事タイトル用）
### 追加するプロパティ

以下を順番に追加してください。列の右端「+」ボタンから追加できます。

### ① ステータス（Status）

1. 列の「+」ボタンをクリック
1. プロパティ名: `ステータス`
1. タイプ: **Status**
1. ステータス項目を設定:
  - 未着手（グレー）
  - 進行中（ブルー）
  - 完了（グリーン）
### ② Zenn投稿済み（Checkbox）

1. 「+」ボタンをクリック
1. プロパティ名: `Zenn投稿済み`
1. タイプ: **Checkbox**
### ③ Zennスラッグ（Text）

1. 「+」ボタンをクリック
1. プロパティ名: `Zennスラッグ`
1. タイプ: **Text**
1. ℹ️ スラッグとは: 記事のURL部分（例: `my-first-article`）
### ④ Zenn絵文字（Text）

1. 「+」ボタンをクリック
1. プロパティ名: `Zenn絵文字`
1. タイプ: **Text**
### ⑤ Zennタイプ（Select）

1. 「+」ボタンをクリック
1. プロパティ名: `Zennタイプ`
1. タイプ: **Select**
1. オプションを追加:
  - `tech`（技術記事）
  - `idea`（アイデア記事）
### ⑥ Zennトピック（Multi-select）

1. 「+」ボタンをクリック
1. プロパティ名: `Zennトピック`
1. タイプ: **Multi-select**
1. ℹ️ 記事のタグを複数選択できます
### ⑦ Zenn公開（Checkbox）

1. 「+」ボタンをクリック
1. プロパティ名: `Zenn公開`
1. タイプ: **Checkbox**
1. ℹ️ チェックすると公開、外すと下書き
### 完了確認

以下の8つのプロパティが揃っていることを確認：

---

## 1-3. Notion APIインテグレーションの作成

### 手順

1. **Notion Integrationsページを開く**
新しいタブで以下のURLにアクセス:
`   https://www.notion.so/my-integrations`

1. **新しいインテグレーションを作成**
  - 「+ New integration」ボタンをクリック
1. **基本情報を入力**
  - **Name**: `Zenn Auto Post`
  - **Logo**: そのまま（任意）
  - **Associated workspace**: 自分のワークスペースを選択
1. **権限を設定Capabilities**セクションで以下にチェック:
  - ✅ Read content
  - ✅ Update content
  - （Insert contentのチェックは不要）
1. **作成**
  - 「Submit」ボタンをクリック
1. **トークンをコピー**
  - **Internal Integration Token**が表示されます
  - 「Show」をクリックして表示
  - トークン全体をコピー（`ntn_` で始まる長い文字列）
### ⚠️ セキュリティ警告

- このトークンは**絶対に**公開しないでください
- チャット、SNS、公開リポジトリに貼り付けないでください
- メモ帳などに一時保存し、後で環境変数として設定します
### 完了確認

---

## 1-4. データベースとインテグレーションの接続

### 手順

1. **データベースページに戻る**
先ほど作成した「Zenn記事管理」データベースのページを開く
1. **接続メニューを開く**
  - ページ右上の「…」（三点リーダー）をクリック
  - メニューをスクロールして「接続を追加」を探す
  - 「Connect to」と表示される場合もあります
1. **インテグレーションを選択**
  - 「Zenn Auto Post」を探して選択
  - 「アクセスを許可する」旨の確認が出たら許可
1. **接続を確認**
  - ページ右上に小さなインテグレーションのアイコンが表示される
  - またはページプロパティに「Connections」が追加される
### トラブルシューティング

もし「接続を追加」が見つからない場合:

- データベースが他のページの中にある場合、親ページで接続してください
- 親ページの「…」→「接続を追加」→「Zenn Auto Post」
### 完了確認

---

## 1-5. Database IDの取得

### 手順

1. **データベースのURLを確認**
ブラウザのアドレスバーに表示されているURLを見てください。
**URLの例:**
`   https://www.notion.so/2b75e595c6c8809e8e46f00e12091a00?v=2b75e595c6c880c39a70000c73a40963`

1. **Database IDを抽出**`?v=` より前の部分がDatabase IDです:
`   https://www.notion.so/【ここがDatabase ID】?v=...
                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`

上の例の場合: `2b75e595c6c8809e8e46f00e12091a00`

1. **Database IDを保存**
  - この32文字の文字列をコピー
  - メモ帳などに「Database ID:」と書いて保存
### ⚠️ 注意

- ダッシュ（）は含みません
- 32文字の連続した英数字です
- `?v=` 以降は**ビューID**なので不要です
### 完了確認

---

# STEP 2: GitHubリポジトリの作成（5分）

## 2-1. GitHubで新しいリポジトリを作成

### 手順

1. **GitHubにログイン**
ブラウザで [GitHub](https://github.com/) を開いてログイン
1. **新しいリポジトリを作成**
  - 右上の「+」ボタンをクリック
  - 「New repository」を選択
1. **リポジトリ情報を入力**
  - **Repository name**: `zenn-notion-sync`
  - **Description**: `Notion to Zenn auto sync`（任意）
  - **Public/Private**: どちらでもOK
  - **Add a README file**: ☐ チェックを**外す**（重要！）
  - **Add .gitignore**: None
  - **Choose a license**: None
1. **作成**
  - 「Create repository」ボタンをクリック
1. **リポジトリURLを確認**
作成後、以下のようなURLが表示されます:
`   https://github.com/YOUR_USERNAME/zenn-notion-sync.git`

このURLを後で使うので、タブを開いたままにしておきます。

### 完了確認

---

# STEP 3: ローカル環境のセットアップ（20分）

## 3-1. プロジェクトフォルダの作成

### 手順

1. **ターミナルを開く**
  - **Mac**: Spotlight検索（⌘+Space）で「ターミナル」
  - **Windows**: スタートメニューで「cmd」または「PowerShell」
1. **作業ディレクトリに移動**
bash

`   # デスクトップに移動する例
   cd ~/Desktop`

または好きな場所に移動してください。

1. **プロジェクトフォルダを作成して移動**
bash

`   mkdir zenn-notion-sync
   cd zenn-notion-sync`

1. **現在地を確認**
bash

`   pwd`

`/Users/あなたの名前/Desktop/zenn-notion-sync` のように表示されればOK

### 完了確認

---

## 3-2. プロジェクトの初期化

### 手順

以下のコマンドを**順番に**実行してください。

### ① Gitリポジトリを初期化

bash

`git init`

**実行結果の例:**

`Initialized empty Git repository in /Users/.../zenn-notion-sync/.git/`

### ② Node.jsプロジェクトを初期化

bash

`npm init -y`

**実行結果の例:**

`Wrote to /Users/.../zenn-notion-sync/package.json`

### ③ 必要なパッケージをインストール

bash

`npm install @notionhq/client zenn-cli`

**実行結果の例:**

`added 89 packages, and audited 90 packages in 3s`

### ④ Zenn CLIの初期化

bash

`npx zenn init`

**実行結果の例:**

`✔ zenn-cli のバージョンは最新です
✔ .gitignore に zenn のルールを追加しました
✔ articles ディレクトリを作成しました
✔ books ディレクトリを作成しました
✔ README を作成しました`

### フォルダ構成の確認

以下のようなフォルダ構成になっていればOKです:

`zenn-notion-sync/
├── articles/       ← Zenn記事が保存される（重要）
├── books/          ← 使わないので無視してOK
├── node_modules/   ← インストールしたパッケージ
├── .gitignore
├── package.json
├── package-lock.json
└── README.md`

### 完了確認

---

## 3-3. 同期スクリプトの作成

### 3-3-1. sync-notion-to-zenn.jsファイルの作成

プロジェクトフォルダに `sync-notion-to-zenn.js` という名前のファイルを作成し、以下のコードを貼り付けてください。

### ⚠️ 重要

5行目の `YOUR_DATABASE_ID` を、**STEP 1-5で取得したDatabase ID**に置き換えてください。

javascript

`// sync-notion-to-zenn.js
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = 'YOUR_DATABASE_ID'; // ← ここを自分のDatabase IDに置き換える

// ========== 以下のコードはそのままコピペでOK ==========

// Notionのブロックタイプを判定してMarkdownに変換
function blockToMarkdown(block) {
  const type = block.type;
  
  switch (type) {
    case 'paragraph':
      return richTextToMarkdown(block.paragraph.rich_text) + '\n\n';
    
    case 'heading_1':
      return '# ' + richTextToMarkdown(block.heading_1.rich_text) + '\n\n';
    
    case 'heading_2':
      return '## ' + richTextToMarkdown(block.heading_2.rich_text) + '\n\n';
    
    case 'heading_3':
      return '### ' + richTextToMarkdown(block.heading_3.rich_text) + '\n\n';
    
    case 'bulleted_list_item':
      return '- ' + richTextToMarkdown(block.bulleted_list_item.rich_text) + '\n';
    
    case 'numbered_list_item':
      return '1. ' + richTextToMarkdown(block.numbered_list_item.rich_text) + '\n';
    
    case 'code':
      const language = block.code.language || '';
      const code = richTextToMarkdown(block.code.rich_text);
      return '```' + language + '\n' + code + '\n```\n\n';
    
    case 'quote':
      return '> ' + richTextToMarkdown(block.quote.rich_text) + '\n\n';
    
    case 'callout':
      const emoji = block.callout.icon?.emoji || '💡';
      return emoji + ' ' + richTextToMarkdown(block.callout.rich_text) + '\n\n';
    
    case 'divider':
      return '---\n\n';
    
    case 'image':
      const imageUrl = block.image.type === 'file' 
        ? block.image.file.url 
        : block.image.external.url;
      const caption = block.image.caption ? richTextToMarkdown(block.image.caption) : '';
      return `![${caption}](${imageUrl})\n\n`;
    
    default:
      console.log(`未対応のブロックタイプ: ${type}`);
      return '';
  }
}

// リッチテキストをMarkdownに変換
function richTextToMarkdown(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return '';
  
  return richTextArray.map(text => {
    let content = text.plain_text;
    
    if (text.annotations.bold && text.annotations.italic) {
      content = `***${content}***`;
    } else if (text.annotations.bold) {
      content = `**${content}**`;
    } else if (text.annotations.italic) {
      content = `*${content}*`;
    }
    
    if (text.annotations.code) content = `\`${content}\``;
    if (text.annotations.strikethrough) content = `~~${content}~~`;
    
    if (text.href) content = `[${content}](${text.href})`;
    
    return content;
  }).join('');
}

// Notionのブロックを再帰的に取得してMarkdownに変換
async function blocksToMarkdown(blockId, indent = '') {
  let markdown = '';
  let hasMore = true;
  let startCursor = undefined;
  
  while (hasMore) {
    const { results, has_more, next_cursor } = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
    });
    
    for (const block of results) {
      const blockMarkdown = blockToMarkdown(block);
      markdown += indent + blockMarkdown;
      
      if (block.has_children) {
        const childIndent = block.type === 'bulleted_list_item' || 
                           block.type === 'numbered_list_item' 
                           ? indent + '  ' 
                           : indent;
        markdown += await blocksToMarkdown(block.id, childIndent);
      }
    }
    
    hasMore = has_more;
    startCursor = next_cursor;
  }
  
  return markdown;
}

// プロパティから値を取得
function getPropertyValue(property) {
  if (!property) return null;
  
  switch (property.type) {
    case 'title':
      return property.title[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text[0]?.plain_text || '';
    case 'select':
      return property.select?.name || '';
    case 'multi_select':
      return property.multi_select.map(item => item.name);
    case 'checkbox':
      return property.checkbox;
    case 'status':
      return property.status?.name || '';
    default:
      return null;
  }
}

// スラッグを生成
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60)
    || 'article-' + Date.now();
}

async function syncNotionToZenn() {
  try {
    console.log('='.repeat(60));
    console.log('Notion → Zenn 自動同期を開始します');
    console.log('='.repeat(60));
    console.log();
    
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'ステータス',
            status: { equals: '完了' }
          },
          {
            property: 'Zenn投稿済み',
            checkbox: { equals: false }
          }
        ]
      }
    });
    
    console.log(`📊 対象記事: ${response.results.length}件\n`);
    
    if (response.results.length === 0) {
      console.log('✨ 新しく投稿する記事はありません\n');
      return;
    }
    
    for (const page of response.results) {
      const properties = page.properties;
      
      const title = getPropertyValue(properties['名前']);
      let slug = getPropertyValue(properties['Zennスラッグ']);
      const emoji = getPropertyValue(properties['Zenn絵文字']) || '📝';
      const type = getPropertyValue(properties['Zennタイプ']) || 'tech';
      const topics = getPropertyValue(properties['Zennトピック']) || [];
      const published = getPropertyValue(properties['Zenn公開']) || false;
      
      console.log('─'.repeat(60));
      console.log(`📝 処理中: ${title}`);
      console.log('─'.repeat(60));
      
      if (!slug) {
        slug = generateSlug(title);
        console.log(`  ℹ️  スラッグを自動生成: ${slug}`);
        
        await notion.pages.update({
          page_id: page.id,
          properties: {
            'Zennスラッグ': {
              rich_text: [{ text: { content: slug } }]
            }
          }
        });
      }
      
      console.log(`  🔖 スラッグ: ${slug}`);
      console.log(`  ${emoji} 絵文字: ${emoji}`);
      console.log(`  📑 タイプ: ${type}`);
      console.log(`  🏷️  トピック: ${topics.length > 0 ? topics.join(', ') : 'なし'}`);
      console.log(`  ${published ? '🌐 公開' : '🔒 非公開'}`);
      
      console.log(`  📥 本文を取得中...`);
      const markdown = await blocksToMarkdown(page.id);
      
      const frontMatter = `---
title: "${title}"
emoji: "${emoji}"
type: "${type}"
topics: [${topics.map(t => `"${t}"`).join(', ')}]
published: ${published}
---

`;
      
      const articlesDir = path.join(process.cwd(), 'articles');
      if (!fs.existsSync(articlesDir)) {
        fs.mkdirSync(articlesDir, { recursive: true });
      }
      
      const filePath = path.join(articlesDir, `${slug}.md`);
      fs.writeFileSync(filePath, frontMatter + markdown);
      
      console.log(`  ✅ ファイル保存: articles/${slug}.md`);
      
      await notion.pages.update({
        page_id: page.id,
        properties: {
          'Zenn投稿済み': { checkbox: true }
        }
      });
      
      console.log(`  ✅ Notionのステータスを「投稿済み」に更新`);
      console.log();
    }
    
    console.log('='.repeat(60));
    console.log('✨ 同期完了！');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    if (error.code === 'object_not_found') {
      console.error('Notionのデータベースが見つかりません。Database IDを確認してください。');
    } else if (error.code === 'unauthorized') {
      console.error('Notion APIのアクセス権限がありません。トークンとデータベースの連携を確認してください。');
    }
    process.exit(1);
  }
}

syncNotionToZenn();`

### 完了確認

---

### 3-3-2. package.jsonの編集

`package.json` ファイルを開き、`"scripts"` セクションを以下のように編集:

json

`{
  "name": "zenn-notion-sync",
  "version": "1.0.0",
  "scripts": {
    "sync": "node sync-notion-to-zenn.js",
    "preview": "npx zenn preview"
  },
  "dependencies": {
    "@notionhq/client": "^2.2.15",
    "zenn-cli": "^0.1.153"
  }
}`

### 完了確認

# STEP 4: GitHub Actionsの設定（10分）

## 4-1. ワークフローファイルの作成

### 手順

1. **フォルダを作成**
bash

`   mkdir -p .github/workflows`

1. **ワークフローファイルを作成**`.github/workflows/sync.yml` という名前のファイルを作成し、以下の内容を貼り付け:
yaml

`name: Sync Notion to Zenn

on:
  schedule:
    # 毎日 6:00, 12:00, 18:00 (JST = UTC+9) に実行
    - cron: '0 21,3,9 * * *'
  workflow_dispatch:  # 手動実行も可能

permissions:
  contents: write

jobs:
  sync:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Sync from Notion to Zenn
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
        run: npm run sync
      
      - name: Commit and push if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add articles/
          if git diff --staged --quiet; then
            echo "✨ 変更なし - 新しい記事はありません"
          else
            git commit -m "🚀 Sync articles from Notion [$(date +'%Y-%m-%d %H:%M:%S')]"
            git push
            echo "✅ 記事を同期しました"
          fi`

### ⚠️ 重要

- `permissions: contents: write` の行は**必須**です
- この行がないとGitHub Actionsがファイルをpushできません
### 完了確認

---

## 4-2. ファイルをGitHubにプッシュ

### 手順

1. **リモートリポジトリを設定**
bash

`   git remote add origin https://github.com/YOUR_USERNAME/zenn-notion-sync.git`

⚠️ `YOUR_USERNAME` を自分のGitHubユーザー名に置き換えてください

1. **ブランチ名を設定**
bash

`   git branch -M main`

1. **全ファイルを追加**
bash

`   git add .`

1. **コミット**
bash

`   git commit -m "Initial setup"`

1. **プッシュ**
bash

`   git push -u origin main`

### トラブルシューティング

もし「remote: Repository not found」エラーが出る場合:

- GitHubでリポジトリが作成されているか確認
- リポジトリ名が正しいか確認
- URLのユーザー名が正しいか確認
### 完了確認

---

# STEP 5: GitHubの設定（5分）

## 5-1. GitHub Secretsの設定

### 手順

1. **GitHubリポジトリページを開く**
`   https://github.com/YOUR_USERNAME/zenn-notion-sync`

1. **Settingsタブをクリック**
  - リポジトリページ上部のタブから「Settings」を選択
1. **Secretsページを開く**
  - 左サイドバーから「Secrets and variables」をクリック
  - 「Actions」を選択
1. **Secretを追加**
  - 「New repository secret」ボタンをクリック
  - 以下を入力:
    - **Name**: `NOTION_TOKEN`
    - **Secret**: STEP 1-3で保存したNotion Integration Token
  - 「Add secret」をクリック
### 完了確認

---

# STEP 6: Zennとの連携（5分）

## 6-1. ZennとGitHubリポジトリを連携

### 手順

1. **Zennにログイン**[Zenn](https://zenn.dev/) を開いてログイン
1. **アカウント設定を開く**
  - 右上のアイコンをクリック
  - 「アカウント設定」を選択
1. **GitHubリポジトリ連携**
  - 左メニューから「GitHubリポジトリ連携」をクリック
  - 「リポジトリを連携する」ボタンをクリック
1. **リポジトリを選択**
  - `YOUR_USERNAME/zenn-notion-sync` を探して選択
  - 「連携する」をクリック
1. **連携を確認**
  - 画面に連携したリポジトリが表示されればOK
### 完了確認

---

# STEP 7: テスト実行（10分）

## 7-1. Notionでテスト記事を作成

### 手順

1. **Notionデータベースを開く**
「Zenn記事管理」データベースのページを開く
1. **新しいページ（行）を追加**
  - テーブルの一番下をクリック
  - または「+ New」ボタンをクリック
1. **記事情報を入力**
  - **名前**: `テスト記事`
  - **ステータス**: `未着手`（後で変更）
  - **Zennスラッグ**: `test-article`
  - **Zenn絵文字**: `🚀`
  - **Zennタイプ**: `tech`
  - **Zennトピック**: `test`
  - **Zenn公開**: ✅ チェック
1. **記事本文を書く**
ページ（行）をクリックして開き、本文を書きます:
`   # はじめに
   
   これはテスト記事です。
   
   ## 内容
   
   - リスト1
   - リスト2
   - リスト3
   
   ## まとめ
   
   テスト完了！`

1. **ステータスを「完了」に変更**
  - ステータスを「未着手」→「完了」に変更
  - これで同期対象になります
### 完了確認

---

## 7-2. GitHub Actionsを手動実行

### 手順

1. **GitHubのActionsページを開く**
`   https://github.com/YOUR_USERNAME/zenn-notion-sync/actions`

1. **ワークフローを選択**
  - 左サイドバーから「Sync Notion to Zenn」をクリック
1. **手動実行**
  - 右側の「Run workflow」ボタンをクリック
  - ドロップダウンが開いたら、もう一度「Run workflow」をクリック
1. **実行を確認**
  - ページが更新され、黄色い丸（実行中）が表示される
  - クリックして詳細を見る
1. **ログを確認**
  - 「sync」ジョブをクリック
  - 各ステップのログが表示される
  - 「Sync from Notion to Zenn」のログを確認:
    - `📊 対象記事: 1件` と表示されればOK
    - `✅ ファイル保存: articles/test-article.md` と表示されればOK
### 完了確認

---

## 7-3. 結果を確認

### ① GitHubで確認

1. リポジトリのトップページを開く
1. `articles/` フォルダをクリック
1. `test-article.md` ファイルがあればOK
1. クリックして内容を確認
### ② Zennで確認

1. [Zennダッシュボード](https://zenn.dev/dashboard)を開く
1. 左メニューの「Articles」をクリック
1. 「テスト記事」が表示されていればOK
1. クリックしてプレビューを確認
### ③ Notionで確認

1. Notionデータベースに戻る
1. テスト記事の「Zenn投稿済み」にチェックが入っているか確認
1. 「Zennスラッグ」に `test-article` が入っているか確認
### 完了確認

---

# 運用方法

## 記事の投稿

1. Notionで記事を書く
1. 必要な項目を入力
1. ステータスを「完了」に変更
1. 自動的にZennに投稿される（最大3時間待機）
## 即座に同期したい場合

1. GitHub ActionsのページでRun workflowを実行
## 記事の更新

1. Notionで記事を編集
1. 「Zenn投稿済み」のチェックを外す
1. ステータスを「完了」に戻す
1. 自動的に更新される
---

# トラブルシューティング

## エラー1: `object_not_found`

**症状:**

`Could not find database with ID: xxx`

**原因:**
データベースとインテグレーションが接続されていない

**解決方法:**

1. Notionのデータベースページを開く
1. 右上「…」→「接続を追加」→「Zenn Auto Post」を選択
---

## エラー2: Database IDの間違い

**症状:**
同じく`object_not_found`エラー

**原因:**
Database IDが間違っている、またはData Source IDを使っている

**解決方法:**

1. NotionのURLを確認
1. `?v=` より前の32文字がDatabase ID
1. `sync-notion-to-zenn.js` の5行目を確認
1. ダッシュ（）が入っていないか確認
---

## エラー3: GitHub Actionsの権限エラー

**症状:**

`remote: Permission to xxx denied to github-actions[bot]`

**原因:**
ワークフローファイルに`permissions: contents: write`がない

**解決方法:**

1. GitHubのWeb UIでファイルを編集（推奨）
1. `.github/workflows/sync.yml`を開く
1. `permissions: contents: write` を追加
1. コミット
---

## エラー4: Notion Tokenの認証エラー

**症状:**

`unauthorized`

**原因:**

- Notion Tokenが間違っている
- GitHub Secretsが設定されていない
**解決方法:**

1. GitHub Secretsで`NOTION_TOKEN`を確認
1. 必要に応じてNotion Integrationのトークンを再生成
---

# セキュリティ上の注意

## Notion Tokenの取り扱い

### ❌ 絶対にしてはいけないこと

- チャットやコメントに貼り付ける
- 公開リポジトリにコミットする
- SNSに投稿する
- スクリーンショットを撮って共有する
### ✅ 正しい管理方法

- GitHub Secretsで管理する
- ローカルでは環境変数として設定する
- 漏洩したら即座に再生成する
## Database IDについて

- ✅ ハードコーディングしてOK
- ✅ 公開されても問題なし
- IDだけではアクセスできない（Tokenが必要）
---

# まとめ

## このシステムの利点

- ✅ Notionで快適に記事執筆
- ✅ ステータス変更だけで自動投稿
- ✅ GitHub Actionsで完全自動化
- ✅ 記事のバージョン管理が可能
- ✅ 下書きと公開の管理が簡単
## 次のステップ

- 記事を量産してみる
- トピックを増やしてタグ付けを充実
- 絵文字を工夫して記事を華やかに
- 定期実行の時間を調整（cron設定）
---

## 参考リンク

- [Notion API Documentation](https://developers.notion.com/)
- [Zenn CLI Guide](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
