![CI](https://github.com/yuichi-matsushima/constructflow-demo/actions/workflows/ci.yml/badge.svg)

# ConstructFlow

工務店(住宅・リフォーム施工会社)向けの業務管理システムのデモです。フリーランス転向にあたってのポートフォリオとして、要件定義から設計・実装・CIまで一人で作りました。

**本番デモ**: https://constructflow-demo.vercel.app
**リポジトリ**: https://github.com/yuichi-matsushima/constructflow-demo

> 掲載データはすべて架空のものです。実在の企業・個人とは関係ありません。

## これは何か

顧客・案件(施工プロジェクト)・見積もり・スケジュール・スタッフを一元管理する、工務店向けの業務システムを想定した架空デモです。実務でありがちな以下の業務フローを1つのアプリで再現しています。

- 顧客の新規登録 → 案件の起票 → 見積作成・提出 → 契約後の進捗管理(Kanban)→ 完了までの一連の流れ
- 案件コード・顧客コード・見積コードの自動採番(年度をまたいだ連番管理)
- 案件の進捗をKanbanボードでドラッグ&ドロップ管理
- ダッシュボードでの売上推移・進行中案件・見積状況のサマリー表示
- 画面右下のAIチャットアシスタントによる操作サポート

## なぜ作ったか

これまで受託開発で業務システムの構築に携わってきた経験をもとに、「フルスタックで要件定義から本番運用まで一人で完結できる」ことを示すために、あえて実務に近いドメイン(工務店の案件管理)を選びました。CRUDのToDoアプリではなく、コード採番・ステータス遷移・関連データの整合性といった、業務システム特有の面倒さに向き合える題材にしています。

## 技術選定とその理由

| 領域 | 採用技術 | 理由 |
| --- | --- | --- |
| フレームワーク | Next.js 16 (App Router) | Server Components / Server Actionsにより、クライアントにAPI層を持たずDBアクセスを完結させ、実装量とバグの温床を減らせるため |
| DB | Neon (Serverless Postgres) | ブランチ機能付きのサーバーレスPostgresで、デモ用途でもコールドスタート・コストを気にせず本番相当のRDBを使えるため |
| ORM | Drizzle ORM | 型安全なスキーマ定義とマイグレーション(`drizzle-kit`)を軽量に導入でき、生SQLに近い透明性を保てるため |
| UI | shadcn(base-ui) + Tailwind CSS v4 | コンポーネントをコピーして所有する思想により、デザインの自由度を保ちつつ実装速度を出せるため |
| DnD | dnd-kit | Kanbanボードのドラッグ&ドロップをアクセシブルかつ軽量に実装するため |
| グラフ | Recharts | 売上推移などのダッシュボード表示に、宣言的で扱いやすいチャートライブラリとして採用 |
| テスト | Vitest | コード採番ロジックなど、業務ルールが集中する純粋関数のユニットテストを高速に回すため |
| CI | GitHub Actions | 型チェック・テスト・ビルドをpush/PRごとに自動実行し、壊れた状態のコードをmainに残さないため |

## アーキテクチャの工夫点

- **Server Components + Server Actions中心の設計**: 一覧・詳細ページはServer Componentで直接Drizzleクエリを実行し、フォーム送信は`actions.ts`のServer Actionで完結させることで、クライアント側のフェッチ処理・状態管理コードを最小限に抑えています。
- **DBスキーマとモックデータの分離**: `src/db/schema.ts`(実際のテーブル定義)と`src/lib/mock-data.ts`(型定義・シード元データ)を分離し、`src/db/mappers.ts`でDB行 ↔ アプリ内の型を変換することで、UIコンポーネント側はDBの詳細を意識せずに済む構成にしています。
- **業務ロジックの純関数化**: 案件コード・顧客コード・見積コードの採番ルール(`src/lib/codes.ts`)を副作用のない純粋関数として切り出し、Vitestでユニットテストしています。業務システムで壊れやすい「採番」「連番」まわりを最優先でテスト対象にしました。
- **force-dynamicによるビルド時DB非依存化**: DBを使うページは`export const dynamic = "force-dynamic"`を明示し、`DATABASE_URL`が未設定のビルド環境(CIなど)でもビルドが通るようにしています。
- **loading.tsx / error.tsxによる体験の作り込み**: App Routerの規約ファイルで、DB読み込み中のスケルトンUIと、実行時エラー発生時のフォールバック画面を用意し、失敗時にも壊れて見えない状態を作っています。

## 見せ所

- **DB永続化**: フロントに閉じたモックではなく、Neon上のPostgresに実際に顧客・案件・見積データを保存・更新できます。新規登録・編集フォームはServer Action経由でDBに反映され、リロードしても消えません。
- **Kanbanボード**: 案件一覧を`施工中`などのフェーズごとにドラッグ&ドロップで移動でき、移動と同時にServer Action経由でステータスがDBに保存されます。
- **AIチャットアシスタント**: 画面右下のチャットウィジェットから、システムの使い方について質問できます。

## セットアップ

```bash
npm install

# .env.local に Neon の接続文字列を設定
# DATABASE_URL=postgres://...

npx drizzle-kit push   # スキーマをDBに反映
npx tsx src/db/seed.ts # サンプルデータを投入

npm run dev
```

http://localhost:3000 で起動します。

## その他コマンド

```bash
npx tsc --noEmit  # 型チェック
npx vitest run     # ユニットテスト
npm run build      # 本番ビルド(DATABASE_URL未設定でも通ります)
```
