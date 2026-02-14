---
title: "RStudioをはじめよう"
emoji: "R"
type: "idea"
topics: ["マーケティング", "トレーディング", "時系列分析", "R"]
published: true
---

# はじめに

最近ではAIによってあらゆる仕事が奪われると焦燥感を持っている人が多いと思います。



- 自分で事業やフリーランスで副収入を得ないと生活が回らない。
- マーケティングしたいけど何をしたらいいか、データを見ても次の一手が思いつかない。
こういった人向けにデータに強く、リテラシーや技能を学ぶ場を提供できたらいいと思い、今回はデータ分析をするためのツール「R」を解説していこうと思います。

データ分析やプログラミングを学ぶ上で、R言語は非常に強力なツールです。そしてRStudioは、R言語を使った開発を快適にする統合開発環境（IDE）として、世界中の研究者やデータサイエンティストに愛用されています。

この記事では、macOSユーザー向けに、RStudioのインストール方法から基本的な使い方まで、丁寧に解説していきます。

# RStudioのインストール方法

macOSでは、Homebrewを使って簡単にRStudioをインストールできます。ターミナルを開いて、以下のコマンドを実行してください：

```bash
brew install --cask rstudio
```

Homebrewを使うことで、バージョン管理やアンインストールも簡単に行えるため、おすすめの方法です。

Hoomebrewはパッケージマネージャーでmacではインストールしておくととても便利です。

インストールのコマンドも追記しておきます。

