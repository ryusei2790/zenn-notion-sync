---
title: "LoRA"
emoji: "📝"
type: "tech"
topics: ["AI"]
published: true
---

# 1) 各ターゲット層の役割と LoRA を当てた時の効き方

## Self-Attention 系

- `**q_proj**`**（Query）**
  入力隠れ状態から「いま注目したい問い（Query）」ベクトルを作る線形射。

  **LoRAの効果**：どこを注視するかの“視線”が変わる → 文脈の拾い方・手順の追従性が強くなる。

  **実務感**：一番効きやすい。最小構成ならまず `q_proj`。

- `**k_proj**`**（Key）**
  参照側の特徴（Key）。Query から見て「一致度を測る相手」。

  **LoRAの効果**：一致度の地図そのものを描き換える。

  **実務感**：`q_proj`とセットで効くことも多いが、単体でのコスパはやや劣る。迷ったら後回しでもOK。

- `**v_proj**`**（Value）**
  実際に取り出す内容（Value）の射。

  **LoRAの効果**：どの情報を持ち帰るか（出力へ渡す具体的な中身）が変わる → 語彙や表現の出力が寄る。

  **実務感**：`q_proj`と並んで効きが良い。小規模 LoRA なら `q+v` が定番。

- `**o_proj**`**（Output / attn_out）**
  ヘッドを結合した後の線形射。

  **LoRAの効果**：取ってきた情報の“混ぜ方”を最終段で調整。

  **実務感**：`q,v` に比べるとマイルドだが、**出力の安定**や**文体寄せ**に地味に効く。

## MLP（FFN）系（SwiGLU/GEGLU 前提の命名）

- `**gate_proj**`**（ゲート）**
  活性化（SwiGLU/GEGLU）のゲート分岐を作る射。

  **LoRAの効果**：どの特徴を強調/抑制するかの“選別”が変わる。

  **実務感**：文体・口調・定型表現のクセを強く寄せたい時に効く。

- `**up_proj**`**（拡張）**
  次元を `hidden_dim → intermediate_dim` に持ち上げる射。

  **LoRAの効果**：抽象特徴の展開の仕方が変わる。

  **実務感**：新しい表現・言い回し・専門語の使い回しが入りやすい。

- `**down_proj**`**（縮約）**
  `intermediate_dim → hidden_dim` に戻す射。

  **LoRAの効果**：展開した特徴をどの軸で主成分化して返すかが変わる。

  **実務感**：最終的な“出力ノリ”を整える。`up/down` は対で入れると効きが出やすい。

> ざっくり：

- **理解・手順の改善**を最小コストで狙う → `q_proj`（＋`v_proj`）
- **文体/レトリック/定型**も寄せたい → **MLP（三点セット：`gate/up/down`）**も足す
- **総合力を引き上げる** → `q,k,v,o` ＋ `gate,up,down` の“全部のせ”
---

# 2) どれを当てるかの実務プリセット

---

# 3) 追加の実践知（効き方・コスト・副作用）

- **学習安定性**：`q+v` は安定しやすい。`k` を足すと効果は上がる一方、過適合の兆候が早めに出ることがある。
- **文体寄せ**：MLP（三点セット）が強い。FAQ 口調化・敬体/常体の統一など。
- **ドメイン語彙**：MLP でしっかり寄る。アテンションだけだと“使うべき単語”の濃度は薄く残ることがある。
- **長文一貫性**：`q,k,v,o` を含めた方が良い（段落間の参照が改善）。
- **計算/VRAM**：LoRA 追加パラメータは線形層ごとに **約 **`**r*(in+out)**`。
  - 例：`hidden_dim = 4096, r=16` の `q_proj`（in=4096, out=4096）なら **約 131,072 params**。
  - これが各ブロック×(対象層数)だけ積み上がるので、**対象を絞るほど軽く**なる。
---

# 4) モデルごとの命名差と安全な指定法

同じ概念でも実装名が違うことがあります。

- **LLaMA/Mistral/Qwen**：`q_proj/k_proj/v_proj/o_proj`、`gate_proj/up_proj/down_proj` がほぼ共通。
- **GPT-NeoX 系**：`attention.query_key_value`（QKV結合）や `dense` など。
- **GPT-2/3 風**：`attn.c_attn`（QKV結合）、`attn.c_proj`、`mlp.c_fc` / `mlp.c_proj` など。
### モジュール名の自動検出パターン（Transformers）

