---
title: "obsidian-morning-page-plugin"
emoji: "📝"
type: "tech"
topics: []
published: true
---

```markdown

```

```markdown

```

# **ObsidianのMorning Pagesプラグインを改造して、最高の執筆体験を実現した話**

## **はじめに**

毎朝、頭の中のもやもやを書き出すMorning Pages。Julia Cameronの名著『The Artist's Way』で紹介されているこの習慣は、創造性を高め、心をクリアにする素晴らしい方法です。

私はObsidianでMorning Pagesを書いているのですが、既存のプラグインに少し不満がありました。タイマーが終わっても気づかない、別の作業をしていると通知を見逃す...そんな経験はありませんか？

そこで、**Morning Pagesプラグインを改造して、3つの新機能を追加しました**。

この記事では、初心者の方でもすぐに使えるように、プラグインのインストール方法から追加機能の使い方、さらには開発者向けの技術的な実装まで、詳しく解説します。

## **追加した3つの新機能**

### **✨ 機能1: 音声通知（ビープ音）**

タイマーが終了すると、心地よいビープ音が鳴ります。

**なぜ必要？**

- 執筆に集中していても、タイマー終了に気づける
- 視覚的な通知だけでは見逃しがち
- 音量は自由に調整可能（0〜100%）
**技術的な仕組み** Web Audio APIを使用して、800Hzのサイン波を300ms再生します。耳に優しく、でもしっかり聞こえる周波数です。

### **🔔 機能2: デスクトップ通知**

Obsidianがバックグラウンドにあっても、システムレベルの通知が表示されます。

**なぜ必要？**

- 別のアプリで調べ物をしていても通知が届く
- Obsidianが最小化されていても大丈夫
- macOS、Windows、Linux すべてで動作
**技術的な仕組み** Web Notification APIを使用し、ブラウザの通知権限を活用します。権限が拒否された場合は、Obsidianの内部通知に自動でフォールバックするので安心です。

### **📊 機能3: 視覚的プログレスバー**

画面上部に美しいプログレスバーが表示され、残り時間を視覚的に把握できます。

**なぜ必要？**

- あとどれくらいか一目でわかる
- 青色のバーが徐々に伸びていく様子が心地よい
- 完了時には緑色に変わり、達成感を演出
**技術的な仕組み** CSSアニメーションとJavaScriptの組み合わせで、滑らかな動きを実現。Obsidianのテーマカラーに自動的に適応するので、どのテーマでも美しく表示されます。

---

## **プラグインのインストール方法**

### **ステップ1: コミュニティプラグインを有効化**

1. Obsidianを開く
1. **Settings**（設定）を開く（歯車アイコン）
1. 左サイドバーから **Community plugins**（コミュニティプラグイン）を選択
1. **Turn on community plugins**（コミュニティプラグインをオンにする）をクリック
### **ステップ2: Morning Pagesプラグインをインストール**

1. **Browse**（閲覧）ボタンをクリック
1. 検索ボックスに「Morning Pages」と入力
1. プラグインを見つけたら、**Install**（インストール）をクリック
1. インストール後、**Enable**（有効化）をクリック
### **ステップ3: 初期設定を確認**

1. Settings → **Morning Pages** を開く
1. 以下の設定を確認：
  - **Morning Pages Folder**: ファイルの保存場所（デフォルト: `Morning Pages`）
  - **Target Duration**: タイマーの長さ（デフォルト: 15分）
  - **Audio notification**: 音声通知（デフォルト: ON）
  - **Audio volume**: 音量（デフォルト: 50）
  - **Desktop notification**: デスクトップ通知（デフォルト: ON）
---

## **実際の使い方（ステップバイステップ）**

### **1. コマンドパレットを開く**

- **Windows/Linux**: `Ctrl + P`
- **macOS**: `Cmd + P`
### **2. Morning Pagesセッションを開始**

1. コマンドパレットに「Morning Pages」と入力
1. **Morning Pages: Open today's page** を選択
1. 今日の日付のファイルが自動的に作成・開きます
1. タイマーが自動的に開始されます
### **3. プログレスバーを確認**

画面の最上部を見てください。細い青色のバーが左から右へ徐々に伸びていきます。これがプログレスバーです。

### **4. 執筆を楽しむ**

思いついたことを何でも書いてください。Morning Pagesに「正しい」書き方はありません。頭に浮かんだことをそのまま書くだけです。

### **5. タイマー完了時の体験**

15分が経過すると、以下のことが起こります：

1. **ビープ音が鳴る**（音声通知がONの場合）
1. **デスクトップ通知が表示される**（権限を許可している場合）
1. **プログレスバーが緑色に変わり、パルスする**
1. **2秒後にバーが滑らかにフェードアウト**
完了後も、お好みで執筆を続けることができます。

---

## **設定のカスタマイズ**

### **デスクトップ通知の権限を許可する**

初めてデスクトップ通知を使う場合、権限の許可が必要です。

1. Settings → **Morning Pages** を開く
1. 一番下の **Test** ボタンをクリック
1. ブラウザから通知の許可を求められたら、**許可** をクリック
1. ビープ音が鳴り、テスト通知が表示されることを確認
### **音量を調整する**

