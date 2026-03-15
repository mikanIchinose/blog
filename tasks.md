# ブログ構築タスク一覧

## Phase 1: Astroプロジェクトの初期セットアップ
- [x] `pnpm create astro@latest` でblogテンプレートからプロジェクト作成
- [ ] `astro.config.mjs` の基本設定
- [ ] `jj describe -m "feat: initialize Astro blog project"` && `jj new`

## Phase 2: コンテンツ管理の構築
- [ ] Content Collectionsの設定（`src/content/blog/` のスキーマ定義）
- [ ] frontmatter（title, date, tags, draft）のスキーマ設定
- [ ] サンプル記事の作成
- [ ] `jj describe -m "feat: configure content collections with blog schema"` && `jj new`

## Phase 3: レイアウト・ページ
- [ ] `BaseLayout.astro` — OGP meta tags, canonical URL 設定
- [ ] `index.astro` — トップページ
- [ ] `blog/[...slug].astro` — 記事詳細ページ
- [ ] `404.astro` — カスタム404ページ
- [ ] `jj describe -m "feat: add layouts and page routes"` && `jj new`

## Phase 4: プラグイン・SEO
- [ ] `@astrojs/rss` — RSSフィード（`rss.xml.ts`）
- [ ] `@astrojs/sitemap` — サイトマップ生成
- [ ] `jj describe -m "feat: add RSS feed and sitemap"` && `jj new`

## Phase 5: メディア・ユーティリティ
- [ ] `src/lib/media.ts` — メディアアダプター（初期はlocal）
- [ ] `src/components/BlogImage.astro` — 画像コンポーネント
- [ ] `jj describe -m "feat: add media adapter and BlogImage component"` && `jj new`

## Phase 6: アナリティクス
- [ ] Cloudflare Web Analytics のスクリプト埋め込み
- [ ] `jj describe -m "feat: add Cloudflare Web Analytics integration"` && `jj new`

## Phase 7: 環境変数・セキュリティ
- [ ] `.env` / `.env.example` / `.gitignore` の設定
- [ ] `.claude/settings.json` で `.env.local` へのアクセス制限
- [ ] `jj describe -m "chore: configure environment variables and security settings"` && `jj new`

## Phase 8: デプロイ設定
- [ ] Cloudflare Pagesとの連携設定（`@astrojs/cloudflare` アダプター）
- [ ] `jj describe -m "feat: add Cloudflare Pages deployment config"`
- [ ] `jj git push`
