import { z, defineCollection } from "astro:content";

const post = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),

    canonical: z.string().url().optional(),

    // Accept ISO date strings or Date objects and coerce to Date
    publishDate: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => (typeof val === "string" ? new Date(val) : val)),

    draft: z.boolean().optional().default(false),

    excerpt: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
  }),
});

export const collections = {
  post: post,
};
