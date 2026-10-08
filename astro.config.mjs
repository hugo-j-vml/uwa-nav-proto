// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages serves this repo at https://hugo-j-vml.github.io/uwa-nav-proto/
export default defineConfig({
  site: 'https://hugo-j-vml.github.io',
  base: '/uwa-nav-proto',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