```python
import re
import torch
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-1.5B-Instruct")

wanted = [
    r"\.q_proj$", r"\.k_proj$", r"\.v_proj$", r"\.o_proj$",
    r"\.gate_proj$", r"\.up_proj$", r"\.down_proj$",
    r"attn\.c_attn$", r"attn\.c_proj$", r"mlp\.c_fc$", r"mlp\.c_proj$",
    r"attention\.query_key_value$", r"attention\.dense$"
]
pat = re.compile("|".join(wanted))

for name, module in model.named_modules():
    if isinstance(module, torch.nn.Linear) and pat.search(name):
        print(name)


```

出力を見て `target_modules` を**実際のモデル名に合わせて**確定させるのが安全策です。

---

# 5) 迷った時の指針（あなたのユースケース向け）

- **指示追従・RAG整合性**をまず確かめたい → `["q_proj","v_proj"]`（r=8〜16）
- **文体/レジスタ**まで寄せたい → 上に `**"gate_proj","up_proj","down_proj"**` を追加
- **長文の推論品質/整合**を上げたい → `k` と `o` も足して `**q,k,v,o + gate,up,down**`
- **VRAM きつい** → `q_proj` 単独 → 次に `v_proj` を追加 → 必要に応じて MLP を少しずつ




# LoRA のターゲット層になり得る部分

## 1. **埋め込み関連**

- `**word_embeddings**`**（token embedding）**
  - 単語 ID → ベクトル。
  - 新しい語彙や専門用語を学習させたいならここも対象。
  - ただしパラメータが大きいので軽量チューニングの旨味は薄め。
- `**position_embeddings**`**（位置埋め込み）**
  - 文章の順序情報。
  - LoRA で調整することは稀だが、特殊フォーマット（数式やコード）の順序最適化に研究事例あり。
---

## 2. **正規化や出力関連**

- `**layernorm**`**（LayerNorm）**
  - 正規化のスケール・バイアスを LoRA で微調整する研究もある。
  - 効きは小さいが学習が安定する場合あり。
- `**lm_head**`**（最終出力層 / decoder head）**
  - 隠れ状態 → 語彙確率分布。
  - 出力表現そのものをチューニング。
  - **分類タスク適応**や**語尾/文体寄せ**ではここ単独で効くこともある。
---

## 3. **Attention のバリエーション**

- `**qkv_proj**`**（QKVをまとめて線形変換する実装）**
  - GPT-2/NeoX 系では `q_proj/k_proj/v_proj` が一つにまとめられている。
  - LoRA を当てると「Q, K, V まとめて」適応。
- `**attn.c_attn**`** / **`**attn.c_proj**`**（GPT-2系の命名）**
  - Hugging Face 実装の GPT 系ではこちらが多い。
---

## 4. **特殊モジュール**

- **Adapter 層や MoE 専用層**
  - 一部モデル（Mixtral, Switch Transformer）には「expert 層」がある。
  - そこを LoRA 対象にすることで専門的表現の切り替えを学習可能。
- **クロスアテンション層（マルチモーダルモデル）**
  - 画像や音声との接続部（`cross_attn`）にも LoRA を挿すことができる。
  - LLaVA, BLIP-2 などのビジョン+言語モデルで有効。
---

# 学習データ

# 1) 指示追従 SFT（いちばん汎用）

**狙い**：プロンプト→要求理解→創作の流れを覚えさせる。

**ポイント**：システムで役割・文体を固定、ユーザーで指示、アシスタントで“応答例”を入れる。

```json
{"messages":[
  {"role":"system","content":"あなたはモダン小説家。静けさと余韻を大切に書く。"},
  {"role":"user","content":"冬の朝をテーマに、200～300字、叙情的な短章を書いて。最後は比喩で締めて。"},
  {"role":"assistant","content":"（完成テキスト）"}
]}


```

---

# 2) 条件付きスタイル制御（属性タグを使う）

**狙い**：長さ・人称・語尾・温度感などを**明示指示**でコントロールできるように。

**実装**：条件をJSONにまとめて1つのターンで渡す。

