---
goal: Address PageSpeed Insights findings on the homepage and article template
date_created: 2026-11-03
status: "Completed"
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

The mobile lab runs scored 98 on the homepage and 100 on the .nvmrc article. Both flagged text contrast.

## 1. Requirements & Constraints

- **REQ-001** Ensure homepage accent text and article code comments meet WCAG AA contrast.
- **REQ-002** Measure shared CSS coverage and identify the owners of the cache and legacy JavaScript findings.
- **CON-001** Keep the analytics integration and existing page URLs.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001 Improve contrast and cache policies.

| Task     | Description                                                                                                                                             | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Add a theme-aware foreground color for homepage accent text and use a higher-contrast Shiki theme.                                                      | ✅        | 2026-11-03 |
| TASK-002 | Cache fingerprinted Astro assets for one year. Record that the PageSpeed cache and legacy JavaScript warnings point to the Cloudflare Analytics beacon. | ✅        | 2026-11-03 |
| TASK-003 | Compare shared CSS coverage on both routes. Preserve the stylesheet loading strategy if the bundle is substantially used on both pages.                 | ✅        | 2026-11-03 |

### Implementation Phase 2

- GOAL-002 Verify the production build.

| Task     | Description                                                                                                                                  | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-004 | Run format, lint, typecheck, and build. Check both routes in both themes with axe against the preview and inspect the generated cache rules. | ✅        | 2026-11-03 |

## 3. Alternatives

- **ALT-001** Deferring the shared stylesheet would risk a flash of unstyled content. Chrome reports about 87% coverage on both pages.

## 4. Dependencies

- **DEP-001** Browser checks use Chrome and axe. Cloudflare Pages applies the production cache rules after deployment.

## 5. Files

- **FILE-001** The homepage, shared theme styles, and Astro Shiki configuration control contrast.
- **FILE-002** `public/_headers` controls the cache policy for generated assets.

## 6. Testing

- **TEST-001** Run axe for the homepage and .nvmrc article with a mobile viewport in both themes. Check that article code blocks render and report no contrast violations.
- **TEST-002** Confirm the build emits the immutable policy for `/_astro/*`.

## 7. Risks & Assumptions

- **RISK-001** The analytics vendor controls the beacon code and response headers.
- **ASSUMPTION-001** Files under `/_astro/` are content-fingerprinted build outputs.

## 8. Related Specifications / Further Reading

[Homepage report](https://pagespeed.web.dev/analysis/https-theroks-com/az7ptu2b72?form_factor=mobile) · [Article report](https://pagespeed.web.dev/analysis/https-theroks-com-auto-switch-node-version-nvmrc/fhvg85jn67?form_factor=mobile)
