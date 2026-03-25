---
title: "【完全版】SAMLセッションがループする原因とbrowser-use CLIで解決できる理由を初心者向けに徹底解説"
emoji: "🔐"
type: "tech"
topics: ["AI"]
published: false
---

## 📌 投稿先・ステータスメモ

- **投稿先**：WordPress
- **Zenn公開**：後日対応（現在はOFF）
- **作成ステータス**：記事完成 / WordPress投稿待ち
---

## 概要

SAMLセッションがループする原因と、browser-use CLIで解決できる理由を初心者向けに解説した記事。

- Chromeプロセスが47個に増殖した実体験から問題を深掘り
- Cookie消失の3つの原因（セッション分離・ドメインまたぎ・SameSite制約）
- browser-use CLIのプロファイル読み込み・Cookie Export/Import機能の解説
