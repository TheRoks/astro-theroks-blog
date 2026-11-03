---
goal: Align crawl signals and improve technical article discovery
date_created: 2026-11-03
status: "In progress"
---

# Introduction

![Status: In progress](https://img.shields.io/badge/status-In%20progress-yellow)

Align generated URLs with production redirects, then improve the Sitecore entry point and use search data to prioritize editorial work.

## 1. Requirements & Constraints

- **REQ-001**: Make the main archive indexable and preserve legacy numbered pages.
- **REQ-002**: Use production's trailing slash convention for HTML pages.
- **REQ-003**: Provide a curated Sitecore hub and identify Stefan Roks consistently across posts and About.
- **CON-001**: Preserve published article slugs.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Make sitemap and canonical signals agree.

| Task     | Description                                                                                                         | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Set the HTML slash convention in src/config.mjs and use permalink helpers for internal navigation.                  | ✅        | 2026-11-03 |
| TASK-002 | Include the archive and About in astro.config.mjs sitemap output. Keep numbered archives and noindex tags excluded. | ✅        | 2026-11-03 |

### Implementation Phase 2

- GOAL-002: Improve discovery and authorship.

| Task     | Description                                                                                                                                                                                                                                                       | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-003 | Build a curated Sitecore hub at /topics/sitecore/ and link it from navigation, Topics, and Sitecore posts.                                                                                                                                                        | ✅        | 2026-11-03 |
| TASK-004 | Link Stefan Roks bylines and article structured data to /about/.                                                                                                                                                                                                  | ✅        | 2026-11-03 |
| TASK-005 | In Search Console, inspect the archive, hub, and recent and older articles. Export page and query performance for the last 90 days and prioritize articles by impressions and relevant query fit. Refresh the highest-priority article while preserving its slug. |           |            |

## 3. Alternatives

- **ALT-001**: Changing hosting redirects would require production configuration changes. The application can instead match the existing 308 targets.

## 4. Dependencies

- **DEP-001**: TASK-005 requires access to the verified Search Console property.

## 5. Files

- **FILE-001**: src/config.mjs, astro.config.mjs, and the shared permalink consumers control crawl signals.
- **FILE-002**: src/pages/topics, src/components/blog, and src/components/common/StructuredData.astro provide discovery and authorship.

## 6. Testing

- **TEST-001**: Run pnpm lint, pnpm typecheck, pnpm build, and pnpm preview. Check every sitemap URL against the rendered canonical and robots metadata.
- **TEST-002**: Verify hub navigation and author links in preview and inspect article JSON-LD on posts with and without custom images.

## 7. Risks & Assumptions

- **ASSUMPTION-001**: Production serves HTML directories at trailing-slash URLs. Recheck after rollout.
- **RISK-001**: Google may take time to recrawl URLs after deployment. Compare declared and selected canonicals in Search Console.

## 8. Related Specifications / Further Reading

[Google guidance on canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
