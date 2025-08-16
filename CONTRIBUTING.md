# Contributing to TheRoks Blog

Thank you for your interest in contributing to this Astro-based blog! This document outlines the best practices and guidelines for contributing to the project.

## Astro Best Practices

### Image Handling

This project uses Astro's built-in `astro:assets` image pipeline for optimal performance and user experience.

#### ✅ Recommended: Use Picture/Image Components

When adding images to blog posts or components, always prefer Astro's `Picture` or `Image` components over raw HTML `<img>` tags:

```astro
---
import { Picture } from "astro:assets";
import { findImage } from "~/utils/images";

const image = await findImage("path/to/your/image.jpg");
---

<!-- ✅ Good: Uses Astro's Picture component -->
<Picture
  src={image}
  alt="Descriptive alt text"
  inferSize
  pictureAttributes={{}}
/>
```

#### ❌ Avoid: Raw img Tags in Rich Text

Don't emit raw `<img>` HTML strings from rich-text renderers. Instead:

- Keep image references as structured data (src/width/height/alt)
- Let your templates call `findImage` + `Picture` during server-side rendering
- This ensures proper image optimization and responsive image generation

Example of what to avoid:
```html
<!-- ❌ Bad: Raw img tag bypasses optimization -->
<img src="/assets/images/example.png" alt="Example" />
```

### Content Management

#### Frontmatter Requirements

All blog posts must include proper frontmatter with the following fields:

- `title`: Required string
- `publishDate`: ISO date string (YYYY-MM-DD format preferred)
- `draft`: Boolean, defaults to `false` if not specified
- `description`: Optional but recommended for SEO
- `image`: Optional, used for social media sharing

Example frontmatter:
```yaml
---
title: "Your Blog Post Title"
publishDate: 2023-12-01
draft: false
description: "A brief description for SEO and social sharing"
image: "~/assets/images/your-post-image.jpg"
tags: ["astro", "web-development"]
---
```

#### Frontmatter Validation

Use the built-in validation tool to ensure content quality:

```bash
# Check for frontmatter issues
node tools/check-frontmatter.js

# Auto-fix missing draft fields
node tools/check-frontmatter.js --fix
```

### Development Workflow

#### Building and Testing

Before submitting contributions:

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production (includes image optimization)
pnpm build

# Validate frontmatter
node tools/check-frontmatter.js

# Run linting
pnpm lint

# Format code
pnpm format
```

#### Image Optimization Verification

After building, verify that image optimization is working:

1. Check that `/_astro/*.webp` files are generated in the `dist` directory
2. Inspect generated HTML to ensure `<picture>` elements with WebP sources and fallback images
3. Verify that images in blog posts use the optimized asset pipeline

### Code Style

- Use TypeScript for type safety
- Follow the existing code formatting (Prettier configuration)
- Use ESLint rules for code quality
- Prefer composition over inheritance in components

### Commit Guidelines

- Write clear, descriptive commit messages
- Use conventional commit format when possible
- Keep commits focused and atomic
- Test your changes before committing

## Getting Help

If you have questions about contributing or need help with Astro best practices:

1. Check the [Astro documentation](https://docs.astro.build/)
2. Review existing code patterns in this repository
3. Open an issue for discussion before making major changes

## Performance Considerations

This blog is optimized for performance using:

- Astro's built-in image optimization with Sharp
- Static site generation
- Tailwind CSS for styling
- Minimal JavaScript payload

When contributing, please maintain these performance characteristics and avoid introducing unnecessary client-side JavaScript or large dependencies.