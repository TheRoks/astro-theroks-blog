# TheRoks Astro Blog - PNPM Workspace

This repository is organized as a PNPM workspace containing multiple applications and shared packages for better code organization and maintainability.

## 📁 Repository Structure

```
astro-theroks-blog/
├── pnpm-workspace.yaml       # Workspace configuration
├── package.json              # Root workspace package.json
├── apps/
│   └── blog/                 # Main Astro blog application
│       ├── src/              # Blog source code
│       ├── public/           # Static assets
│       ├── astro.config.mjs  # Astro configuration
│       └── package.json      # Blog dependencies
├── packages/
│   ├── config/               # Shared configurations (ESLint, Prettier, Tailwind)
│   ├── ui/                   # Shared UI components
│   └── types/                # Shared TypeScript types
└── node_modules/             # Hoisted dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22 (see `package.json` engines)
- pnpm >= 10.18.2

### Installation

```bash
# Clone the repository
git clone https://github.com/TheRoks/astro-theroks-blog.git
cd astro-theroks-blog

# Install all dependencies
pnpm install
```

## 📜 Available Commands

Run these commands from the repository root:

### Development

```bash
# Start development server for the blog
pnpm dev

# Start development server (alternative)
pnpm start
```

### Build & Preview

```bash
# Build the blog for production
pnpm build

# Preview the production build
pnpm preview
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Format all files
pnpm format

# Check formatting without changes
pnpm format:check

# Type check all packages
pnpm typecheck
```

### Astro Utilities

```bash
# Run Astro CLI commands (e.g., sync types)
pnpm astro sync
pnpm astro --help
```

### Workspace Management

```bash
# Clean all build outputs and node_modules
pnpm clean

# Reinstall all dependencies
pnpm install:all
```

## 📦 Workspace Packages

### Apps

- **`@repo/blog`** - Main Astro blog application
  - Location: `apps/blog/`
  - Commands: `pnpm --filter @repo/blog <command>`

### Packages

- **`@repo/config`** - Shared tooling configurations
  - ESLint configuration
  - Prettier configuration
  - Tailwind CSS configuration

- **`@repo/ui`** - Shared UI components
  - Reusable Astro components
  - Common UI elements

- **`@repo/types`** - Shared TypeScript definitions
  - Common type definitions
  - Type utilities

## 🛠️ Development Workflow

### Working on the Blog

```bash
# From repository root
pnpm dev

# Or work directly in the blog directory
cd apps/blog
pnpm dev
```

### Running Commands for Specific Packages

```bash
# Run a command in a specific package
pnpm --filter @repo/blog <command>

# Example: Build only the blog
pnpm --filter @repo/blog build
```

### Running Commands in All Packages

```bash
# Run a command in all packages recursively
pnpm -r <command>

# Example: Type check all packages
pnpm -r typecheck
```

## 📝 Key Features

- **PNPM Workspace**: Efficient dependency management with hoisting
- **Astro 5.x**: Modern static site generation with islands architecture
- **Tailwind CSS v4**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **Content Collections**: Type-safe content management with Astro's Content Layer API
- **MDX Support**: Enhanced Markdown with JSX
- **Code Quality**: ESLint, Prettier, and TypeScript for consistent code

## 🎯 Definition of Done

Before considering a task complete, ensure:

1. ✅ Build passes: `pnpm build`
2. ✅ Lint passes: `pnpm lint`
3. ✅ Type check passes: `pnpm typecheck`
4. ✅ Preview works: `pnpm preview` (spot-check key routes)
5. ✅ Accessibility: Built with accessibility in mind

## 📚 Documentation

- **AGENTS.md**: Guide for AI coding agents working in this repository
- **`.github/instructions/`**: Detailed instructions for specific technologies
  - `astro.instructions.md` - Astro development guidelines
  - `markdown.instructions.md` - Markdown content rules
  - `a11y.instructions.md` - Accessibility guidelines
  - `typescript.instructions.md` - TypeScript development standards

## 🤝 Contributing

1. Create a descriptive branch name (e.g., `feat/new-feature` or `fix/bug-name`)
2. Make focused commits with clear messages
3. Ensure all quality gates pass (build, lint, typecheck)
4. Test accessibility with tools like [Accessibility Insights](https://accessibilityinsights.io/)
5. Open a pull request with a clear description

## 📄 License

This project is private and not licensed for public use.

## 🔗 Links

- [Astro Documentation](https://docs.astro.build/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PNPM Workspace Documentation](https://pnpm.io/workspaces)
