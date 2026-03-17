---
title: "Flask + MySQL ローカル開発環境構築ガイド：初心者が陥りやすいエラーと対処法"
emoji: "📝"
type: "tech"
topics: ["sql", "ローカル開発"]
published: true
---

最近, 「AI駆動」「バイブコーディング」と言った言葉が流行り、プログラミングを始める人が多いと思います。

どんどんアプリ開発が楽になり、個人生産性向上に繋げたいと思っている人も多いでしょう。



しかしここで落とし穴にハマるのが

- 業務効率化アプリを作りたいけど、うまくいかず結局、手作業の時間が圧迫されるだけ
- AIに任せてもうまくアプリを作れず頓挫する
こんな方が結構多いんじゃないかなと思います。



私自身、今になってやっと簡単なアプリはつまづかずに作れるようになったものの、うまくいかないことが大半でした。

ここで私が、なんとかうまくいき始めたコツ、方法を紹介して非エンジニアの方でもAIを利用して業務効率化させるための手助けができればと思います。

## はじめに

本記事では、Flask（Pythonの軽量Webフレームワーク）とMySQL（リレーショナルデータベース）を使用したWebアプリケーションのローカル開発環境を構築する手順を解説します。実際の開発で遭遇したエラーとその対処法も含めることで、初学者がスムーズに環境構築を完了できることを目指します。

### 構築する環境

- **バックエンド**: Flask 3.0.0 + Flask-Login（認証機能）
- **データベース**: MySQL 8.0
- **言語**: Python 3.9以上
- **デプロイ想定**: Google Cloud Run（本記事ではローカル環境のみ扱います）
---

## 1. プロジェクト構成

以下のような構造でプロジェクトを作成します：

```plain text
cloudrun-db-test/
├── app.py              # メインアプリケーション
├── database.py         # データベース接続・操作
├── auth.py             # 認証ロジック
├── check_db.py         # データベース接続確認スクリプト
├── create_admin.py     # 管理者ユーザー作成スクリプト
├── requirements.txt    # 依存パッケージ
├── .env                # 環境変数（DB接続情報）
└── templates/          # HTMLテンプレート

```

---

## 2. 環境構築の流れ

### 2.1 仮想環境のセットアップ

Pythonの仮想環境を作成し、依存関係を分離します：

```bash
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

```

**重要な依存パッケージ**:

- `Flask==3.0.0`: Webフレームワーク
- `PyMySQL==1.1.0`: MySQLドライバ
- `cryptography==41.0.7`: MySQL認証に必要
- `Flask-Login==0.6.3`: ユーザー認証管理
- `python-dotenv==1.0.0`: 環境変数管理
### 2.2 MySQLのセットアップ

macOSの場合、Homebrewを使用してMySQLをインストールします：

```bash
brew install mysql
brew services start mysql
mysql_secure_installation  # rootパスワード設定

```

データベースとユーザーを作成：

mysqlが起動しているコンソール上で

```sql
CREATE DATABASE testdb;
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON testdb.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;

```

### 2.3 環境変数の設定

`.env`ファイルを作成し、データベース接続情報を記載します：

```plain text
DB_HOST=localhost
DB_PORT=3306
DB_USER=appuser
DB_PASSWORD=secure_password
DB_NAME=testdb
SECRET_KEY=your-secret-key-here

```

**セキュリティ上の注意**: `.env`ファイルは`.gitignore`に追加し、リポジトリにコミットしないこと。

---

## 3. データベース設計

本アプリケーションでは以下の2つのテーブルを使用します：

### usersテーブル（ユーザー情報）

- `id`: 主キー
- `username`: ユーザー名（一意）
- `password_hash`: ハッシュ化されたパスワード
- `role`: ユーザーロール（admin/user）
- `created_at`: 作成日時
### itemsテーブル（アイテム情報）

- `id`: 主キー
- `name`: アイテム名
- `description`: 説明
- `user_id`: 作成ユーザーID（外部キー）
- `created_at`: 作成日時
テーブル初期化は`database.py`の`init_db()`関数で実行します。

---

## 4. 認証機能の実装

Flask-Loginを使用した基本的な認証フローを実装しました：

1. **パスワードハッシュ化**: `werkzeug.security`を使用
1. **セッション管理**: Flask-Loginのセッション管理機能を活用
1. **ロールベース権限**: admin/userの2段階権限設定
```python
# パスワードハッシュ化の例
from werkzeug.security import generate_password_hash, check_password_hash

password_hash = generate_password_hash('user_password')
is_valid = check_password_hash(password_hash, 'user_password')

```

