import { defineConfig } from 'astro/config';
import { remarkModifiedTime } from './src/utils/remark-modified-time.mjs';

import preact from "@astrojs/preact";
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
  site: 'https://leeskii.github.io',
  base: '/blog',
  integrations: [preact()],
  markdown: {
    remarkPlugins: [remarkModifiedTime],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          content: { type: 'text', value: ' 🔗' }
        }
      ],
    ]
  },
});