```javascript
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

ちなみにmacのターミナルは下の画像のようなアイコンです。



![](https://prod-files-secure.s3.us-west-2.amazonaws.com/82eee7c2-babd-4ec3-ad7c-a809c691efb9/e3f209a2-54a4-4fce-a559-aab51c5b0c6d/CleanShot_2026-02-14_at_14.30.212x.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RZRKJPR2%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T092444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDh8ELRErs%2BnVayhtWhwzhHT6iT10IJZI8%2Ftrr8WLeUNgIhAOUjNLJQv2xytIvEemy%2FirJ%2FzOzPV14ip2ZReIO2WhZ3Kv8DCAIQABoMNjM3NDIzMTgzODA1IgxLleixjyQ2yELr2bcq3APT51Bem2RvAE%2F1JEIdVHqsZNsVzsdSYxTzJG%2FAp09bxGa2xecGlJwdFCz2oIDjfpiGU9RZ7h7ncAdLYBgtyjXoIL0hr0L2F6kLoSr7yX3%2F%2FtG8AinU7LvQLjsgQJutxBwpKzBPotl0g4n5XSiVbrw6ZuhTM3%2F6gW%2FyI0qMhDUDnqQ8BFiIsTQab0hlhhDkC9dUWdv%2F6qPH9a8AOVAVSUzWrqO5GdulxO6R0IPoS9Gkb3T%2FieFbcZMR7Z98zdkTjKmEi6dXMoWoO%2BJIvUKjL1IdqyjpmXP9DqU7ZKdCGwZSl8Fk82uFPQy4%2BChOkPo0NrVrQgGvbk6TTsqGmDjHTZiO1%2BskwE%2FHwUAsKMR1nksYfJn74ElE0ResT%2BumFacgChQgjNR7EtIx3UbCFoe3VNgvooFe6xlrI85iu5J0tr6VL2Pzrst3YFTNiMMdKC2cyEafj6uLwNond8sFo4GZvh3va3wOAYN2h5NVzN2GQzUFk5A7d0sGIexq0klMricpzkdZqruBN1NMwqaQ2JUpQxDL4VEPb8L3xFZn9SIWh%2BnGNDyxlyNXBiJFRjRXqznfPjxJP3fyqyvdF8cMb2mchxkJ87CdDgA1oCFsZ7Nlg6uOojAaztBq1DEg5PKgXDDI5MDMBjqkAe8ujgdCVRRt4WRBAZhGR4A2rHkw8BKGh%2Brw4DSqX7%2FlI1k4mJHeqfbiYv4ad4uUV%2FW1Uyhc0U6m8ZUgM1OLFgbG9Xn5xn%2BxAytK4FhLc0Nsrxdl9WAdtL4mKVp9xfZIOYlS5FeizArQkUqHb5JT%2BGsG0kv6oEgQz1WYyXbBowxujzJsJEhTeG7B%2BxMOn39qOH87BqWpIkKciK6ahrTHtHegxZAy&X-Amz-Signature=19ba43ce2ef5eb947458c77af68f9f91cf0325bbd0d16c2e8d90d904ff30df1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

## RStudioの起動方法

インストールが完了したら、以下の方法でRStudioを起動できます：



**方法1: ターミナルから起動**

```bash
open -a RStudio
```

**方法2: アプリケーションフォルダから起動**

Finder > アプリケーション > RStudio をダブルクリック

# RStudioの画面構成を理解しよう

RStudioを開くと、画面が4つに分かれていることに気づくでしょう。それぞれには重要な役割があります。

## 1. Source（ソース） - 左上 

左上のプラスボタンを押すとR Scriptが出せるようになります。

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/82eee7c2-babd-4ec3-ad7c-a809c691efb9/043ddf6d-a571-46a1-b62d-035f6618c5e9/CleanShot_2026-02-14_at_14.31.352x.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RZRKJPR2%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T092444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDh8ELRErs%2BnVayhtWhwzhHT6iT10IJZI8%2Ftrr8WLeUNgIhAOUjNLJQv2xytIvEemy%2FirJ%2FzOzPV14ip2ZReIO2WhZ3Kv8DCAIQABoMNjM3NDIzMTgzODA1IgxLleixjyQ2yELr2bcq3APT51Bem2RvAE%2F1JEIdVHqsZNsVzsdSYxTzJG%2FAp09bxGa2xecGlJwdFCz2oIDjfpiGU9RZ7h7ncAdLYBgtyjXoIL0hr0L2F6kLoSr7yX3%2F%2FtG8AinU7LvQLjsgQJutxBwpKzBPotl0g4n5XSiVbrw6ZuhTM3%2F6gW%2FyI0qMhDUDnqQ8BFiIsTQab0hlhhDkC9dUWdv%2F6qPH9a8AOVAVSUzWrqO5GdulxO6R0IPoS9Gkb3T%2FieFbcZMR7Z98zdkTjKmEi6dXMoWoO%2BJIvUKjL1IdqyjpmXP9DqU7ZKdCGwZSl8Fk82uFPQy4%2BChOkPo0NrVrQgGvbk6TTsqGmDjHTZiO1%2BskwE%2FHwUAsKMR1nksYfJn74ElE0ResT%2BumFacgChQgjNR7EtIx3UbCFoe3VNgvooFe6xlrI85iu5J0tr6VL2Pzrst3YFTNiMMdKC2cyEafj6uLwNond8sFo4GZvh3va3wOAYN2h5NVzN2GQzUFk5A7d0sGIexq0klMricpzkdZqruBN1NMwqaQ2JUpQxDL4VEPb8L3xFZn9SIWh%2BnGNDyxlyNXBiJFRjRXqznfPjxJP3fyqyvdF8cMb2mchxkJ87CdDgA1oCFsZ7Nlg6uOojAaztBq1DEg5PKgXDDI5MDMBjqkAe8ujgdCVRRt4WRBAZhGR4A2rHkw8BKGh%2Brw4DSqX7%2FlI1k4mJHeqfbiYv4ad4uUV%2FW1Uyhc0U6m8ZUgM1OLFgbG9Xn5xn%2BxAytK4FhLc0Nsrxdl9WAdtL4mKVp9xfZIOYlS5FeizArQkUqHb5JT%2BGsG0kv6oEgQz1WYyXbBowxujzJsJEhTeG7B%2BxMOn39qOH87BqWpIkKciK6ahrTHtHegxZAy&X-Amz-Signature=e7e9c11742578f8811a010351333f2e09ae0a88d67351472fca14a1443e43740&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

スクリプトファイルを編集するエディタです。ここでRコードを書いて保存できます。プログラムを書く際のメインの作業スペースです。

ここで書いたコードはファイルとして保存されるので、実行したら毎回履歴を見て同じコードを実行する必要がなくなります。

## 2. Console（コンソール） - 左下

Rコマンドを直接実行できる対話型の環境です。簡単な計算や、コードの動作確認に使います。

ここにスクリプトファイルで書いたコードなどを入力するとコードを実行できます。

## 3. Environment/History（環境/履歴） - 右上

現在読み込まれている変数やデータを確認できます。どんなデータが使えるか、一目で確認できて便利です。

## 4. Files/Plots/Packages/Help（ファイル/プロット/パッケージ/ヘルプ） - 右下

ファイル管理、グラフの表示、パッケージの管理、ヘルプドキュメントの表示など、多機能なペインです。

# 実際に使ってみよう

## スクリプトファイルの作成

まず、新しいスクリプトファイルを作成してみましょう：

スクリプトファイルにはコードを書いて保存、そのまま実行ができます。



コンソールでRのコードを書いて直接書く方法とスクリプトファイルにlog(履歴)を保存しながら分析する方法があります。

```r
# メニューから: File > New File > R Script
# ショートカット: Cmd + Shift + N
```

## コードの実行方法

RStudioでは、コードを実行する方法が複数あります：

- **1行だけ実行**: カーソルを置いて `Cmd + Enter`
- **選択範囲を実行**: 実行したい部分を選択して `Cmd + Enter`
- **ファイル全体を実行**: `Cmd + Shift + Enter`
## Consoleでの基本操作

ターミナルではないので注意

Consoleペインで、以下のような基本的な操作を試してみましょう：

```r
# 簡単な計算
2 + 2

