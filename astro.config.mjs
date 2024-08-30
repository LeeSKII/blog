import { defineConfig } from "astro/config";
import { remarkModifiedTime } from "./src/utils/remark-modified-time.mjs";
import rehypeExternalLinks from "rehype-external-links";
import react from "@astrojs/react";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: "https://leeskii.github.io",
  base: "/blog",
  integrations: [react(), vue()],
  markdown: {
    remarkPlugins: [remarkModifiedTime],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          content: {
            type: "text",
            value: " 🔗",
          },
        },
      ],
    ],
  },
});
