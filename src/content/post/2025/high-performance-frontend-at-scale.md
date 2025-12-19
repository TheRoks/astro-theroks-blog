---
title: "High-Performance Frontend at Scale: NX, pnpm, Vite, and Next.js"
description: "A deep dive into architecting a scalable frontend monorepo that optimizes both build-time and runtime performance using NX, pnpm, buildable libraries, and Next.js."
publishDate: "2025-12-19T00:00:00Z"
category: "Architecture"
tags:
  - nx
  - pnpm
  - vite
  - nextjs
  - performance
  - architecture
author: "TheRoks"
excerpt: "How to architect a frontend monorepo for both fast CI builds and optimal runtime performance using NX, pnpm, Vite, and Next.js. This guide explains the 'transpile early, bundle late' approach for scalable, cache-friendly delivery."
---

Scaling a frontend architecture involves more than just adding folders to a repository. As a codebase grows from a single application to a workspace with 50, 100, or 500 libraries, the physics of development change. Manual builds become impossible, CI times skyrocket, and the "works on my machine" problem becomes a daily blocker.

The core challenge at scale is balancing two competing needs: fast developer feedback loops (build-time performance) and optimized delivery to the user (runtime performance). Optimizing for one often degrades the other. For instance, bundling every library individually speeds up application assembly but destroys cache efficiency.

This post details a coherent architecture using **NX**, **pnpm**, **Vite**, and **Next.js** that solves this trade-off. It relies on a "transpile early, bundle late" strategy to maximize cache hits while ensuring the smallest possible JavaScript payload reaches the browser.

## The Scale Problem

In a small repository, ad-hoc configurations work fine. You run a build script, wait a few seconds, and deploy. In a large NX workspace with multiple teams and continuous delivery, this breaks down.

When you have dozens of feature libraries and shared UI components, a change in a core utility can trigger a rebuild of the entire graph. Without a strategy, your CI pipeline becomes the bottleneck for the entire organization.

The goal is specific: **Keep builds fast and ship the smallest possible JS to users.**

## Two Types of Performance

To solve this, we must distinguish between the two types of performance we are optimizing.

### 1. Build-time performance

This concerns the developer experience and CI costs.

- **Feedback loop:** How fast can a developer see their changes?
- **Rebuild speed:** If I change one file, do I wait 10 seconds or 10 minutes?
- **Cache effectiveness:** Can I skip work that has already been done?

### 2. Runtime performance

This concerns the end-user experience.

- **Bundle size:** How many kilobytes are downloaded?
- **Time-to-interactive:** How fast does the app load?
- **Code reuse:** Are we shipping duplicate versions of React or lodash?

A naive approach might optimize build times by pre-bundling every library. This makes the final app build fast but often results in duplicate dependencies in the browser. Conversely, treating everything as source code ensures perfect tree-shaking but makes CI excruciatingly slow. We need a middle ground.

## NX as the Orchestrator

NX is not just a task runner; it is a build orchestration tool that understands the dependency graph.

Its primary value lies in **affected commands** and **computation caching**. NX analyzes the import statements in your code to build a graph. When you run a command, it checks:

1.  Has this specific task (with these inputs) been run before?
2.  If yes, replay the output from the cache (local or remote).
3.  If no, execute the task.

For this to work, tasks must be **pure and predictable**. If a build task produces different output based on an environment variable or a timestamp, the cache becomes unreliable.

## Buildable Libraries

In an NX workspace, libraries can be "buildable" or "non-buildable."

**Non-buildable libraries** are essentially folders of source code. When an app consumes them, the app's bundler (e.g., Webpack or Vite) compiles them from scratch. This ensures optimal tree-shaking but means that every app build recompiles every library it depends on. This destroys CI performance.

**Buildable libraries** have an explicit build step (e.g., `nx build my-lib`). They produce an artifact (usually in `dist/`).

- **Pros:** NX can cache the artifact. If the library hasn't changed, the build is skipped entirely.
- **Cons:** You must manage the build configuration for each library.

For scale, **buildable libraries are the unit of caching.** They allow us to draw a hard line in the sand: "This code is done. Do not process it again."

## NX Cache + Transpile-Only Vite

The secret sauce is how we build these libraries. We do **not** want to bundle them. Bundling (using Rollup or Webpack) is expensive. It requires resolving the entire dependency graph, tree-shaking, and minifying.

Instead, we use **Vite** in "library mode" configured to **transpile only**.

Each library:

1.  Uses Vite.
2.  Produces ESM (ECMAScript Modules).
3.  Preserves import statements (does not bundle dependencies).
4.  Does not minify (minification happens at the app level).

### Why this is fast

Because we are only transpiling (TypeScript to JavaScript), the process is CPU-light and IO-light. There is no complex graph traversal. A library builds in milliseconds.

More importantly, the output is deterministic. This maximizes the NX cache hit rate. In a typical PR, you might change 3 libraries out of 100. NX will pull 97 artifacts from the cache and only transpile the 3 that changed.

## Shared Vite Configuration

Cache correctness depends on consistency. If two libraries use slightly different TypeScript configurations or Vite plugins, you risk cache drift or subtle runtime bugs.

We solve this by creating a shared configuration package.

