# Copilot instructions (Astro TheRoks blog)

Project snapshot

- Astro 5.x (static output), Tailwind CSS v4, TypeScript, MD/MDX content via Content Collections
- Package manager: pnpm, Node >= 22 (see package.json engines)
- Path alias: `~` => `./src` (see `astro.config.mjs` Vite resolve)

Architecture and where things live

- Content: `src/content/post/**` (see `src/content/config.ts` for schema). Use frontmatter fields: `title`, optional `description`, `image` (string URL or import), `canonical`, `publishDate`, `draft`, `excerpt`, `category`, `tags`, `author`.
- Pages: `src/pages/**` (e.g., `index.astro`, dynamic blog routes under `src/pages/[...blog]/**`).
- Layouts: `src/layouts/**` (e.g., `PageLayout.astro` used by pages; pass a `meta` object).
- Components: `src/components/**` (blog list/detail, pagination, etc.). Prefer server-rendered islands, minimal hydration.
- Utils: `src/utils/blog.ts` (load/normalize posts) and `src/utils/permalinks.ts` (never handcraft URLs; use helpers).

Key patterns to follow

- Server-first: default to static HTML; add client directives only when needed (`client:idle`, `client:visible`).
- Permalinks: generate/resolve links via `getPermalink(slug, type)`, `getBlogPermalink()`; the post pattern comes from `BLOG.post.permalink` in `src/config.mjs` and `POST_PERMALINK_PATTERN` in `src/utils/permalinks.ts`.
- Images: reference large/static images from `public/assets/images/...` using absolute paths (`/assets/images/...`).
- Content types: run `pnpm astro sync` if you change content schema to refresh generated types.
- Imports: use `~` alias, e.g. `import { BLOG, SITE } from "~/config.mjs"`.
- Markdown/MDX: rehype plugins add slugs, anchor links, and external-link icons; specify language on code fences.

Developer workflow

- Local: `pnpm dev` (http://localhost:4321), `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm preview`, `pnpm format`/`pnpm format:check`.
- CI (see `.github/workflows`): PR validation runs format check, lint, typecheck, and build. Match these locally before pushing.
- Definition of Done: Build/Lint/Typecheck PASS, preview sanity check, and create with accessibility in mind (`.github/instructions/a11y.instructions.md`).

Common tasks (examples)

- New post: add `src/content/post/my-post-slug.mdx` with frontmatter; place images under `/public/assets/images/my-post-slug/` and reference via `/assets/images/...`.
- Linking to a post in components:
  ```astro
  ---
  import { getPermalink } from '~/utils/permalinks';
  const href = getPermalink(post.permalink, 'post');
  ---
  <a href={href}>{post.title}</a>
  ```
- Page meta usage (excerpt from `index.astro`): set `meta` and pass to `PageLayout.astro`.

Local standards to consult

- Astro: `.github/instructions/astro.instructions.md`
- Markdown: `.github/instructions/markdown.instructions.md`
- Accessibility: `.github/instructions/a11y.instructions.md`
- TypeScript: `.github/instructions/typescript.instructions.md`

Notes

- Output mode is static; prefetching is enabled on hover (see `astro.config.mjs`).
- Analytics via Partytown and GA may be forwarded; avoid breaking external script forwarding.