---

## 5. 遭遇したエラーと対処法

開発中に遭遇した代表的なエラーとその解決策を紹介します。

### エラー1: `'cryptography' package is required`

**原因**: PyMySQLがMySQL 8.0の認証方式（caching_sha2_password）を使用する際に`cryptography`パッケージが必要だが、システムのPythonが参照されている。

**対処法**:

```bash
# 仮想環境のPythonを明示的に使用
./venv/bin/python check_db.py

# または、仮想環境がアクティブな場合はpythonコマンドを使用
python check_db.py  # python3 ではなく python

```

**学び**: 仮想環境を使用する場合、`python3`コマンドはシステムのPythonを参照する可能性があります。仮想環境のパッケージを確実に使用するには、`./venv/bin/python`で直接指定するか、`python`コマンドを使用してください。

### エラー2: `Table 'testdb.items' doesn't exist`

**原因**: データベースは作成されているが、テーブルが初期化されていない。

**対処法**:

```bash
# テーブル初期化を実行
./venv/bin/python -c "from database import init_db; init_db()"

# または check_db.py を実行（自動的にテーブルを作成）
./venv/bin/python check_db.py

```

**学び**: データベース作成とテーブル作成は別工程です。`CREATE DATABASE`だけでは不十分で、スキーマ定義（`CREATE TABLE`）が必要です。

### エラー3: `Can't connect to local MySQL server through socket '/tmp/mysql.sock'`

**原因**: MySQLサーバーが起動していない、または異なるソケットファイルを使用している。

**対処法**:

```bash
# MySQLサービスを再起動
brew services restart mysql

# ステータス確認
brew services list

# 起動確認
ps aux | grep mysql | grep -v grep

```

**学び**: macOSでは、MySQLのソケットファイルの場所が環境によって異なる場合があります（`/tmp/mysql.sock` vs `/var/run/mysqld/mysqld.sock`）。接続エラーが発生した場合は、まずMySQLサービスの起動状態を確認してください。

---

## 6. 動作確認とテスト

環境構築が完了したら、以下の手順で動作確認を行います：

```bash
# 1. データベース接続確認
./venv/bin/python check_db.py

# 2. 管理者ユーザー作成
./venv/bin/python create_admin.py

# 3. アプリケーション起動
./venv/bin/python app.py

```

ブラウザで`http://localhost:8080`にアクセスし、ログイン画面が表示されれば成功です。

---

## 7. トラブルシューティングのベストプラクティス

開発中にエラーが発生した際の対処フローを確立しておくことが重要です：

1. **エラーメッセージを正確に読む**: スタックトレースから原因を特定
1. **環境を確認**: 仮想環境がアクティブか、正しいPythonを使用しているか
1. **接続情報を検証**: `.env`ファイルの内容が正しいか
1. **サービス状態を確認**: MySQLが起動しているか
1. **ドキュメントを活用**: プロジェクト内の`TROUBLESHOOTING.md`を参照
本プロジェクトでは、`TROUBLESHOOTING.md`に詳細なエラー対処法をまとめています。

---

## まとめ

本記事では、Flask + MySQLのローカル開発環境構築手順と、実際に遭遇したエラーの対処法を解説しました。

### 重要なポイント

1. **仮想環境の正しい使用**: システムのPythonと仮想環境のPythonを区別する
1. **環境変数管理**: `.env`ファイルでDB接続情報を管理し、セキュリティを確保
1. **段階的な確認**: データベース接続 → テーブル作成 → アプリ起動の順で確認
1. **エラーログの活用**: MySQLのエラーログやPythonのスタックトレースを読む習慣
### 次のステップ

- **本番環境へのデプロイ**: Google Cloud Runへのデプロイ設定
- **CI/CDパイプライン**: GitHub Actionsを使用した自動デプロイ
- **テストコードの追加**: pytestを使用した単体テスト・統合テスト
- **ロギング改善**: 本番環境でのエラー追跡機能
---

## 参考資料

プロジェクト内のドキュメント:

- `QUICKSTART.md`: クイックスタートガイド
- `TROUBLESHOOTING.md`: 詳細なトラブルシューティング
- `MYSQL_SETUP.md`: MySQL環境構築詳細
- `AUTH_GUIDE.md`: 認証機能実装ガイド
公式ドキュメント:

- [Flask Documentation](https://flask.palletsprojects.com/)
- [PyMySQL Documentation](https://pymysql.readthedocs.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
---

**執筆者より**: 本記事は実際の開発経験に基づいています。環境構築で困った経験が、同じ課題に直面している方の助けになれば幸いです。

