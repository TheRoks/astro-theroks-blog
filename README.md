# TheRoks Blog

A modern Astro 5.x blog built with a PNPM workspace structure for better code organization and maintainability.

## 🏗️ Workspace Structure

This project uses a **PNPM workspace** to organize code into logical packages:

```
astro-theroks-blog/
├── apps/
│   └── blog/                    # Main Astro blog application
│       ├── src/
│       ├── public/
│       ├── astro.config.mjs
│       └── package.json
├── packages/
│   └── config/                  # Shared configurations (ESLint, Prettier, Tailwind)
│       ├── eslint.config.mjs
│       ├── prettier.config.js
│       ├── tailwind.config.js
│       └── package.json
├── pnpm-workspace.yaml          # Workspace configuration
└── package.json                 # Workspace root
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 22+ (see `package.json` engines field)
- **pnpm**: 10.18.2+ (managed via `packageManager` field)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TheRoks/astro-theroks-blog.git
cd astro-theroks-blog
```

2. Install dependencies:
```bash
pnpm install
```

### Development

Start the development server:
```bash
pnpm dev
```

The blog will be available at `http://localhost:4321`

## 📜 Available Scripts

All commands are run from the **workspace root**:

| Command | Action |
| ------- | ------ |
| `pnpm dev` | Start development server |
| `pnpm build` | Build the blog for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint across the workspace |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm astro` | Run Astro CLI commands |

### Working with the Blog App

To run commands specifically in the blog app:
```bash
# From workspace root
pnpm --filter @repo/blog <command>

# Or navigate to the app
cd apps/blog
pnpm <command>
```

## 🏗️ Workspace Details

### Root Package (`@repo/astro-theroks-blog`)

The workspace root manages:
- Shared development dependencies (ESLint, Prettier, TypeScript)
- Workspace-level scripts that delegate to packages
- PNPM workspace configuration

### Blog App (`@repo/blog`)

The main Astro application at `apps/blog/`:
- All blog content, pages, and components
- App-specific dependencies (Astro, integrations, etc.)
- Uses shared config from `@repo/config`

### Config Package (`@repo/config`)

Shared tooling configurations at `packages/config/`:
- ESLint configuration for consistent code quality
- Prettier configuration for code formatting
- Tailwind CSS base configuration
- Consumed by apps via workspace references

## 📝 Content Management

Blog posts are located in `apps/blog/src/content/post/` and use Astro's Content Layer API.

See [AGENTS.md](./AGENTS.md) for detailed content authoring guidelines.

## 🧪 Quality Gates

Before considering changes complete, ensure all checks pass:

1. **Build**: `pnpm build` ✅
2. **Lint**: `pnpm lint` ✅
3. **Type Check**: `pnpm typecheck` ✅
4. **Preview**: `pnpm preview` and spot-check

## 🤝 Contributing

1. Create a descriptive branch (e.g., `feat/new-post`, `fix/styling`)
2. Make focused commits with clear messages
3. Ensure all quality gates pass
4. Open a pull request describing changes

See [AGENTS.md](./AGENTS.md) for detailed contribution guidelines and AI agent instructions.

## 📚 Technologies

- **[Astro 5.x](https://astro.build/)** - Static site generator
- **[Tailwind CSS 4.x](https://tailwindcss.com/)** - Utility-first CSS
- **[PNPM](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[MDX](https://mdxjs.com/)** - Markdown with components

## 📄 License

This project is private and maintained by [TheRoks](https://theroks.com).

## 🔗 Links

- **Website**: [theroks.com](https://theroks.com)
- **Repository**: [github.com/TheRoks/astro-theroks-blog](https://github.com/TheRoks/astro-theroks-blog)
