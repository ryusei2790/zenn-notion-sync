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



![](https://prod-files-secure.s3.us-west-2.amazonaws.com/82eee7c2-babd-4ec3-ad7c-a809c691efb9/e3f209a2-54a4-4fce-a559-aab51c5b0c6d/CleanShot_2026-02-14_at_14.30.212x.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TOLUUALZ%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T212953Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEI3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDyhhRjvyTau8T%2B0h2gEeFnmgqWO%2BbQ8u3cH0fHpqjv9AIhAJErdXIJXHFgtVRUFhw6%2BH1XvjEX%2FPXva62ynCXHxhV1Kv8DCFYQABoMNjM3NDIzMTgzODA1Igy1dw0lcoEWC6%2BJ5IIq3AOkDKWZeYjt2XJJ41jDo77kH30kE74m7gcBliMm1DFt9u0Ql8CLzN2sMOy6c7zP45wKrI1ourLcwl%2Fk8cbDLgFIa%2BYikC38fjNemcNyUNI%2FwIhvySWt7xuYU%2BW6mmYojwG29bm41UwrfiIAztDW7Qp3hzLLd8qCaPyYBz1V%2Fp6RYi5QORe5VvsLSiOgh3Ev%2FSNkx3%2BYjcpR2JE7TCeFb%2B1UFxVgdI6BoTNITI3TCH5O5z8IQhqWSUoTNtrAMEPoOgpeRwqvcfE9SdGhbZNR8%2BzGlqpT%2B5xK9vrW1YOBCNv7SRVRt7GnjwjRUKOhzYBro1dFDw%2FMGeZemJoKGGzIdTYvgoGdnXn5wjcLJ2paFZgnUFi6j%2F90olyfTYxzn7f6bntjFhzyyjgf%2BlLKb9CRuyD6GDfqXuEMbAxvXnLdWlIdOl3vgT4aSJ3XfmzRNlvLtuIh0ZBkVpUyA3hPRLt4GalmmK4cfN7UvWqAVd83rkPt%2B4%2Fd%2Fk3Ae5giEwY80mRGi5HdaPKFD12efV3PxkJIh3hfYlo9r5xZQlJ7%2FH7vwoTdUZWSk6VnpZzN2OvPOdCFN0z8%2BffosB%2By1VRGIt%2Biio0Oj2WY8ESD%2BF8OVMu3tMkezQwQQnWhq87l48ldsTCqpNPMBjqkAb00iPMnGHh1mm4EJl43PGViSAsJOKGl2qc2H559Zc%2BETmMGzhSTlwPhqAERqPXqtX1QUftKa7iMaoKPYeKqek9Ya3lQp4vSYwNdry0akPmRKt6YVdcrih89w5ar6XG9IKd5LfDtyhQyN3B1OMvOcDbKtedKbMqRbuGLuSEQFRcnJ6caw%2Bp%2F8gAdWL3HdBL3ZmUKNfSyFWUWG2B%2BREUsWGCwN46r&X-Amz-Signature=c66c12cda156987633234e3f66163ab7e9d5059e53ad3173c93d7f3cd0ee7fff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/82eee7c2-babd-4ec3-ad7c-a809c691efb9/9cb0a3e2-463e-41d3-9d3b-f05ec8e93b57/first.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TOLUUALZ%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T212953Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEI3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDyhhRjvyTau8T%2B0h2gEeFnmgqWO%2BbQ8u3cH0fHpqjv9AIhAJErdXIJXHFgtVRUFhw6%2BH1XvjEX%2FPXva62ynCXHxhV1Kv8DCFYQABoMNjM3NDIzMTgzODA1Igy1dw0lcoEWC6%2BJ5IIq3AOkDKWZeYjt2XJJ41jDo77kH30kE74m7gcBliMm1DFt9u0Ql8CLzN2sMOy6c7zP45wKrI1ourLcwl%2Fk8cbDLgFIa%2BYikC38fjNemcNyUNI%2FwIhvySWt7xuYU%2BW6mmYojwG29bm41UwrfiIAztDW7Qp3hzLLd8qCaPyYBz1V%2Fp6RYi5QORe5VvsLSiOgh3Ev%2FSNkx3%2BYjcpR2JE7TCeFb%2B1UFxVgdI6BoTNITI3TCH5O5z8IQhqWSUoTNtrAMEPoOgpeRwqvcfE9SdGhbZNR8%2BzGlqpT%2B5xK9vrW1YOBCNv7SRVRt7GnjwjRUKOhzYBro1dFDw%2FMGeZemJoKGGzIdTYvgoGdnXn5wjcLJ2paFZgnUFi6j%2F90olyfTYxzn7f6bntjFhzyyjgf%2BlLKb9CRuyD6GDfqXuEMbAxvXnLdWlIdOl3vgT4aSJ3XfmzRNlvLtuIh0ZBkVpUyA3hPRLt4GalmmK4cfN7UvWqAVd83rkPt%2B4%2Fd%2Fk3Ae5giEwY80mRGi5HdaPKFD12efV3PxkJIh3hfYlo9r5xZQlJ7%2FH7vwoTdUZWSk6VnpZzN2OvPOdCFN0z8%2BffosB%2By1VRGIt%2Biio0Oj2WY8ESD%2BF8OVMu3tMkezQwQQnWhq87l48ldsTCqpNPMBjqkAb00iPMnGHh1mm4EJl43PGViSAsJOKGl2qc2H559Zc%2BETmMGzhSTlwPhqAERqPXqtX1QUftKa7iMaoKPYeKqek9Ya3lQp4vSYwNdry0akPmRKt6YVdcrih89w5ar6XG9IKd5LfDtyhQyN3B1OMvOcDbKtedKbMqRbuGLuSEQFRcnJ6caw%2Bp%2F8gAdWL3HdBL3ZmUKNfSyFWUWG2B%2BREUsWGCwN46r&X-Amz-Signature=2c210f367666f9a823f4e2751967d54f6afc3887918750bea44bb475a0ed4013&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

左上のプラスボタンを押すとR Scriptが出せるようになります・

スクリプトファイルを編集するエディタです。ここでRコードを書いて保存できます。プログラムを書く際のメインの作業スペースです。

ここで書いたコードはファイルとして保存されるので、実行したら毎回履歴を見て同じコードを実行する必要がなくなります。



## 2. Console（コンソール） - 左下

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/82eee7c2-babd-4ec3-ad7c-a809c691efb9/470268b8-159d-4fb4-a43c-7f801ee70570/second.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TOLUUALZ%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T212953Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEI3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDyhhRjvyTau8T%2B0h2gEeFnmgqWO%2BbQ8u3cH0fHpqjv9AIhAJErdXIJXHFgtVRUFhw6%2BH1XvjEX%2FPXva62ynCXHxhV1Kv8DCFYQABoMNjM3NDIzMTgzODA1Igy1dw0lcoEWC6%2BJ5IIq3AOkDKWZeYjt2XJJ41jDo77kH30kE74m7gcBliMm1DFt9u0Ql8CLzN2sMOy6c7zP45wKrI1ourLcwl%2Fk8cbDLgFIa%2BYikC38fjNemcNyUNI%2FwIhvySWt7xuYU%2BW6mmYojwG29bm41UwrfiIAztDW7Qp3hzLLd8qCaPyYBz1V%2Fp6RYi5QORe5VvsLSiOgh3Ev%2FSNkx3%2BYjcpR2JE7TCeFb%2B1UFxVgdI6BoTNITI3TCH5O5z8IQhqWSUoTNtrAMEPoOgpeRwqvcfE9SdGhbZNR8%2BzGlqpT%2B5xK9vrW1YOBCNv7SRVRt7GnjwjRUKOhzYBro1dFDw%2FMGeZemJoKGGzIdTYvgoGdnXn5wjcLJ2paFZgnUFi6j%2F90olyfTYxzn7f6bntjFhzyyjgf%2BlLKb9CRuyD6GDfqXuEMbAxvXnLdWlIdOl3vgT4aSJ3XfmzRNlvLtuIh0ZBkVpUyA3hPRLt4GalmmK4cfN7UvWqAVd83rkPt%2B4%2Fd%2Fk3Ae5giEwY80mRGi5HdaPKFD12efV3PxkJIh3hfYlo9r5xZQlJ7%2FH7vwoTdUZWSk6VnpZzN2OvPOdCFN0z8%2BffosB%2By1VRGIt%2Biio0Oj2WY8ESD%2BF8OVMu3tMkezQwQQnWhq87l48ldsTCqpNPMBjqkAb00iPMnGHh1mm4EJl43PGViSAsJOKGl2qc2H559Zc%2BETmMGzhSTlwPhqAERqPXqtX1QUftKa7iMaoKPYeKqek9Ya3lQp4vSYwNdry0akPmRKt6YVdcrih89w5ar6XG9IKd5LfDtyhQyN3B1OMvOcDbKtedKbMqRbuGLuSEQFRcnJ6caw%2Bp%2F8gAdWL3HdBL3ZmUKNfSyFWUWG2B%2BREUsWGCwN46r&X-Amz-Signature=76b01caaad7948b9f102e2de8664c92cf242e3dd2a0e2d4583890e55d3f0187d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

Rコマンドを直接実行できる対話型の環境です。簡単な計算や、コードの動作確認に使います。

ここにスクリプトファイルで書いたコードなどを入力するとコードを実行できます。

## 3. Environment/History（環境/履歴） - 右上

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/82eee7c2-babd-4ec3-ad7c-a809c691efb9/45691a3f-45a2-461b-8bcf-eedbc560c234/third.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TOLUUALZ%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T212953Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEI3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDyhhRjvyTau8T%2B0h2gEeFnmgqWO%2BbQ8u3cH0fHpqjv9AIhAJErdXIJXHFgtVRUFhw6%2BH1XvjEX%2FPXva62ynCXHxhV1Kv8DCFYQABoMNjM3NDIzMTgzODA1Igy1dw0lcoEWC6%2BJ5IIq3AOkDKWZeYjt2XJJ41jDo77kH30kE74m7gcBliMm1DFt9u0Ql8CLzN2sMOy6c7zP45wKrI1ourLcwl%2Fk8cbDLgFIa%2BYikC38fjNemcNyUNI%2FwIhvySWt7xuYU%2BW6mmYojwG29bm41UwrfiIAztDW7Qp3hzLLd8qCaPyYBz1V%2Fp6RYi5QORe5VvsLSiOgh3Ev%2FSNkx3%2BYjcpR2JE7TCeFb%2B1UFxVgdI6BoTNITI3TCH5O5z8IQhqWSUoTNtrAMEPoOgpeRwqvcfE9SdGhbZNR8%2BzGlqpT%2B5xK9vrW1YOBCNv7SRVRt7GnjwjRUKOhzYBro1dFDw%2FMGeZemJoKGGzIdTYvgoGdnXn5wjcLJ2paFZgnUFi6j%2F90olyfTYxzn7f6bntjFhzyyjgf%2BlLKb9CRuyD6GDfqXuEMbAxvXnLdWlIdOl3vgT4aSJ3XfmzRNlvLtuIh0ZBkVpUyA3hPRLt4GalmmK4cfN7UvWqAVd83rkPt%2B4%2Fd%2Fk3Ae5giEwY80mRGi5HdaPKFD12efV3PxkJIh3hfYlo9r5xZQlJ7%2FH7vwoTdUZWSk6VnpZzN2OvPOdCFN0z8%2BffosB%2By1VRGIt%2Biio0Oj2WY8ESD%2BF8OVMu3tMkezQwQQnWhq87l48ldsTCqpNPMBjqkAb00iPMnGHh1mm4EJl43PGViSAsJOKGl2qc2H559Zc%2BETmMGzhSTlwPhqAERqPXqtX1QUftKa7iMaoKPYeKqek9Ya3lQp4vSYwNdry0akPmRKt6YVdcrih89w5ar6XG9IKd5LfDtyhQyN3B1OMvOcDbKtedKbMqRbuGLuSEQFRcnJ6caw%2Bp%2F8gAdWL3HdBL3ZmUKNfSyFWUWG2B%2BREUsWGCwN46r&X-Amz-Signature=375d98b5996df6c2bc6cada999908afcd5b54b0604388996201d2ba6271a5989&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

現在読み込まれている変数やデータを確認できます。どんなデータが使えるか、一目で確認できて便利です。

## 4. Files/Plots/Packages/Help（ファイル/プロット/パッケージ/ヘルプ） - 右下

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/82eee7c2-babd-4ec3-ad7c-a809c691efb9/df9f7e3e-bd25-4162-952e-f74872c26f6d/forth.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TOLUUALZ%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T212953Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEI3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDyhhRjvyTau8T%2B0h2gEeFnmgqWO%2BbQ8u3cH0fHpqjv9AIhAJErdXIJXHFgtVRUFhw6%2BH1XvjEX%2FPXva62ynCXHxhV1Kv8DCFYQABoMNjM3NDIzMTgzODA1Igy1dw0lcoEWC6%2BJ5IIq3AOkDKWZeYjt2XJJ41jDo77kH30kE74m7gcBliMm1DFt9u0Ql8CLzN2sMOy6c7zP45wKrI1ourLcwl%2Fk8cbDLgFIa%2BYikC38fjNemcNyUNI%2FwIhvySWt7xuYU%2BW6mmYojwG29bm41UwrfiIAztDW7Qp3hzLLd8qCaPyYBz1V%2Fp6RYi5QORe5VvsLSiOgh3Ev%2FSNkx3%2BYjcpR2JE7TCeFb%2B1UFxVgdI6BoTNITI3TCH5O5z8IQhqWSUoTNtrAMEPoOgpeRwqvcfE9SdGhbZNR8%2BzGlqpT%2B5xK9vrW1YOBCNv7SRVRt7GnjwjRUKOhzYBro1dFDw%2FMGeZemJoKGGzIdTYvgoGdnXn5wjcLJ2paFZgnUFi6j%2F90olyfTYxzn7f6bntjFhzyyjgf%2BlLKb9CRuyD6GDfqXuEMbAxvXnLdWlIdOl3vgT4aSJ3XfmzRNlvLtuIh0ZBkVpUyA3hPRLt4GalmmK4cfN7UvWqAVd83rkPt%2B4%2Fd%2Fk3Ae5giEwY80mRGi5HdaPKFD12efV3PxkJIh3hfYlo9r5xZQlJ7%2FH7vwoTdUZWSk6VnpZzN2OvPOdCFN0z8%2BffosB%2By1VRGIt%2Biio0Oj2WY8ESD%2BF8OVMu3tMkezQwQQnWhq87l48ldsTCqpNPMBjqkAb00iPMnGHh1mm4EJl43PGViSAsJOKGl2qc2H559Zc%2BETmMGzhSTlwPhqAERqPXqtX1QUftKa7iMaoKPYeKqek9Ya3lQp4vSYwNdry0akPmRKt6YVdcrih89w5ar6XG9IKd5LfDtyhQyN3B1OMvOcDbKtedKbMqRbuGLuSEQFRcnJ6caw%2Bp%2F8gAdWL3HdBL3ZmUKNfSyFWUWG2B%2BREUsWGCwN46r&X-Amz-Signature=0e6781587d0d76f12bb3c6f4f68c18fb237580706aee31e8e72cea69eaa82f4e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

ファイル管理、グラフの表示、パッケージの管理、ヘルプドキュメントの表示など、多機能なペインです。





# 実際に使ってみよう

基本的に分析には左側のところだけをみておけば問題ないです。

(ソースとコンソールセクション)



## スクリプトファイルの作成

まず、新しいスクリプトファイルを作成してみましょう：

スクリプトファイルにはコードを書いて保存、そのまま実行ができます。



コンソールでRのコードを書いて直接書く方法とスクリプトファイルにlog(履歴)を保存しながら分析する方法があります。

※logっていうのは動かしたコマンドの履歴だと思ってください。

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