```json
{"messages":[
  {"role":"system","content":"あなたはモダン小説家"},
  {"role":"user","content":"{ \"theme\":\"駅の朝\", \"person\":\"一人称\", \"tone\":\"静か\", \"length\":\"200-250字\", \"ending\":\"余韻\" } の条件で短編を書いて"},
  {"role":"assistant","content":"（条件を満たす本文）"}
]}


```

---

# 3) 下書き→推敲（リライト指示）

**狙い**：推敲・改善スキルを学習（語彙密度/テンポ/比喩改良）。

**コツ**：**批評＋修正版**の両方を入れると効果的。

```json
{"messages":[
  {"role":"system","content":"あなたは小説編集者兼作家"},
  {"role":"user","content":"この草稿を『テンポを少し上げ、重複を削り、最後に余韻』で直して：\n（草稿）"},
  {"role":"assistant","content":"【改善点】…\n【改稿】（改稿本文）"}
]}


```

---

# 4) A/B 好み学習（DPO/Preference 用）

**狙い**：**どちらが良いか**の嗜好を学ばせる（DPO/ORPO/KTO 等）。

**形式**：SFTとは別フォーマットで作ることが多い（フレームワーク依存）。例（擬似）：

```json
{"prompt":"『夜の公園で…』を200字で",
 "chosen":"（良い方の出力）",
 "rejected":"（惜しい/悪い出力）"}


```

> 作り方：自動生成→自己評価（ルーブリックで採点）→上位をchosen、下位をrejected。

---

# 5) 格付け/スコアリング（RM学習や評価器）

**狙い**：良し悪しの**連続値**を学ぶ。

**用途**：出力の再ランキングや自己改善に効く。

```json
{"prompt":"『古いホテルのピアノ』を短章で",
 "response":"（モデル出力）",
 "scores":{"style":4,"coherence":5,"originality":3,"instruction_following":5}}


```

---

# 6) コンテキスト根拠つき生成（RAG想定）

**狙い**：**与えた資料に忠実**な生成を覚えさせる（幻覚抑制）。

**方法**：userに「資料」「質問」を入れ、assistantが出典に沿って書く。

```json
{"messages":[
  {"role":"system","content":"資料に忠実に、創作へ最小限に転写せよ"},
  {"role":"user","content":"#資料\n（短いノーツ）\n#指示\n資料の情景だけを使い120〜180字の掌編に"},
  {"role":"assistant","content":"（資料の要素だけで書いた短編）"}
]}


```

---

# 7) FIM/インフィル（穴埋め学習：AST-FIM も可）

**狙い**：途中を**綺麗に補完**する力。文中の一部欠落を埋める。

**形式**：前後文脈＋空所に入るテキストを学習。

```json
{"messages":[
  {"role":"system","content":"<PRE>と<POST>の間を<INFILL>で埋める作家"},
  {"role":"user","content":"<PRE>夜の公園でブランコに座る。<GAP></GAP><POST>彼は未来の放送だと言った。"},
  {"role":"assistant","content":"<INFILL>（空所に入る文）</INFILL>"}
]}


```

---

# 8) 構成分解（アウトライン→本文）

**狙い**：**設計→執筆**の二段階を覚える（長文一貫性UP）。

**手順**：見出しやビート（起承転結）を先に作らせてから本文。

```json
{"messages":[
  {"role":"system","content":"あなたは構成から書く作家"},
  {"role":"user","content":"テーマ：『瓶の手紙』。3ビートのアウトライン→本文200字"},
  {"role":"assistant","content":"【アウトライン】1)… 2)… 3)…\n【本文】（完成）"}
]}


```

---

# 9) スタイル転写（作風A→作風B）

**狙い**：**同内容**を別の作風へ。著作権/固有名詞には注意。

**作り方**：あなたの自作AをBのトーンに変換する指示にする。

```json
{"messages":[
  {"role":"system","content":"比喩を増やし、短い行分けで再表現する作家"},
  {"role":"user","content":"この段落を『呼吸感を大きく、行間を作る』方針で転写：\n（自作テキスト）"},
  {"role":"assistant","content":"（転写後）"}
]}


```

---

# 10) 否応答・ガードレール（拒否の仕方を学習）

**狙い**：**不適切な指示を上手に断る**＋安全な代案提示。