1. Settings → **Morning Pages** を開く
1. **Audio volume** スライダーを左右に動かす
1. 0にすると無音、100で最大音量
1. **Test** ボタンで音量を確認できます
### **通知をオフにする**

音声通知やデスクトップ通知が不要な場合：

1. Settings → **Morning Pages** を開く
1. **Audio notification** または **Desktop notification** のトグルをオフ
1. 設定は即座に反映されます
---

## **開発者向け：技術的な実装解説**

ここからは、プログラミングに興味がある方や、Obsidianプラグイン開発を学びたい方向けの内容です。

### **プロジェクト構成**

プラグインは以下のファイルで構成されています：

```plain text
obsidian-morning-pages/
├── src/
│   ├── main.ts                     # プラグインのメインクラス
│   ├── timer-service.ts            # タイマー管理
│   ├── audio-notification.ts       # 音声通知（新規）
│   ├── notification-service.ts     # デスクトップ通知（新規）
│   ├── settings.ts                 # 設定管理
│   └── word-count-service.ts       # 単語数カウント
├── styles.css                      # スタイル（プログレスバー）
├── manifest.json                   # プラグインメタデータ
└── package.json                    # npm設定

```

### **実装した新機能の詳細**

### **音声通知サービス (audio-notification.ts)**

Web Audio APIを使用して、ビープ音を生成します。

**核心部分のコード:**

```typescript
async playBeep(frequency: number = 800, duration: number = 300): Promise<void> {
    if (!this.enabled || !this.audioContext) return;

    // AudioContextの状態確認（autoplay policy対策）
    if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
    }

    const currentTime = this.audioContext.currentTime;

    // オシレーターでビープ音を生成
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';  // サイン波
    oscillator.frequency.setValueAtTime(frequency, currentTime);

    // ゲインノードで音量制御
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(this.volume, currentTime);

    // フェードアウト（クリックノイズ防止）
    const fadeOutDuration = 0.05;
    gainNode.gain.setValueAtTime(this.volume, currentTime + duration / 1000 - fadeOutDuration);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + duration / 1000);

    // ノードを接続
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 再生
    oscillator.start(currentTime);
    oscillator.stop(currentTime + duration / 1000);
}

```

**ポイント:**

- `AudioContext` を使用してブラウザで音を生成
- `sine` 波形で耳に優しい音
- フェードアウトでクリックノイズを防止
- `suspended` 状態のチェックで autoplay policy に対応
### **デスクトップ通知サービス (notification-service.ts)**

Web Notification APIを使用し、フォールバック戦略を実装しています。

**核心部分のコード:**

```typescript
async showTimerCompleteNotification(): Promise<void> {
    if (!this.enabled) return;

    try {
        // Web Notification APIを試行
        if (this.permissionGranted && 'Notification' in window) {
            new Notification('Morning Pages', {
                body: 'Time is up! Great job.',
                requireInteraction: false,
                silent: true,  // 音声は別途AudioServiceで処理
            });
            console.log('[Morning Pages] Desktop notification shown.');
        } else {
            // フォールバック
            this.showObsidianNotice();
        }
    } catch (error) {
        console.error('[Morning Pages] Failed to show desktop notification:', error);
        // エラー時もフォールバック
        this.showObsidianNotice();
    }
}

private showObsidianNotice(): void {
    new Notice('Morning Pages: Time is up! Great job.');
    console.log('[Morning Pages] Obsidian Notice shown (fallback).');
}

```

**ポイント:**

- Web Notification API が使えない場合は Obsidian Notice にフォールバック
- `silent: true` で音声は AudioService に任せる
- エラーハンドリングで確実に通知を表示
### **視覚的プログレスバー (styles.css)**

CSSアニメーションで美しいプログレスバーを実現しています。

**核心部分のCSS:**

```css
.morning-pages-progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg,
        var(--interactive-accent) 0%,
        var(--interactive-accent-hover) 100%);
    z-index: 9999;
    transition: width 0.5s ease-out;
    box-shadow: 0 0 10px rgba(var(--interactive-accent-rgb), 0.5);
    pointer-events: none;
}

/* 完了時のパルスアニメーション */
.morning-pages-progress-bar.is-complete {
    background: linear-gradient(90deg,
        var(--interactive-success) 0%,
        var(--interactive-success) 100%);
    animation: completePulse 0.5s ease-in-out;
}

@keyframes completePulse {
    0%, 100% {
        height: 3px;
        opacity: 1;
    }
    50% {
        height: 5px;
        opacity: 0.8;
    }
}

```

**ポイント:**

- `position: fixed` で画面最上部に固定
- `transition` で滑らかな幅の変化
- Obsidianのテーマカラー（CSS変数）を使用
- 完了時のパルスアニメーションで達成感を演出
### **統合部分 (main.ts, timer-service.ts, settings.ts)**

サービスを初期化し、タイマーと連携させます。

**main.ts での初期化:**

