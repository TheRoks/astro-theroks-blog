import type { APIRoute } from "astro";

import { SITE } from "~/config.mjs";

export const GET: APIRoute = () => {
  const robotsTxt = `user-agent: *
allow: /
sitemap: ${SITE.origin}/sitemap-index.xml`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