**効果**：運用時の安定性UP。

```json
{"messages":[
  {"role":"system","content":"安全と倫理を優先する作家"},
  {"role":"user","content":"実在の作家Xの文体を完全模倣して"},
  {"role":"assistant","content":"そのままの模倣はできません。代わりに『静かな比喩』『余韻』といった特徴を踏まえたオリジナル短章を書きます…\n（代替の本文）"}
]}


```





## 1. 現在のLLMが使う代表的な学習データ種別

### 🔹 プレトレーニング（事前学習）

- **Webスケールコーパス**
  - Common Crawl, C4, Pile、RedPajama など → 数兆トークン規模
  - ノイズ除去（重複・スパム・品質フィルタリング）を徹底
- **高品質テキスト**
  - 書籍（Project Gutenberg, academic books）
  - 論文（arXiv, PubMed）
  - コード（GitHub, StackOverflow）
👉 この段階では **単純な next-token prediction**。chat形式ではなく「文章を丸ごと食わせる」。

---

### 🔹 指示追従（Instruction Tuning / SFT）

- **人間が書いた高品質QAペア**
  - OpenAI は社内ラベル付けチーム＋外注（スケーラブルな annotation ops）
  - Meta, Anthropic も専任 annotator あり
- **合成データ**（効率化の鍵）
  - 教師モデル（GPT-4 クラス）で指示データを自動生成
  - フィルタリング＋リライトで質を担保
  - 「self-instruct」「Alpaca」「Magpie」系の発展形
👉 最近は **合成＋人間少量検証** が主流。

いまユーザーが持っている “identity” データは、この中の **SFT形式の一部** に相当する。

---

### 🔹 Preference / Alignment

- **DPO（Direct Preference Optimization）**
  - プロンプト＋ (良い出力, 悪い出力) のペア
  - 人間の好みを直接学習（RLHFより効率的）
- **ORPO/KTO**
  - 片側のみのフィードバックでも学習可能にした新手法
- **人間評価データ**
  - 数十万～数百万ペア規模（OpenAI, Anthropic）
---

### 🔹 RAG/文脈強化

- **文書＋質問→回答** データ
  - grounded QA（引用必須・出典指示）
  - Hallucination 減らす工夫
---

## 2. 効率化の最新手法

1. **合成データ生成**
  - 大規模教師モデルを使って膨大に作る → 小さいモデルを蒸留
  - 例：OpenAI “self-play”、DeepSeek の自己蒸留
1. **フィルタリング＆リミックス**
  - コントラストペア（良いvs悪い）を自動生成して DPO 学習
  - 低品質はLLMに自動評価させて間引く
1. **Curriculum 学習**
  - 難易度順にタスクを与える（算数→代数→証明 など）
1. **Multimodal 合成**
  - テキスト＋画像キャプション、コード＋実行結果
  - LLaVA, Gemini, GPT-4o で採用
1. **効率的フォーマット**
  - JSON chat より **圧縮フォーマット（sharegpt, alpaca style）** を使う
  - → メモリ/トークン消費を減らす工夫がされている
---

## 3. まとめると

- あなたの今のデータ（`system/user/assistant`で一対一）は **SFTの基本形**。
- でも最近のLLMはそれに加え：
  - **巨大な事前学習コーパス**（Web+Books+Code）
  - **教師モデルによる自動合成データ**
  - **人間フィードバック（DPO等）**
  - **RAG強化・マルチモーダル**
    を組み合わせ、効率化＋高品質化を実現してます。

> 本記事は、ローカル環境でLoRA（主にQLoRA）を実行するための手順書です。環境構築から学習・推論・評価、よくあるトラブルとFAQまでを一通りまとめています。

---

## 目次

- 概要と想定読者
- ハードウェアとOS要件
- ドライバとCUDA、PyTorchの対応表とインストール手順
- Python環境（conda/venv）構築
- 依存ライブラリのインストール
- データ準備（SFT形式とバリエーション）
- 学習（QLoRA＋FFN対象）サンプルスクリプト
- 複数GPUや分散（Accelerate/FSDP）
- 推論（LoRAアダプタの適用）
- 評価と簡易ベンチ（品質チェック）
- 運用Tips（再現性・ログ・チェックポイント）
- トラブルシューティング
- FAQ
- まとめ（最短フロー）
---