```typescript
// packages/config/vite/index.ts
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { isAbsolute } from "node:path";

export function getBaseViteConfig(appName: string) {
  return defineConfig({
    build: {
      lib: {
        entry: "src/index.ts",
        formats: ["es"],
      },
      rollupOptions: {
        // Externalize all dependencies to prevent bundling.
        // We use isAbsolute() to handle Windows paths correctly.
        external: (id) => !id.startsWith(".") && !isAbsolute(id),
        output: {
          // Preserve the file structure of the library.
          // This allows the consuming app (Next.js) to tree-shake effectively.
          preserveModules: true,
          entryFileNames: "[name].js",
        },
      },
    },
    plugins: [dts({ entryRoot: "src", tsconfigPath: "./tsconfig.lib.json" })],
  });
}
```

Every library consumes this config. This prevents configuration divergence, which I call "cache poison." If you need to upgrade Vite or change a plugin, you do it in one place, and NX invalidates the cache for everyone safely.

## pnpm + NX: Real Dependency Boundaries

We use **pnpm** because of its strict `node_modules` layout. Unlike npm or Yarn v1, pnpm does not hoist dependencies to the root by default. A library can only import what it explicitly declares in its `package.json`.

NX relies on the dependency graph to calculate what is "affected." If your code imports a library that isn't in `package.json`, NX might miss a dependency, leading to broken builds or cache corruption.

pnpm enforces honesty. If a library builds, it _really_ builds. This prevents hidden runtime dependencies and accidental bundle bloat where a library implicitly pulls in a massive utility package.

## Why Libraries Do NOT Bundle

It is crucial to reiterate: **Libraries should produce artifacts, not bundles.**

If libraries bundle their dependencies:

1.  **Build time:** Each library repeats the work of resolving and bundling common dependencies (like React).
2.  **Cache:** A change in a leaf node (e.g., a button component) ripples up and forces a re-bundle of every consumer.
3.  **Runtime:** You risk the "dual package hazard," where the app loads two copies of the same library (one from the app bundle, one bundled inside a utility library).

By transpiling only, we keep the build surface small and the entropy low.

## Next.js as the Single Bundler

We defer the heavy lifting of bundling to the final stage: the application. In this architecture, **Next.js** is the single bundler.

Next.js (via Webpack or Turbopack) sees the full application graph. It consumes the ESM artifacts produced by our buildable libraries.

Because the libraries are unbundled ESM:

- **Tree-shaking works globally.** Next.js can drop unused exports from a library, even if that library was pre-built.
- **Shared chunks emerge naturally.** If `FeatureA` and `FeatureB` both import `SharedUI`, Next.js splits `SharedUI` into a separate chunk.
- **Dead code is eliminated.**

This improves runtime performance because we exercised restraint at build time. We didn't try to optimize the library in isolation; we optimized it for consumption.

## End-User Performance Wins

The result for the user is tangible:

- **Smaller payloads:** No duplicated dependencies.
- **Better caching:** Shared chunks can be cached by the browser across different routes.
- **Faster navigation:** Next.js can lazy-load feature libraries per route effectively.

If we had bundled our libraries, the user would likely download the same utility code multiple times, hidden inside opaque bundles.

## The CI Pipeline

Here is what happens when a developer opens a PR:

1.  **NX Analysis:** NX calculates the affected graph based on the files changed.
2.  **Cache Check:** NX checks the remote cache for the affected libraries.
3.  **Skip:** Unchanged libraries are skipped (artifacts downloaded if needed).
4.  **Transpile:** Only the changed libraries are transpiled by Vite.
5.  **Bundle:** Next.js builds the application, consuming the fresh artifacts and the cached ones.

This pipeline scales. As the repo grows, the number of unaffected libraries grows, but the work done per PR remains roughly constant (proportional to the change, not the repo size).

## Trade-offs

This architecture is not free. It requires discipline.

- **Dependency Boundaries:** You must maintain `package.json` files for every library.
- **ESM-First:** You need to ensure all your tooling supports ESM.
- **Tooling Trust:** You are heavily reliant on NX and pnpm working correctly.
- **Not Publish-Ready:** These libraries are optimized for internal consumption. If you need to publish to npm for public use, you would need a separate build target that bundles dependencies.

However, for internal scale, the trade-off is worth it. You get the build speed of microservices with the code sharing and consistency of a monolith.

## Comparison

| Strategy                          | Build Speed | Cache Efficiency | Runtime Performance |
| :-------------------------------- | :---------- | :--------------- | :------------------ |
| **Bundle every lib**              | ❌ Slow     | ❌ Poor          | ⚠️ Medium           |
| **No build step (source)**        | ⚠️ Medium   | ❌ None          | ⚠️ Medium           |
| **Transpile libs + NX + Next.js** | ✅ Fast     | ✅ Excellent     | ✅ Best             |

## Architecture Principles

To summarize, these are the rules we follow:

1.  **NX decides what builds.** Trust the graph.
2.  **Libraries produce artifacts, not bundles.** Keep outputs clean and un-minified.
3.  **Bundling happens once.** The app (Next.js) is the only place where code is bundled for the browser.
4.  **Configs are centralized.** Prevent drift to ensure cache stability.
5.  **Performance is end-to-end.** Don't optimize build time at the expense of the user.

## Summary

Fast builds enable fast teams. Small bundles enable fast users. By combining NX's caching with Vite's fast transpilation and Next.js's global bundling, you can achieve both. This architecture provides a robust foundation for frontend teams to scale without hitting the performance wall that typically plagues large monorepos.
