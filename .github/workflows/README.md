# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Workflows

### 🔍 PR Validation (`pr-validation.yml`)

Runs on every pull request and push to `main` branch.

**What it does:**
- ✅ Code formatting check (`pnpm format:check`)
- ✅ Linting (`pnpm lint`)
- ✅ Type checking (`pnpm typecheck`)
- ✅ Production build (`pnpm build`)
- 📦 Build size reporting (on PRs)
- 💾 Artifact upload (build output)

**Features:**
- Parallel job execution for faster feedback
- Automatic cancellation of outdated runs
- Build artifact storage (7 days retention)
- PR comments with build size information

### 🔒 Dependency Review (`dependency-review.yml`)

Runs on every pull request to review dependency changes.

**What it does:**
- Scans for vulnerabilities in dependency changes
- Fails on moderate or higher severity issues
- Posts summary comments on PRs

### 🤖 Dependabot (`../dependabot.yml`)

Automated dependency updates configuration.

**What it does:**
- Weekly dependency updates (Mondays at 9 AM)
- Groups related packages together (Astro, ESLint, TypeScript, Tailwind)
- Automatic GitHub Actions updates
- Semantic commit messages with `chore(deps)` prefix

## Required Permissions

All workflows use minimal required permissions for security.

## Caching Strategy

- **pnpm cache**: Automatically handled by `setup-node@v4` with `cache: 'pnpm'`
- **Node modules**: Cached based on `pnpm-lock.yaml` hash
- **Build artifacts**: Stored for 7 days

## Performance Optimizations

1. **Concurrency control**: Cancels outdated workflow runs
2. **Frozen lockfile**: Ensures consistent installs with `--frozen-lockfile`
3. **Conditional jobs**: Build size check only runs on PRs

## Local Testing

You can run the same checks locally before pushing:

```bash
# Format check
pnpm format:check

# Linting
pnpm lint

# Type checking
pnpm typecheck

# Full build
pnpm build
```

## Branch Protection Rules

Consider enabling these branch protection rules on GitHub:

- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Required status checks:
  - `Validate PR`
  - `Review Dependencies`
- ✅ Require linear history
- ✅ Include administrators

## Future Improvements

Potential additions:
- 🧪 Test coverage reporting
- 📊 Lighthouse CI for performance metrics
- 🚀 Automatic deployment workflows
- 🏷️ Automated PR labeling
- 📝 Changelog generation