## 概要と想定読者

- 目的: 自分のPC（ローカルGPU）でLoRA学習を回し、推論まで動かす。
- 想定読者: CUDAやPyTorchをある程度触ったことがあり、LoRAの基本を理解したい個人開発者や学生。
- 成果物: 学習済みLoRAアダプタ（PEFT形式）と動作する推論コード。
---

## ハードウェアとOS要件

- GPU: NVIDIA（例）RTX 3090/4090, A5000 など（VRAM 16GB以上推奨。QLoRAなら12GBでも工夫で可）
- CPU/RAM: 8C/32GB以上が快適（最小でも16GB）
- OS: Ubuntu 22.04 LTS 推奨（WindowsはWSL2でも可、MacはMetalで制約あり）
- ストレージ: 200GB以上の空き（モデル・データ・チェックポイント）
---

## ドライバとCUDA、PyTorchの対応表とインストール手順

- NVIDIA Driver: 推奨は 535+（RTX40系）または環境に合わせて最新安定版。
- CUDA Toolkit: 12.x 推奨（PyTorchビルドと合わせる）。
- PyTorch: 2.3+ を推奨（pip/condaでCUDA対応ビルドを選択）。
例（Ubuntu, conda）：

```bash
# NVIDIA Driver はOSの推奨手順で導入（省略）
# conda 環境作成
conda create -n lora python=3.10 -y
conda activate lora

# PyTorch (CUDA 12.1 ビルド例) ※公式サイトのコマンドジェネレータで要確認
pip install --upgrade pip
pip install torch torchvision torchaudio --index-url [https://download.pytorch.org/whl/cu121](https://download.pytorch.org/whl/cu121)

# 検証
python - << 'PY'
import torch
print('torch', torch.__version__)
print('cuda?', [torch.cuda.is](http://torch.cuda.is/)_available())
print('device count', torch.cuda.device_count())
print('capability', torch.cuda.get_device_capability() if [torch.cuda.is](http://torch.cuda.is/)_available() else None)
PY
```

---

## Python環境（conda/venv）構築

- 専用の仮想環境を作り、依存解決を閉じ込める。
- 代替として `python -m venv .venv && source .venv/bin/activate` でもOK。
---

## 依存ライブラリのインストール

```bash
pip install transformers==4.42.0 accelerate==0.33.0 peft==0.12.0 trl==0.9.6 datasets==2.20.0
pip install bitsandbytes==0.43.3 sentencepiece evaluate scipy tqdm safetensors
```

- 注意: bitsandbytes はGPUアーキにより相性があるため、エラー時はバージョンを前後させる。
---

## データ準備（SFT形式とバリエーション）

最小はShareGPT/Alpaca系の会話JSONL。例：

```json
{"messages":[
  {"role":"system","content":"あなたは◯◯ドメインの厳密な回答者。根拠は文章からのみ。"},
  {"role":"user","content":"第3章の◯◯について説明して"},
  {"role":"assistant","content":"…独自資料に基づく模範解答…"}
]}
```

- ポイント
  - systemで方針を固定し、userで指示、assistantで模範解答。
  - packing（短サンプルをまとめる）をONにして高速化・安定化。
  - ドメイン語彙を寄せたい場合は、MLP層をLoRA対象に含めると効きやすい。
---

## 学習（QLoRA＋FFN対象）サンプルスクリプト

