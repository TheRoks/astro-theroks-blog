import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import { SITE, BLOG } from "~/config.mjs";
import { fetchPosts } from "~/utils/blog";
import { getPermalink } from "~/utils/permalinks";

export async function GET({ site }: APIContext) {
  if (BLOG.disabled) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const posts = await fetchPosts();

  return rss({
    title: `${SITE.name}’s Blog`,
    description: SITE.description,
    site: String(site ?? import.meta.env.SITE),

    items: posts.map((post) => ({
      link: getPermalink(post.slug, "post"),
      title: post.title,
      description: post.description,
      pubDate: post.publishDate,
    })),

    trailingSlash: SITE.trailingSlash,
  });
}
