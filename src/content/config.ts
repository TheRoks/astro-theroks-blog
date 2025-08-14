import { z, defineCollection } from "astro:content";

// Use the `image` helper provided by `astro:content` so frontmatter-local images
// are resolved and validated for use with `astro:assets` Image/Picture components.
const post = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      image: image().optional(),

      canonical: z.string().url().optional(),

      publishDate: z.date().or(z.string()).optional(),
      draft: z.boolean().optional(),

      excerpt: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),
    }),
});

export const collections = {
  post: post,
};
