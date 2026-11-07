---
goal: Reduce homepage layout shift and critical request work from PageSpeed findings
date_created: 2026-11-07
status: "Complete"
---

# Introduction

![Status: Complete](https://img.shields.io/badge/status-Complete-brightgreen)

The original 7 November mobile report scored 95 for performance, with LCP 0.9 seconds, CLS 0.132, TBT 0 ms, and Speed Index 2.5 seconds. The measured layout shift occurred in the homepage hero and its "Field notes" panel as Inter loaded. Astro's ClientRouter accounted for a 34 ms forced reflow and appeared in the critical request tree. A throttled Chrome trace reproduced the shift as Inter loaded. After preloading Inter and removing ClientRouter, local mobile Lighthouse measured CLS 0, LCP 0.8 seconds, Performance 100, and no forced-reflow audit. Menu, theme, native navigation, and browser back behavior passed in preview.

After PR #464 deployed, PageSpeed Insights mobile runs scored 99 and 97 for performance. CLS remained 0, TBT 0 ms, and LCP/FCP 1.7 seconds; Speed Index varied from 2.6 to 4.0 seconds between runs. The forced-reflow insight and ClientRouter/font request chain are gone. The latest 2026-11-07 13:34 CET run measured a 367 ms maximum path, including the base stylesheet and Cloudflare Insights beacon-to-RUM request; PSI found no suitable preconnect candidates. Lighthouse still reports the Partytown Fenced Frame deprecation and 8 KiB cache-lifetime / 21 KiB legacy-JavaScript savings associated with the analytics beacon.

The repository now uses eligible latest `@qwik.dev/partytown` 1.0.4. The upstream `HTMLFencedFrameElement` exclusion shipped in 1.0.1 and was already present in 1.0.3; 1.0.4's separate worker-only fallback change did not clear the live warning. The remaining warning points to Partytown's sandbox. Removing or delaying Cloudflare Insights could shorten its analytics request chain, but would change telemetry timing and coverage; PSI found no suitable preconnect candidate.

## 1. Requirements & Constraints

- **REQ-001** Remove the font-triggered homepage layout shift while retaining Inter and the existing layout.
- **REQ-002** Remove avoidable ClientRouter startup work while retaining theme and mobile navigation controls.
- **REQ-003** Keep the current immutable cache headers and contrast improvements.
- **CON-001** Do not bypass the repository's 24-hour pnpm minimum release age to update Partytown.
- **CON-002** Keep existing page URLs and analytics behavior.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001 Start the Latin Inter download earlier and remove unnecessary client navigation overhead.

| Task     | Description                                                                                                                                                                              | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Preload the same Latin Inter WOFF2 asset that the font stylesheet uses.                                                                                                                  | ✅        | 2026-11-07 |
| TASK-002 | Remove ClientRouter and initialize theme and menu controls during ordinary document load. Preserve router event initialization for future router use.                                    | ✅        | 2026-11-07 |
| TASK-003 | Update transitive `@qwik.dev/partytown` to eligible latest 1.0.4 and re-run PageSpeed. The Fenced Frame warning persists despite the upstream workaround already being present in 1.0.3. | ✅        | 2026-11-07 |

### Implementation Phase 2

- GOAL-002 Validate browser layout and navigation behavior.

| Task     | Description                                                                                                                                                                                                                                                     | Completed | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-004 | Run lint, typecheck, and production build. Confirm both target routes load in preview.                                                                                                                                                                          | ✅        | 2026-11-07 |
| TASK-005 | Measure layout shifts under mobile throttling and test menu/theme controls in preview.                                                                                                                                                                          | ✅        | 2026-11-07 |
| TASK-006 | Run PageSpeed Insights on the deployed revision and compare CLS, critical path, reflow, and Best Practices against the baseline. Latest run: Performance 97, CLS 0, LCP 1.7 seconds, 367 ms maximum path, no forced-reflow insight; Partytown warning persists. | ✅        | 2026-11-07 |

## 3. Alternatives

- **ALT-001** Leave ClientRouter installed. The report attributes 34 ms forced reflow to its startup bundle and includes it in the initial critical request tree.
- **ALT-002** Change Inter to optional display. Preloading is preferred because it retains the brand font while giving the browser earlier access to the exact font used by the stylesheet.

## 4. Dependencies

- **DEP-001** `@qwik.dev/partytown` 1.0.4 was published at 2026-11-05 21:00:18 UTC and passed the workspace's 24-hour minimum release age on 2026-11-06 21:00:18 UTC. Its release note describes worker-only fallback behavior; it does not claim to change the Fenced Frame warning.

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
- **RISK-003** PageSpeed still reports a Partytown Fenced Frame deprecation after the latest package update. Removing Partytown would change how Google Analytics runs; removing or delaying Cloudflare Insights would reduce early RUM coverage. These are analytics tradeoffs, not safe score-only changes.
- **ASSUMPTION-001** The Latin WOFF2 preload matches the font file selected by the existing Inter stylesheet for the report's English homepage content.

## 8. Related Specifications / Further Reading

[Latest mobile PageSpeed report](https://pagespeed.web.dev/analysis/https-theroks-com/r5zvwqd2dm?form_factor=mobile) · [Original mobile PageSpeed report](https://pagespeed.web.dev/analysis/https-theroks-com/xkwwk3t38y?form_factor=mobile) · [Astro Partytown integration](https://docs.astro.build/en/guides/integrations-guide/partytown/) · [Partytown release notes](https://github.com/QwikDev/partytown/releases)
