セットアップ手順
1. リポジトリをクローン
git clone https://github.com/2004kou/Next.js-Blog.git
cd Next.js-Blog
2. 依存関係のインストール
npm install
3. 環境変数の設定

.env ファイルを作成し、以下を記載してください。

DATABASE_URL="file:./dev.db"
4. データベース作成
npx prisma migrate dev
5. 開発サーバー起動
npm run dev

ブラウザで以下にアクセス：

http://localhost:3000
テスト実行
npm test[](url)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
