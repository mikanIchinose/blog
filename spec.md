# 個人ブログ 技術構成まとめ

## スタック概要

| 項目 | 技術・サービス | 備考 |
|------|--------------|------|
| フレームワーク | Astro | ブログ特化・JS最小出力 |
| ホスティング | Cloudflare Pages | 無料・CDN高速 |
| メディア管理 | ローカル管理から開始 | 後から移行可能な設計 |
| アナリティクス | Cloudflare Web Analytics | cookie不使用・無料 |
| コンテンツ管理 | GitHub + Markdown | CMS不要 |
| ドメイン | まずは `yoursite.pages.dev` | 後からカスタムドメイン追加可能 |

---

## フレームワーク：Astro

- ブログ用途に特化した静的サイトジェネレーター
- デフォルトでJavaScriptをほぼ出力しないため表示が高速
- React / Vue などのコンポーネントをそのまま持ち込める
- MDXサポートあり（MarkdownにReactコンポーネントを埋め込める）
- Content Collectionsによるファイルベースのコンテンツ管理

```bash
# プロジェクト作成
pnpm create astro@latest my-blog
# → "blog" テンプレートを選ぶ
```

---

## ホスティング：Cloudflare Pages

- 無料プランで運用可能
- GitHubリポジトリと連携し `git push` で自動デプロイ
- Cloudflare CDNによる高速配信
- カスタムドメイン・HTTPSの自動設定に対応

---

## コンテンツ管理：GitHub + Markdown

```
src/content/blog/
├── 2024-01-15-first-post.md
├── 2024-02-03-second-post.md
└── 2024-03-10-third-post.md
```

記事のメタ情報はfrontmatterで管理：

```markdown
---
title: "記事タイトル"
date: 2024-01-15
tags: ["雑記", "技術"]
draft: false
---

本文をここに書く...
```

- 記事数が1000本を超えてもGitHub管理で問題なし
- 不便を感じた時点でヘッドレスCMS（Contentful・Sanity・Tina CMS等）へ移行可能

---

## メディア管理：アダプターパターン

環境変数1つで切り替えられる設計にしておくことで、無料運用から有料サービスへスムーズに移行できる。

```ts
// src/lib/media.ts
export function getImageUrl(path: string, options?: { width?: number }) {
  switch (import.meta.env.MEDIA_BACKEND) {
    case 'cloudinary': {
      const transforms = options?.width ? `w_${options.width},f_webp/` : '';
      return `https://res.cloudinary.com/${import.meta.env.CL_CLOUD_NAME}/image/upload/${transforms}${path}`;
    }
    case 'cloudflare':
      return `${import.meta.env.CF_IMAGES_BASE_URL}${path}`;
    case 'r2':
      return `${import.meta.env.R2_PUBLIC_URL}/${path}`;
    case 'bunny':
      return `${import.meta.env.BUNNY_CDN_URL}/${path}`;
    default: // local
      return `/images/${path}`;
  }
}
```

### メディアバックエンドの選択肢

| サービス | 無料枠 | 料金 | 特徴 |
|---------|--------|------|------|
| ローカル（初期） | ✅ 無料 | 無料 | public/フォルダに配置 |
| Cloudinary | ✅ 25GB/月 | $89/月〜 | 変換機能が豊富・個人ブログなら長期無料 |
| Cloudflare Images | ❌ | $5/月〜 | CDN統合・自動WebP変換 |
| R2 + Workers | ✅ 10GB/月 | $0.015/GB〜 | Cloudflareエコシステム統合 |
| Bunny.net | ❌ | $0.01/GB〜 | 従量制で安い |

### 動画の扱い

- 基本はYouTube限定公開 → `<iframe>` embed（無料）
- 自前ホスティングが必要な場合はCloudflare Stream（$5/月〜）

---

## アナリティクス：Cloudflare Web Analytics

- cookie不使用のためGDPR対応不要
- Cloudflare Pagesダッシュボードから即座に有効化可能
- 追加コストなし

```astro
<!-- src/layouts/BaseLayout.astro -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

取得できる主なデータ：

- ページビュー数・ユニーク訪問者数
- 人気記事ランキング
- 流入元（検索・SNS・直接アクセス）
- 国・地域・デバイス・ブラウザ