```typescript
async onload() {
    await this.loadSettings();

    // サービスを初期化
    this.audioService = new AudioNotificationService();
    this.notificationService = new NotificationService();

    // 設定から有効/無効を反映
    this.audioService.setEnabled(this.settings.audioNotificationEnabled);
    this.audioService.setVolume(this.settings.audioVolume);
    this.notificationService.setEnabled(this.settings.desktopNotificationEnabled);

    // TimerServiceにサービスを注入（依存性注入パターン）
    this.timerService.setAudioService(this.audioService);
    this.timerService.setNotificationService(this.notificationService);

    // ... 他の初期化処理
}

```

**timer-service.ts での通知呼び出し:**

```typescript
private onComplete() {
    this.timerId = null;
    if (this.intervalId !== null) {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
    }
    this.startTime = null;

    // 音声通知を再生
    if (this.audioService) {
        this.audioService.playBeep();
    }

    // デスクトップ通知を表示
    if (this.notificationService) {
        this.notificationService.showTimerCompleteNotification();
    }

    // コールバック実行
    if (this.onCompleteCallback) {
        this.onCompleteCallback();
    }
}

```

**ポイント:**

- **依存性注入パターン**: サービスを外部から注入することで、テストしやすく拡張しやすい設計
- サービスの初期化順序を適切に管理
- 設定変更が即座に反映される仕組み
### **学んだこと・工夫した点**

### **1. エラーハンドリング**

Web Audio API や Notification API は、ブラウザや環境によって動作が異なります。そこで：

- AudioContext が使えない場合はログのみで失敗させる（Silent Failure）
- Notification の権限が拒否された場合は Obsidian Notice にフォールバック
- ユーザー体験を損なわないエラー処理
### **2. ブラウザ互換性への配慮**

- AudioContext の `suspended` 状態をチェック（autoplay policy 対応）
- Safari 用に `webkitAudioContext` のフォールバック
- Notification API の存在チェック
### **3. ユーザー体験の向上**

- 音量スライダーは音声通知がONの時のみ有効
- テストボタンで設定前に動作確認可能
- プログレスバーのフェードアウトアニメーション
- 完了時のパルスアニメーションで達成感
---

## **トラブルシューティング**

### **デスクトップ通知が表示されない**

**確認すること:**

1. Settings → Morning Pages で **Desktop notification** が有効か確認
1. **Test** ボタンをクリックして権限をリクエスト
1. ブラウザのプロンプトで **許可** をクリックしたか確認
1. システムの通知設定で Obsidian/ブラウザの通知が有効か確認
**誤って権限を拒否した場合:**

- **macOS**: システム環境設定 → 通知 → [ブラウザ名] で許可
- **Windows**: 設定 → システム → 通知とアクション → [ブラウザ名] で許可
- **Chrome/Electron**: ブラウザ設定 → プライバシーとセキュリティ → サイトの設定 → 通知
### **音声が再生されない**

**確認すること:**

1. Settings → Morning Pages で **Audio notification** が有効か確認
1. **Audio volume** が 0 より大きいか確認
1. システムの音量がミュートになっていないか確認
1. **Test** ボタンで音声が機能するか確認
### **プログレスバーが表示されない**

**確認すること:**

1. コマンドパレットから **Morning Pages: Open today's page** を実行したか確認（手動でファイルを開いてもタイマーは開始しません）
1. Obsidian を再起動してみる
1. 画面の最上部を確認（他のUI要素の後ろに隠れていないか）
---

## **まとめ**

Obsidian の Morning Pages プラグインに、以下の3つの機能を追加しました：

1. **音声通知**: タイマー終了時に心地よいビープ音
1. **デスクトップ通知**: バックグラウンドでも確実に通知
1. **視覚的プログレスバー**: 画面上部に美しいアニメーション
これらの機能により、Morning Pages の習慣がさらに続けやすくなりました。執筆に集中しながらも、タイマーの終了を確実に知ることができます。

### **Morning Pages 習慣への効果**

- **集中力の向上**: 音声通知があるので、タイマーを気にせず執筆に没頭できる
- **習慣の継続**: デスクトップ通知で、別の作業中でも忘れずに完了できる
- **モチベーション**: プログレスバーの完了アニメーションが達成感を演出
### **今後の改善案**

- 残り時間の表示（オプション）
- カスタム音声ファイルの使用
- タイマー完了後の自動保存
- 統計情報の表示（連続日数、総単語数など）
### **読者へのメッセージ**

Morning Pages は、創造性を高め、心をクリアにする素晴らしい習慣です。Obsidian というツールと、このカスタマイズされたプラグインで、ぜひその習慣を始めてみてください。

プログラミングに興味がある方は、この記事を参考に、自分だけの機能を追加してみるのも楽しいですよ。Obsidian のプラグイン開発は、思ったよりも簡単です。

Happy writing! ✍️

---

## **参考リンク**

- [Obsidian 公式サイト](https://obsidian.md/)
- [The Artist's Way - Julia Cameron](https://juliacameronlive.com/the-artists-way/)
- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Notifications API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Obsidian Plugin Developer Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
---

*この記事が役に立ったら、ぜひシェアしてください。Morning Pages の習慣を始める人が増えることを願っています。*

