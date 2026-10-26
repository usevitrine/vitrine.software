// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';

// vitrine.software: fully static (every page rendered to HTML at build time), served by Cloudflare Workers. The app
// itself is the submodule app/: the site uses its components (Svelte, rendered to HTML) and code, not copies.
export default defineConfig({
  site: 'https://vitrine.software',
  trailingSlash: 'never',
  build: { format: 'file' }, // (/demo.html served as /demo: no trailing slashes, one URL per page)
  integrations: [svelte(), sitemap({ filter: (page) => !page.endsWith('/404') })],
  image: { layout: 'constrained', responsiveStyles: true },
});
