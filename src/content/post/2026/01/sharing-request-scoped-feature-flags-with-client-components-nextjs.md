---
title: "Sharing Request-Scoped Feature Flags with Client Components in Next.js"
description: "Use React cache, Context, and use() to share server-fetched, request-scoped feature flags with Client Components without blocking navigation."
excerpt: "A pragmatic Next.js 16 pattern for sharing server-fetched data across the client tree: cache it per request, pass a Promise into Context, and let leaf components suspend behind tight Suspense boundaries."
path: "/sharing-request-scoped-feature-flags-with-client-components/"
publishDate: 2026-01-06
updated: 2026-01-06
category: Next.js
tags:
  - Next.js
  - React
  - Server Components
  - Suspense
  - Performance
  - Architecture
author: TheRoks
---

Next.js App Router pushes you toward Server Components for data fetching. That’s good for performance, but it changes how you share “global-ish” data like feature flags across your UI.

The catch is that Server Components don’t support React Context. If you reach for a client-side provider at the root and fetch flags in the browser, you’ve traded server streaming for a network waterfall.

This guide shows a pragmatic pattern: fetch once on the server, share it across the server tree with `cache`, then pass a Promise into a Client Component Context so leaf components can suspend behind narrow `<Suspense>` boundaries.

## Requirements

- Next.js 16 App Router project
- React 19 (or a React version that supports `use()` in your setup)
- TypeScript (recommended)
- A server-side source of flags (database, internal service, or config)

## The realistic options (and their tradeoffs)

When many components need the same request-scoped data, you usually end up here.

### Option 1: Prop drilling from the layout

Works, stays explicit, and is often the right default.

Downside: deep trees get noisy, and “middle” components start forwarding props they don’t care about.

```tsx
// app/layout.tsx
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  // Imagine this comes from a server source and must be per-request.
  const flags = { newBilling: true };

  return (
    <html lang="en">
      <body>{children /* flags must be threaded manually */}</body>
    </html>
  );
}
```

### Option 2: Fetch flags in Client Components

This is where most apps land when they try to keep Context.

Downside: you introduce client-to-server roundtrips during render, and you risk waterfalls if multiple client components fetch related data.

```tsx
// app/components/flags-client.tsx
"use client";

import { useEffect, useState } from "react";

type Flags = { newBilling: boolean };

export function FlagsClientDemo() {
  const [flags, setFlags] = useState<Flags | null>(null);

  useEffect(() => {
    void fetch("/api/flags")
      .then((r) => r.json())
      .then((data: Flags) => setFlags(data));
  }, []);

  if (!flags) return <p>Loading flags...</p>;

  return <p>newBilling = {String(flags.newBilling)}</p>;
}
```

### Option 3: Pass resolved server data into a Client Context Provider

This avoids client fetching and keeps Context.

Downside: if you `await` the data at the provider boundary, you can block a large part of the tree. With Cache Components enabled, Next.js will also nudge you to put the blocking work behind `<Suspense>`.

```tsx
// app/flags-provider/server.tsx
import { getFlags } from "@/lib/flags";
import { FlagsContextProvider } from "./client";
import type { ReactNode } from "react";

export async function FlagsProvider({ children }: { children: ReactNode }) {
  const flags = await getFlags();

  return <FlagsContextProvider value={flags}>{children}</FlagsContextProvider>;
}
```

Ultimately it’s a pragmatic decision: if you can keep the blocking boundary small, Option 3 is fine. If the provider sits at the root layout and the data is slow, you want a pattern that unblocks navigation.

## The pattern: cache on the server, pass a Promise to the client

This is a two-part implementation:

1. A request-scoped server helper using `cache()`.
2. A provider pair: Server Component creates the Promise; Client Component stores it in Context and unwraps it with `use()`.

### Step 1: Create a request-scoped `getFlags()` with `cache`

Create a module that exports a memoized function. The memoized function must live at module scope so all Server Components import the same memoized function.

```ts
// lib/flags.ts
import { cache } from "react";
import { cookies } from "next/headers";

type Flags = {
  newBilling: boolean;
  pricingExperimentBucket: "control" | "variant";
};

async function fetchFlagsForWorkspace(workspaceId: string): Promise<Flags> {
  // Replace with your real source.
  // Keep it serializable (plain objects, arrays, strings, numbers).
  return {
    newBilling: workspaceId.startsWith("beta_"),
    pricingExperimentBucket: workspaceId.endsWith("1") ? "variant" : "control",
  };
}

export const getFlags = cache(async function getFlags() {
  const workspaceId = (await cookies()).get("workspace_id")?.value ?? "default";
  return fetchFlagsForWorkspace(workspaceId);
});

export type { Flags };
```

Notes that matter in production:

- `cache()` is request-scoped in React Server Components. It deduplicates work per request.
- Don’t call `cache()` inside a component. You’ll create a new memoized function every render and defeat caching.
- The resolved value must be serializable if you want to pass it to Client Components.

### Step 2: Add a Server Component provider that does not block

