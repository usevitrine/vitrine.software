// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// vitrine.software: fully static (every page rendered to HTML at build time), served by Cloudflare Workers.
export default defineConfig({
  site: 'https://vitrine.software',
  trailingSlash: 'never',
  build: { format: 'file' }, // (/demo.html served as /demo: no trailing slashes, one URL per page)
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') })],
  image: { layout: 'constrained', responsiveStyles: true },
});