```python
# train_ffn_lora_[local.py](http://local.py/)
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model
from trl import SFTTrainer, SFTConfig
import torch, json

MODEL_NAME = "Qwen/Qwen2.5-1.5B-Instruct"   # 例。任意のOSSモデルへ変更
DATA_PATH  = "train.jsonl"

tok = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=True)
if tok.pad_token is None:
    tok.pad_token = tok.eos_token

# QLoRA: 4bit 量子化で省メモリ
bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    quantization_config=bnb,
    torch_dtype=torch.bfloat16,
    device_map="auto",
)

# LoRA 対象：まずは FFN（LLaMA系）
lora = LoraConfig(
    r=8, lora_alpha=16, lora_dropout=0.05,
    target_modules=["gate_proj","up_proj","down_proj"],
    task_type="CAUSAL_LM",
)
model = get_peft_model(model, lora)

# JSONL ロード
samples = [json.loads(l) for l in open(DATA_PATH, "r", encoding="utf-8").read().splitlines()]

cfg = SFTConfig(
    output_dir="outputs_ffn_lora",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=16,
    learning_rate=1e-4,
    lr_scheduler_type="cosine",
    warmup_ratio=0.05,
    logging_steps=10,
    save_steps=200,
    bf16=True,
    packing=True,
    max_seq_length=2048,
)

trainer = SFTTrainer(
    model=model,
    tokenizer=tok,
    train_dataset=samples,
    dataset_text_field=None,
    formatting_func=None,
    args=cfg,
)
trainer.train()
[trainer.save](http://trainer.save/)_model("outputs_ffn_lora")  # LoRA アダプタ保存
```

実行：

```bash
python3 train_ffn_lora_[local.py](http://local.py/)
```

- NeoX/GPT系などで命名が異なる場合：`print(model)` でモジュール名を確認し `target_modules` を調整。
---

## 複数GPUや分散（Accelerate/FSDP）

```bash
accelerate config   # 初回のみ
accelerate launch --num_processes 2 train_ffn_lora_[local.py](http://local.py/)
```

- さらに大きいモデルでは FSDP/DeepSpeed ZeRO-3 を検討。
---

## 推論（LoRAアダプタの適用）

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import torch

base = "Qwen/Qwen2.5-1.5B-Instruct"
tok = AutoTokenizer.from_pretrained(base, use_fast=True)
model = AutoModelForCausalLM.from_pretrained(base, load_in_4bit=True, device_map="auto")
model = PeftModel.from_pretrained(model, "outputs_ffn_lora").to(torch.bfloat16)

prompt = "独自資料の◯◯について根拠を述べて回答してください。"
ids = tok(prompt, return_tensors="pt").to(model.device)
out = model.generate(**ids, max_new_tokens=300)
print(tok.decode(out[0], skip_special_tokens=True))
```

---

## 評価と簡易ベンチ（品質チェック）

- 目視チェック：代表プロンプト50本でBefore/After比較。
- 自動評価：`evaluate`＋ルーブリック（例：指示遵守、事実整合、文体一致）をスコア化。
- 迷ったらDPO用に A/B ペアを作って好み学習。
---

## 運用Tips（再現性・ログ・チェックポイント）

- 乱数固定（seed）、依存バージョンを`requirements.txt`に固定。
- `accelerate config`や`torch.cuda.get_device_name()`等の環境情報をログに残す。
- チェックポイントは `save_steps` を適度に。最良モデルの保存と破棄ポリシーを決める。
---

## トラブルシューティング

- CUDA OOM：`per_device_train_batch_size`↓、`gradient_accumulation_steps`↑、`max_seq_length`↓、`r`を8に。
- bitsandbytesエラー：バージョンを変える、`pip install --no-cache-dir bitsandbytes==0.42.0` 等。
- モジュール名不一致：`print(model)` で線形層名を確認し `target_modules` を実機に合わせる。
- 生成が崩れる：`target_modules` に `lm_head` を追加、学習率を下げる、エポック数やサンプル品質を見直す。
- 収束しない：`lr=5e-5〜2e-4`をスイープ、`epochs=2–4`で調整、packingをON。
---

## FAQ

- Q. 何GBのVRAMが必要？
  - A. QLoRAなら12GBでも実行可。余裕を持つなら16〜24GB。
- Q. 学習時間の目安は？
  - A. 1.5B〜7Bで数万トークン・数エポックなら数分〜数十分（GPUとI/Oで変動）。
- Q. 文体も強く寄せたい。
  - A. FFN（三点セット gate/up/down）を対象に含める。語彙や口癖の寄りが強くなる。
- Q. 事実性を上げたい。
  - A. LoRAはスタイル寄せが得意。事実はRAGを併用。
---

## まとめ（最短フロー）

1) ドライバ・CUDA・PyTorchを適合させる

2) 仮想環境＋依存導入

3) データ（JSONL）を整える

4) 学習スクリプト実行（QLoRA＋packing ON）

5) 推論でLoRAアダプタ適用

6) 評価して調整（学習率・対象層・r など）



