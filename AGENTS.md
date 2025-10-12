# AI agents guide for this repo

## What this is

This document explains how AI coding agents should work in this repository to automate tasks, keep quality high, and stay aligned with our Astro setup and content standards.

The project is an Astro 5.x site with Tailwind CSS and the Content Layer API for Markdown/MDX posts, organized as a **PNPM workspace** with multiple apps and shared packages.

### Key references in this repo

- Astro standards: `.github/instructions/astro.instructions.md`
- Markdown/content rules: `.github/instructions/markdown.instructions.md`
- Accessibility guidance: `.github/instructions/a11y.instructions.md`

Node requirement: use Node 22+ (see `package.json` engines). Use pnpm for commands (pnpm-lock.yaml present).

## Project layout (quick map)

**Workspace Structure**: This is a PNPM workspace with multiple apps and packages.

- **Workspace Root**:
  - `pnpm-workspace.yaml` — workspace configuration
  - `package.json` — root workspace scripts and dev dependencies
  
- **apps/blog/**: Main Astro blog application (work here for blog changes)
  - `src/content/post/` — MD/MDX posts loaded via Content Layer API (see `src/content/config.ts`)
  - `src/components/` — UI components and islands
  - `src/layouts/` — page and markdown layouts
  - `src/pages/` — route files (Astro pages and endpoints)
  - `src/assets/` — local images and styles for bundling
  - `public/` — static files served as-is (e.g., `public/assets/images/...`)
  - `astro.config.mjs`, `tsconfig.json`, `tailwind.config.cjs` — app-specific config

- **packages/**: Shared workspace packages
  - `config/` — shared tooling configurations (ESLint, Prettier, Tailwind)
  - `ui/` — shared UI components (Logo, CustomStyles)
  - `types/` — shared TypeScript definitions

**Note**: The blog application is now in `apps/blog/` directory. All content, component, and asset paths are relative to `apps/blog/`.

## What agents should do

When making changes, prefer server-rendered Astro components and minimal client JS. Follow the repo instructions linked above.

- Content authoring
  - Add new posts under `apps/blog/src/content/post/` using MD/MDX.
  - Validate frontmatter fields against `apps/blog/src/content/config.ts` schema: title, optional description/image/canonical/publishDate/draft/excerpt/category/tags/author.
  - Follow `.github/instructions/markdown.instructions.md` for headings, code blocks, links, images (alt text required), and structure.
  - Place large/static images in `apps/blog/public/assets/images/...` and reference via absolute path (`/assets/images/...`).

- Components and pages
  - Add or update `.astro` files in `apps/blog/src/components` and `apps/blog/src/pages`.
  - Use islands only when interactivity is required; pick the lightest hydration strategy (`client:idle`, `client:visible`, etc.).
  - Keep CSS scoped; prefer Tailwind utility classes where appropriate.

- Accessibility and SEO
  - Build with accessibility in mind per `.github/instructions/a11y.instructions.md` (landmarks, focus order, labels, color contrast, skip links, etc.).
  - Add descriptive alt text for informative images; hide decorative images from assistive tech.
  - Ensure semantic headings and a single logical H1 per page.

- Images and performance
  - Optimize images and use responsive strategies where possible.
  - Default to zero JS; only add interactivity when needed.

- Code style
  - Run `pnpm format` before committing. Enforce ESLint rules as defined in `eslint.config.mjs`.

## Commands agents should use

Run these from the repo root with pnpm:

- Start dev server: `pnpm dev`
- Build site: `pnpm build`
- Preview build: `pnpm preview`
- Lint code: `pnpm lint`
- Format code: `pnpm format`
- Typecheck: `pnpm typecheck`
- Astro utilities (e.g., sync types): `pnpm astro sync`

**Workspace-specific commands:**
- Run command in blog app: `pnpm --filter @repo/blog <command>`
- Run command in all packages: `pnpm -r <command>`

## Definition of done (quality gates)

Before considering a task complete, ensure all of the following pass locally:

1. Build: PASS (`pnpm build`)
2. Lint: PASS (`pnpm lint`)
3. Typecheck: PASS (`pnpm typecheck`)
4. Preview sanity: run `pnpm preview` and spot-check key routes
5. Accessibility: built with accessibility in mind and sanity-checked with a tool like Accessibility Insights

If you change public behavior, update or add minimal docs in the repo to explain the change.

## Common tasks playbook

- Add a new blog post
  1. Create `apps/blog/src/content/post/my-post-slug.mdx` (or `.md`).
  2. Include frontmatter fields per `apps/blog/src/content/config.ts` and markdown guidelines.
  3. Add images under `apps/blog/public/assets/images/my-post-slug/` and reference with `/assets/images/...` paths.
  4. Run: `pnpm astro sync` (if types change), `pnpm lint`, `pnpm typecheck`, `pnpm build`.

- Create a new component
  1. Add `apps/blog/src/components/MyComponent.astro`.
  2. Keep it server-rendered by default; add hydration only if necessary.
  3. Include prop types and sensible defaults.
  4. Verify usage in a page or layout and run the quality gates.

- Update site styles
  1. Prefer local component styles or Tailwind utilities.
  2. Ensure color contrast meets WCAG 2.2 AA.
  3. Validate no regressions in preview.

## Contribution workflow for agents

1. Create a descriptive branch name, e.g., `feat/content-new-post-slug` or `fix/layout-header-skiplink`.
2. Make focused commits with clear messages.
3. Ensure the Definition of Done gates all pass.
4. Open a pull request describing the change, affected areas, and any a11y/SEO considerations.

## Notes on accessibility

This guide and any code generated were created with accessibility in mind, but issues may still exist. Please review changes manually and test with tools like Accessibility Insights.

## Local setup (for humans and agents)

Clone and install dependencies:

```bash
git clone https://github.com/TheRoks/astro-theroks-blog.git
cd astro-theroks-blog
pnpm install
```

Then start developing with `pnpm dev`.
