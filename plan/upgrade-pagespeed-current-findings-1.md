---
goal: Reduce homepage layout shift and critical request work from PageSpeed findings
date_created: 2026-11-07
status: "In progress"
---

# Introduction

![Status: In progress](https://img.shields.io/badge/status-In%20progress-yellow)

The 7 November mobile report scores 95 for performance, with LCP 0.9 seconds, CLS 0.132, TBT 0 ms, and Speed Index 2.5 seconds. The measured layout shift occurs in the homepage hero and its "Field notes" panel as Inter loads. Astro's ClientRouter accounts for a 34 ms forced reflow and appears in the critical request tree. A throttled Chrome trace reproduced the shift as Inter loaded. After preloading Inter and removing ClientRouter, local mobile Lighthouse measured CLS 0, LCP 0.8 seconds, Performance 100, and no forced-reflow audit. Menu, theme, native navigation, and browser back behavior passed in preview.

## 1. Requirements & Constraints

- **REQ-001** Remove the font-triggered homepage layout shift while retaining Inter and the existing layout.
- **REQ-002** Remove avoidable ClientRouter startup work while retaining theme and mobile navigation controls.
- **REQ-003** Keep the current immutable cache headers and contrast improvements.
- **CON-001** Do not bypass the repository's 24-hour pnpm minimum release age to update Partytown.
- **CON-002** Keep existing page URLs and analytics behavior.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001 Start the Latin Inter download earlier and remove unnecessary client navigation overhead.

| Task     | Description                                                                                                                                            | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-001 | Preload the same Latin Inter WOFF2 asset that the font stylesheet uses.                                                                                | ✅        | 2026-11-07 |
| TASK-002 | Remove ClientRouter and initialize theme and menu controls during ordinary document load. Preserve router event initialization for future router use.  | ✅        | 2026-11-07 |
| TASK-003 | Verify whether a pnpm-eligible Partytown release fixes Lighthouse's Fenced Frame API warning. Update only after the strict minimum release age is met. |           |            |

### Implementation Phase 2

- GOAL-002 Validate browser layout and navigation behavior.

| Task     | Description                                                                                                                     | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-004 | Run lint, typecheck, and production build. Confirm both target routes load in preview.                                          | ✅        | 2026-11-07 |
| TASK-005 | Measure layout shifts under mobile throttling and test menu/theme controls in preview.                                          | ✅        | 2026-11-07 |
| TASK-006 | Run PageSpeed Insights on the deployed revision and compare CLS, critical path, reflow, and Best Practices against this report. |           |            |

## 3. Alternatives

- **ALT-001** Leave ClientRouter installed. The report attributes 34 ms forced reflow to its startup bundle and includes it in the initial critical request tree.
- **ALT-002** Change Inter to optional display. Preloading is preferred because it retains the brand font while giving the browser earlier access to the exact font used by the stylesheet.

## 4. Dependencies

- **DEP-001** The Partytown fix is available in `@qwik.dev/partytown` 1.0.4, but the pnpm workspace enforces a 24-hour minimum release age. Wait until the package is eligible before updating the lockfile.

## 5. Files

- **FILE-001** `src/layouts/BaseLayout.astro` owns font preload and ClientRouter setup.
- **FILE-002** `src/components/common/BasicScripts.astro` owns theme and menu initialization.
- **FILE-003** `pnpm-lock.yaml` records the Partytown transitive version subject to release-age policy.

## 6. Testing

- **TEST-001** Check mobile layout shift entries and font load timing on the homepage in Chrome.
- **TEST-002** Check mobile navigation toggle, theme toggle, normal links, and browser back/forward behavior in preview.
- **TEST-003** Run repository lint, typecheck, build, and preview checks.
- **TEST-004** Re-run the supplied PageSpeed Insights report after deployment.

## 7. Risks & Assumptions

- **RISK-001** Removing ClientRouter changes internal navigation from client-side transitions to normal document navigation. Menu and theme setup must work on each full load.
- **RISK-002** Lighthouse results vary by run and emulated device. Use repeated measurements and the actual layout-shift trace when comparing.
- **ASSUMPTION-001** The Latin WOFF2 preload matches the font file selected by the existing Inter stylesheet for the report's English homepage content.

## 8. Related Specifications / Further Reading

[Current mobile PageSpeed report](https://pagespeed.web.dev/analysis/https-theroks-com/xkwwk3t38y?form_factor=mobile) · [Astro Partytown integration](https://docs.astro.build/en/guides/integrations-guide/partytown/) · [Partytown release notes](https://github.com/QwikDev/partytown/releases)
