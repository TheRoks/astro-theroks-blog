import type { APIContext } from "astro";

import { SITE } from "~/config.mjs";

export async function GET({ site }: APIContext) {
  const siteUrl = site ?? new URL(SITE.origin);

  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${new URL("sitemap-index.xml", siteUrl).href}
`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
