import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const post = defineCollection({
  // Content Layer API: Load all markdown and MDX files from the post directory
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/post"
  }),
  // Enhanced schema with better validation
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // For now, keep image as string to support existing public folder images
    // TODO: Migrate images to src/assets/ and use image() helper
    image: z.string().optional(),

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
