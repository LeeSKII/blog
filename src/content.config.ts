// Import the glob loader
import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      isPublished: z.boolean(),
      description: z.string(),
      author: z.string(),
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
      tags: z.array(z.string()),
    }),
});

export const collections = {
  blog,
};