---

## 初期セットアップで入れるもの

| 項目 | 方法 | 目的 |
|------|------|------|
| RSSフィード | `@astrojs/rss` プラグイン | 読者の購読対応 |
| OGP設定 | BaseLayoutのmeta tags | SNSシェア時のカード表示 |
| サイトマップ | `@astrojs/sitemap` プラグイン | Google検索インデックス対応 |
| canonical URL | BaseLayoutのlink tag | 重複コンテンツ回避 |
| カスタム404ページ | `src/pages/404.astro` | 離脱防止 |
| draft機能 | frontmatterの `draft: true` | 下書き管理 |

---

## ドメイン

- 初期は `yoursite.pages.dev` で運用（無料）
- カスタムドメインは後からいつでも追加可能
- Cloudflare Registrarで取得するとDNS設定が自動完結（年間1,500〜2,000円程度）
- HTTPSは自動設定

---

## フォルダ構成

```
my-blog/
├── public/
│   └── images/            # メディアファイル（初期）
├── src/
│   ├── content/
│   │   └── blog/          # Markdownで記事を書く
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   └── BlogImage.astro
│   ├── lib/
│   │   ├── media.ts        # メディアアダプター
│   │   └── analytics.ts    # アナリティクス設定
│   └── pages/
│       ├── index.astro
│       ├── blog/
│       │   └── [...slug].astro
│       ├── rss.xml.ts
│       └── 404.astro
├── astro.config.mjs
├── pnpm-lock.yaml
└── .env
```

---

## 環境変数の管理

Claude Codeを使った開発を想定し、機密情報がAIに読み取られないよう管理を分離する。

### ファイル構成

```
my-blog/
├── .env                      # Git管理OK・機密情報なし
├── .env.local                # Git管理外・Claude Code管理外・機密情報はここ
├── .env.example              # 必要な変数名だけ書いたサンプル（Git管理OK）
├── .gitignore
└── .claude/
    └── settings.json         # Claude Codeのアクセス制限設定
```

### `.env` に書いて良いもの（機密情報なし）

```bash
# 公開しても問題ない設定値のみ
MEDIA_BACKEND=local
ANALYTICS_BACKEND=cloudflare
PUBLIC_SITE_URL=https://yoursite.pages.dev
```

### `.env.local` に書くもの（機密情報）

```bash
# ローカル開発用の機密情報
CF_IMAGES_BASE_URL=
CF_IMAGES_API_KEY=
CL_CLOUD_NAME=
CF_ANALYTICS_TOKEN=
```

### `.claude/settings.json` の設定（Claude Codeのアクセス制限）

```json
{
  "permissions": {
    "deny": [
      "Read(./.env.local)",
      "Read(./.env.*.local)"
    ]
  }
}
```

このファイル自体はGit管理してチームで共有できる。

### `.gitignore` に追記

```bash
.env.local
.env.*.local
```

### `.env.example`（変数名のドキュメント用・Git管理OK）

```bash
# このファイルをコピーして .env.local を作成し、値を埋めてください
MEDIA_BACKEND=
CF_IMAGES_BASE_URL=
CF_IMAGES_API_KEY=
CL_CLOUD_NAME=
CF_ANALYTICS_TOKEN=
```

### 本番環境の機密情報

本番の機密情報はCloudflare Pagesのダッシュボードに直接入力する。ファイルには一切残らない。

```
Cloudflare Pages → プロジェクト → Settings → Environment variables
```

### まとめ

| 情報の種類 | 保存場所 |
|-----------|---------|
| 公開しても良い設定値 | `.env`（Git管理） |
| ローカルの機密情報 | `.env.local`（`.claudeignore` で除外） |
| 本番の機密情報 | Cloudflare Pagesの環境変数 |
| 変数名のドキュメント | `.env.example`（Git管理） |

---

## コスト試算

| 項目 | 初期 | 将来（移行後） |
|------|------|--------------|
| ホスティング | 無料 | 無料 |
| メディア | 無料 | Cloudinary無料枠 or $5〜/月 |
| アナリティクス | 無料 | 無料 |
| ドメイン | 無料（pages.dev） | 1,500〜2,000円/年 |
| **合計** | **¥0/月** | **¥0〜¥700/月程度** |
