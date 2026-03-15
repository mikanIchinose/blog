// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: Cloudflareデプロイ後にsite URLを設定
  // site: 'https://example.com',
  integrations: [sitemap()],
});
