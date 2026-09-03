# Markdown for agents

The blog is authored in Markdown and the build emits a clean `.md` sibling for every published article. For example:

```text
https://theroks.com/git-worktrees-and-ai-agents
https://theroks.com/git-worktrees-and-ai-agents.md
```

Article HTML advertises the sibling with `rel="alternate"` and `type="text/markdown"`. The generated Markdown contains the article title, summary, headings, links, code blocks, lists, tables, and images without site navigation or YAML front matter.

## Canonical URL negotiation

The site is deployed as a static Astro build on Cloudflare Pages. To serve Markdown from the canonical article URL, enable Cloudflare's **Markdown for Agents** setting for the production domain. Cloudflare can then inspect `Accept: text/markdown`, return the generated Markdown representation, set the Markdown content type, and keep the HTML and Markdown variants separate at the edge.

Verify the deployed behavior with:

```sh
curl -sSI -H "Accept: text/markdown" https://theroks.com/git-worktrees-and-ai-agents/
```

The response should include `Content-Type: text/markdown` and `Vary: Accept`. A normal browser request must continue to receive `text/html`.
