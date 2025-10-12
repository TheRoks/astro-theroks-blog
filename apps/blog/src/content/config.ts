import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const post = defineCollection({
  // Content Layer API: Load all markdown and MDX files from the post directory
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/post",
  }),
  // Enhanced schema with image helper for optimized images
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      // Images can be either:
      // 1. String paths (for public folder: /assets/images/... or external URLs)
      // 2. Image imports (for src/assets/: ./image.png or relative paths)
      // Order matters: string is checked first, so public URLs work as-is
      image: z
        .union([
          z.string(), // First: accept string paths (public folder or URLs)
          image(), // Second: accept image imports (src/assets/ - for future use)
        ])
        .optional(),

      canonical: z.string().url().optional(),

      // Use coerce.date() for consistent date parsing
      publishDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),

      excerpt: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).default([]),
      author: z.string().default("TheRoks"),
    }),
});

export const collections = {
  post: post,
};