Instead of awaiting `getFlags()`, create the Promise and pass it through.

```tsx
// app/flags-provider/server.tsx
import type { ReactNode } from "react";
import { getFlags, type Flags } from "@/lib/flags";
import { FlagsContextProvider } from "./client";

export function FlagsProvider({ children }: { children: ReactNode }) {
  const flagsPromise: Promise<Flags> = getFlags();

  return <FlagsContextProvider value={flagsPromise}>{children}</FlagsContextProvider>;
}
```

If you want a hard fallback instead of surfacing errors, resolve to a known value.

```tsx
// app/flags-provider/server.tsx
import type { ReactNode } from "react";
import { getFlags, type Flags } from "@/lib/flags";
import { FlagsContextProvider } from "./client";

const FALLBACK_FLAGS: Flags = {
  newBilling: false,
  pricingExperimentBucket: "control",
};

export function FlagsProvider({ children }: { children: ReactNode }) {
  const flagsPromise: Promise<Flags> = getFlags().catch(() => FALLBACK_FLAGS);

  return <FlagsContextProvider value={flagsPromise}>{children}</FlagsContextProvider>;
}
```

### Step 3: Implement the Client Context and a hook that unwraps the Promise

The Client Component stores the Promise in Context. Consumers call `use()` to unwrap it. If the Promise is still pending, React suspends the caller.

```tsx
// app/flags-provider/client.tsx
"use client";

import { createContext, use } from "react";
import type { ReactNode } from "react";
import type { Flags } from "@/lib/flags";

const FlagsPromiseContext = createContext<Promise<Flags> | null>(null);

export function FlagsContextProvider({ value, children }: { value: Promise<Flags>; children: ReactNode }) {
  return <FlagsPromiseContext value={value}>{children}</FlagsPromiseContext>;
}

export function useFlags(): Flags {
  const flagsPromise = use(FlagsPromiseContext);
  if (!flagsPromise) {
    throw new Error("useFlags must be used under <FlagsProvider />");
  }

  const flags = use(flagsPromise);
  return flags;
}
```

### Step 4: Wire the provider into your layout

Keep the provider close to where it’s needed. If it needs to be global, you can put it in the root layout, but the point of this pattern is that it doesn’t force the entire page to wait.

```tsx
// app/layout.tsx
import type { ReactNode } from "react";
import { FlagsProvider } from "./flags-provider/server";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FlagsProvider>{children}</FlagsProvider>
      </body>
    </html>
  );
}
```

### Step 5: Consume flags behind a narrow Suspense boundary

Only the components that truly need the flags should suspend.

```tsx
// app/components/billing-entry.tsx
"use client";

import { useFlags } from "@/app/flags-provider/client";

export function BillingEntry() {
  const flags = useFlags();

  if (!flags.newBilling) {
    return <a href="/billing">Billing</a>;
  }

  return <a href="/billing/new">Billing (new)</a>;
}
```

Wrap it with `<Suspense>` at a point that keeps the rest of the UI interactive.

```tsx
// app/components/header.tsx
import { Suspense } from "react";
import { BillingEntry } from "./billing-entry";

export function Header() {
  return (
    <header>
      <a href="/">Home</a>

      <nav aria-label="Primary">
        <Suspense fallback={<a href="/billing">Billing</a>}>
          <BillingEntry />
        </Suspense>
      </nav>
    </header>
  );
}
```

## What this buys you

- You fetch once per request and share the snapshot across Server Components.
- You avoid client-side waterfalls for “shared” data.
- You decide precisely where the UI can suspend.

It’s also a clean mental model: Server Components marshal data, Client Components decide interactions. The Promise bridge is the contract.

## Common footguns

### Creating Promises in the client

Promises created in Client Components are often recreated on every render. Prefer creating the Promise in a Server Component and passing it down.

```tsx
// app/components/dont-do-this.tsx
"use client";

import { use } from "react";

async function fetchFlags(): Promise<{ newBilling: boolean }> {
  const res = await fetch("/api/flags");
  return res.json();
}

export function DontDoThis() {
  const flags = use(fetchFlags());
  return <p>{String(flags.newBilling)}</p>;
}
```

### Passing non-serializable values

If the Promise resolves to functions, class instances, or other values that can’t be serialized across the server/client boundary, rendering will fail.

```ts
// lib/flags.ts
export type Flags = {
  // ✅ Good
  newBilling: boolean;

  // 🚩 Avoid
  // onClick: () => void;
};
```

## Summary

Use `cache()` to deduplicate request-scoped reads across Server Components. If the same data needs to be accessed deep in the client tree, pass a Promise into a Client Context, unwrap it with `use()`, and place `<Suspense>` boundaries as close as possible to the components that actually depend on it.

Ultimately it’s a pragmatic decision: the best pattern is the one that keeps your data flow explicit, your loading states intentional, and your navigation unblocked.

## References

- [React: cache](https://react.dev/reference/react/cache)
- [React: use](https://react.dev/reference/react/use)
- [Next.js: Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
