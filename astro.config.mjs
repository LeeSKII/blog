import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
  site: 'https://leeskii.github.io',
  base: '/blog',
  integrations: [preact()],
  markdown: {
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