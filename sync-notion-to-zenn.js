// sync-notion-to-zenn.js
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = '2b75e595c6c8809e8e46f00e12091a00';

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
    
    case 'toggle':
      return '▶ ' + richTextToMarkdown(block.toggle.rich_text) + '\n\n';
    
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
    
    // 装飾を適用（順序重要）
    if (text.annotations.bold && text.annotations.italic) {
      content = `***${content}***`;
    } else if (text.annotations.bold) {
      content = `**${content}**`;
    } else if (text.annotations.italic) {
      content = `*${content}*`;
    }
    
    if (text.annotations.code) content = `\`${content}\``;
    if (text.annotations.strikethrough) content = `~~${content}~~`;
    
    // リンク
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
      
      // 子ブロックがある場合は再帰的に取得（インデント追加）
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

// スラッグを生成（日本語タイトルからも生成）
function generateSlug(title) {
  // 日本語や特殊文字を削除して小文字に変換
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 英数字とスペース、ハイフン以外を削除
    .replace(/\s+/g, '-')      // スペースをハイフンに
    .replace(/-+/g, '-')       // 連続するハイフンを1つに
    .trim()
    .substring(0, 60) // 最大60文字
    || 'article-' + Date.now(); // タイトルが英数字を含まない場合
}

async function syncNotionToZenn() {
  try {
    console.log('='.repeat(60));
    console.log('Notion → Zenn 自動同期を開始します');
    console.log('='.repeat(60));
    console.log();
    
    // 「完了」ステータスで「未投稿」の記事を取得
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'ステータス',
            status: {
              equals: '完了'
            }
          },
          {
            property: 'Zenn投稿済み',
            checkbox: {
              equals: false
            }
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
      
      // プロパティから値を取得
      const title = getPropertyValue(properties['名前']);
      let slug = getPropertyValue(properties['Zennスラッグ']);
      const emoji = getPropertyValue(properties['Zenn絵文字']) || '📝';
      const type = getPropertyValue(properties['Zennタイプ']) || 'tech';
      const topics = getPropertyValue(properties['Zennトピック']) || [];
      const published = getPropertyValue(properties['Zenn公開']) || false;
      
      console.log('─'.repeat(60));
      console.log(`📝 処理中: ${title}`);
      console.log('─'.repeat(60));
      
      // スラッグが未設定の場合は自動生成
      if (!slug) {
        slug = generateSlug(title);
        console.log(`  ℹ️  スラッグを自動生成: ${slug}`);
        
        // Notionにスラッグを保存
        await notion.pages.update({
          page_id: page.id,
          properties: {
            'Zennスラッグ': {
              rich_text: [{
                text: { content: slug }
              }]
            }
          }
        });
      }
      
      console.log(`  🔖 スラッグ: ${slug}`);
      console.log(`  ${emoji} 絵文字: ${emoji}`);
      console.log(`  📑 タイプ: ${type}`);
      console.log(`  🏷️  トピック: ${topics.length > 0 ? topics.join(', ') : 'なし'}`);
      console.log(`  ${published ? '🌐 公開' : '🔒 非公開'}`);
      
      // ページの本文を取得してMarkdownに変換
      console.log(`  📥 本文を取得中...`);
      const markdown = await blocksToMarkdown(page.id);
      
      // Zenn形式のフロントマターを作成
      const frontMatter = `---
title: "${title}"
emoji: "${emoji}"
type: "${type}"
topics: [${topics.map(t => `"${t}"`).join(', ')}]
published: ${published}
---

`;
      
      // articlesフォルダに保存
      const articlesDir = path.join(process.cwd(), 'articles');
      if (!fs.existsSync(articlesDir)) {
        fs.mkdirSync(articlesDir, { recursive: true });
      }
      
      const filePath = path.join(articlesDir, `${slug}.md`);
      fs.writeFileSync(filePath, frontMatter + markdown);
      
      console.log(`  ✅ ファイル保存: articles/${slug}.md`);
      
      // Notionのステータスを更新
      await notion.pages.update({
        page_id: page.id,
        properties: {
          'Zenn投稿済み': {
            checkbox: true
          }
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

// 実行
syncNotionToZenn();