# 変数の作成
x <- 10
y <- 20

# データフレームの作成
df <- data.frame(
  name = c("A", "B", "C"),
  value = c(1, 2, 3)
)

# データの確認
View(df)  # データをスプレッドシート形式で表示
head(df)  # 最初の数行を表示

# プロット（グラフ）の作成
plot(1:10, 1:10)
```

## パッケージのインストールと読み込み

Rの機能を拡張するパッケージも簡単に使えます：

```r
# パッケージのインストール（最初の1回だけ）
install.packages("ggplot2")

# パッケージの読み込み（使う度に必要）
library(ggplot2)
```

# 覚えておくと便利なショートカットキー

作業効率を上げるために、以下のショートカットキーを覚えておくと便利です：

- `Cmd + Enter` - コード実行
- `Cmd + Shift + N` - 新規スクリプト作成
- `Cmd + S` - ファイルを保存
- `Tab` - オートコンプリート（入力補完）
- `Cmd + Shift + C` - コメントアウト/解除
- `Cmd + 1` - Sourceペインにフォーカス
- `Cmd + 2` - Consoleペインにフォーカス
# プロジェクト機能で作業を整理しよう

複数のファイルやデータを扱う場合は、プロジェクト機能を使うことを強くおすすめします。プロジェクトを作成すると、関連するファイルを一箇所にまとめて管理でき、作業ディレクトリの設定も自動的に行われます。

**プロジェクトの作成方法：**

```javascript
File > New Project > New Directory > New Project
```

プロジェクト名とフォルダの場所を指定すれば、すぐに作業を始められます。

# まとめ

RStudioは、R言語での開発を快適にする素晴らしいツールです。この記事で紹介した基本的な使い方をマスターすれば、データ分析やプログラミングの学習がぐっと楽になるはずです。

最初は画面が複雑に見えるかもしれませんが、使っていくうちに各ペインの役割が自然と理解できるようになります。まずは簡単なコードから試してみて、少しずつRStudioに慣れていきましょう！

Happy Coding! 

