---
title: "Zustand Store とは？react stateとの違い"
emoji: "📝"
type: "tech"
topics: ["react", "next.js", "zustand", "state", "store"]
published: true
---

Reactには `useState` という「コンポーネント内だけで使える状態管理」がありますが、**アプリ全体で状態を共有したい**ときに使うのが **Zustand Store** です。

```plain text
useState        → そのコンポーネント内だけ
Zustand Store   → アプリ全体どこからでも
```

## なぜ必要なの？

例えばログイン情報を複数の画面で使いたい場合、`useState` だとコンポーネントをまたいで渡すのが大変です。Storeに入れると、どの画面からでも直接読み書きできます。

```typescript
// どの画面からでもこれだけで使える
const { user } = useAuthStore();
```

## useStateとの違い

仕組みは `useState` と同じで、**値が変わると自動で画面が再描画**されます。

## データの流れ

Storeはあくまでメモリ上の一時的な入れ物なので、永続保存にはDBが必要です。

```plain text
PGlite（IndexedDB）  ← 永続保存（ブラウザを閉じても残る）
        ↕ loadXxx() / saveXxx()
Zustand Store        ← 一時保存（ページを閉じると消える）
        ↕ useXxxStore()
React コンポーネント  ← 画面に表示
```

