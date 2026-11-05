# UWA Navigation Usability Test Plan: Remote Unmoderated

**Client:** The University of Western Australia (UWA) · **Agency:** VML · **Study owner:** Rebecca Lawrance · **Version:** 0.2 · **Date:** 5 November 2026
**Status:** Draft

---

## 1. Study summary

| Item | Detail |
|---|---|
| Method | Remote, unmoderated, task-based usability test of new navigation system |
| Variants | **Control** (existing navigation, rebuilt as a prototype in this repo, identical in content to the variants) · **Variant 1** (top bar) · **Variant 2** (side bar) |
| Participants | **240 total, 80 per variant**, across five audience segments (Section 5) · Each participant only sees one version |
| Devices | Desktop and mobile, [50/50] split within each variant |
| Session length | ~15–20 minutes: screener, tasks + short qualitative feedback at close |
| Platform | Shortlist: Lyssna, UXtweak, Maze |
| Budget | **$7,200** ($30 per participant × 240) |
| Success threshold | **> 80% task success** |
| Running dates | 12 Nov – 13 Nov |

## 2. Background

UWA is redesigning its main website navigation. Two new concepts, a top bar version and a side bar version are being tested against the existing navigation to decide which to progress.

This new system is a full-site solution for a navigation system including core site navigation, co-branded site navigation, and breadcrumbs. Previous testing in 2024 found navigational issues that the new concepts aim to address. This study checks whether they do, and whether either concept meets the 80% task success threshold on desktop and mobile. 

## 3. Objective and success criteria

### Primary objective

**More than 80% task success** with the navigation.

- **Per task, per variant:** each task's success rate is reported against 80%.
- **Overall, per variant:** mean success across the analysed tasks must exceed 80%.
- **Per device:** the threshold must hold on desktop and mobile separately.
- **Against Control:** a new variant should also meet or beat the Control, not only pass 80%.

> **Note on certainty.** With 80 participants per variant, a measured success rate has a margin of error of roughly ±8–9 percentage points (±12 per device with 40). A variant measuring 82% might really be anywhere from ~73% to ~89%. To be confident the *true* rate is above 80%, the measured rate needs to be around **90%**. Report both: "met the target" (measured > 80%) and "confidently met" (lower bound of the 95% confidence interval > 80%).

### What success looks like

| # | Success criterion | Principle | Tasks | Main measures |
|---|---|---|---|---|
| SC1 | Users understand where the navigation menu options are and how to access them | Stability, Consistency | T0, T1, T2 | First click, success |
| SC2 | Users understand how to move back and forth through the IA levels in the menu | Orientation | T2, T3 | Success, directness, backtracks, path |
| SC3 | Users understand how to access parent pages for sections (e.g. Study, Research) | Orientation | T4, T5 | Success, first click, heading perception question |
| SC4 | Users understand when they are on a microsite menu, how to move back and forth, and how to switch between microsite and main site navigation | Stability, Orientation | T6, T7, T8 | Success, path, microsite awareness question |
| SC5 | Competency of the above across desktop and mobile | Consistency | All | All metrics compared by device |

## 4. Questions this research will address

| # | Question |
|---|---|
| RQ1 | Does each variant achieve > 80% task success, overall and on each task? |
| RQ2 | Does Variant 1 or Variant 2 outperform the Control on success and directness? |
| RQ3 | Do users find and open the navigation on the first click, on both devices? (SC1) |
| RQ4 | Can users move down, up and across IA levels without getting lost? (SC2) |
| RQ5 | Do users recognise and use section headings as links to parent pages? (SC3) |
| RQ6 | Do users recognise when they're in a microsite, and can they get back to the main site? (SC4) |
| RQ7 | Is performance consistent between desktop and mobile? (SC5) |
| RQ8 | Do results differ by audience segment? |


## 5. Participants

### Quotas

240 participants, 80 per variant, randomly assigned within each segment.

| Segment | Total | Per variant | Per variant per device (50/50) |
|---|---|---|---|
| High school students, Years 9–12, domestic | 90 | 30 | 15 |
| High school students, Years 9–12, international | 60 | 20 | 10 |
| Prospective postgraduate | 30 | 10 | 5 |
| Current students, undergraduate | 30 | 10 | 5 |
| Current students, postgraduate | 30 | 10 | 5 |
| **Total** | **240** | **80** | **40** |

**What this sample supports:**

- **Variant-level results (n = 80):** solid. Enough to detect a difference of about **20 percentage points** in success between two variants (e.g. 65% vs 85%) with reasonable confidence. Smaller differences may not show as significant.
- **Device-level results (n = 40 per variant):** usable for the 80% check and big differences only.
- **Segment-level results:** high school domestic (30 per variant) is usable directionally. The other segments (10–20 per variant, 5–10 per device) are **too small to compare** between variants; pool them or report qualitatively.

### Segment definitions and targeting

| Segment | Targeting |
|---|---|
| **HS domestic** | Australian residents in Years 9–12 [mix of years, e.g. at least half in Years 11–12]; [WA weighting, e.g. 60% WA / 40% other states]; considering university |
| **HS international** | Years 9–12 (or equivalent) outside Australia; considering studying at an Australian university; [target markets, e.g. Singapore, Malaysia, China, India, Indonesia, Vietnam]; able to complete the study in English |
| **Prospective PG** | Holds or is completing a bachelor's degree; considering postgraduate coursework or research study in the next [2] years; [domestic/international split] |
| **Current UG** | Currently enrolled in an undergraduate degree [at UWA / at any Australian university] |
| **Current PG** | Currently enrolled in postgraduate coursework or research [at UWA / at any Australian university] |

## 6. Tasks

### Notes on tasks

- Every task is **standalone** so the order can be randomised. Each has its own start page and a self-contained scenario, and none depends on the previous task.
- Task order is randomised after the warm-up (T0).

### Task set (draft)

| ID | Criterion / finding | Scenario (as shown to participant) | Start page | Target (all variants) | Success = |
|---|---|---|---|---|---|
| T0 | Warm-up · SC1 | "Take a quick look at this university website. When you're ready, find the page that tells you where the university's campus is." | Home | [Campus / Contact page] | Not analysed (except first click) |
| T1 | SC1 · F#1 | "You're interested in studying [subject area, e.g. engineering]. Find the page for a course in that area." | Home | [Specific course page(s)] | Reaches any accepted course URL |
| T2 | SC1, SC2 | "You'd like to know what scholarships might help pay for your studies. Find information about scholarships for [your situation / international students]." | Home | [Scholarships page, L3–L4] | Reaches target URL |
| T3 | SC2 | "You're reading about a course and now want to find out about places to live while you study. Find information about student accommodation." | [Deep page under Study, e.g. course page] | [Accommodation page, in another branch] | Reaches target; path shows movement up/across levels |
| T4 | SC3 · F#2, #9 | "Find the main page that gives an overview of everything about research at the university." | [Any content page] | [Research L1 landing page] | Reaches L1 landing page |
| T5 | SC3 · F#2, #9 | "You're looking at one study area but want to see the full list of study areas the university offers. Find that page." | [A specific study area page, L3] | [Study areas L2 parent page] | Reaches L2 parent page |
| T6 | SC4 | "You've arrived on the website for [microsite, e.g. a research institute]. Find out who leads it / how to contact them." | [Microsite home] | [Page within microsite] | Reaches target within microsite |
| T7 | SC4 · F#7, #11 | "You're on the website for [microsite, e.g. a research institute]. You also want to find out how to apply to study at the university. Find that information." | [Microsite page] | [Main site How to apply page] | Leaves microsite nav and reaches main site target |
| T8 | SC4 · F#6 | "Go back to the university's main homepage." | [Deep microsite page] | [Main site home URL] | Reaches main home; report method (logo / menu / breadcrumb) |

[Confirm subject areas, scholarship type, microsite and all target URLs against the IA used in the variants.]

### Perception questions (asked once, after specific tasks)

| ID | After | Question | Purpose |
|---|---|---|---|
| PQ1 | T4 | Show a screenshot of an open menu panel with its heading highlighted: "Do you think you could click this heading?" (Yes, it's a link / No, it's just a title / Not sure) | Finding #2, #9 (heading as link) |
| PQ2 | T7 | "Thinking about the page you started on for that task, was it part of the main university website or a separate section of it?" (Main site / Separate section, e.g. an institute site / Not sure) | Finding #7, #11 (microsite awareness) |

PQ1 needs a variant-specific screenshot. If a variant has no menu heading, adapt the question to that variant's equivalent parent-page link.

## 7. Session flow

| Step | Content | Time |
|---|---|---|
| 1. Welcome and consent | Plain-language purpose, what's recorded, right to stop; **parent/guardian consent confirmed for under-18s** | 1–2 min |
| 2. Screener confirmation | Segment and device check | 1 min |
| 3. Instructions | How tasks work, "Done" and "Give up", that some content is placeholder, search status (Section 12) | 1 min |
| 4. Warm-up (T0) | | 1–2 min |
| 5. Tasks T1–T8 | PQ1 after T4, PQ2 after T7 | 10–13 min |
| 6. Post-test | UMUX-Lite (2 items) + 2 open questions | 2 min |
| 7. Thank you | Incentive details | <1 min |

Target **under 20 minutes**. Keep it shorter if possible for younger participants and mobile users; drop T0 analysis or T5 if piloting runs long.

## 8. Metrics

| Metric | Definition | Linked criteria |
|---|---|---|
| Task success rate | % reaching target URL (direct + indirect) | Objective, all SCs |
| Direct success rate | % reaching target with no backtracking | SC2, SC3 |
| Give-up / failure rate | % giving up, ending elsewhere or timing out | All |
| First-click accuracy | % whose first click was on a correct path | SC1, SC3 |
| Backtracks / path length | Back-steps and pages visited vs the optimal path | SC2, SC4 |
| Route used | E.g. logo vs menu vs breadcrumb (T8); "All UWA" equivalent vs other (T7); search attempts (T1) | F#1, #6, #7 |
| PQ1 / PQ2 | % answering correctly | F#2, #7, #9, #11 |
| UMUX-Lite | Perceived usability, 0–100 | Overall |
| Open comments | Coded themes | Secondary objective |

All metrics reported **per variant**, and **per variant × device**.

## 9. Analysis plan and decision criteria

### Analysis

- **80% threshold:** per task and overall, per variant and per device, with 95% confidence intervals (adjusted Wald). Report "met" and "confidently met" (Section 3).
- **Variant comparisons:** success rates V1 vs Control, V2 vs Control, V1 vs V2 (chi-square or Fisher's exact). Overall success compared using a model that accounts for repeated tasks per participant [e.g. logistic mixed model], or compare per-participant success counts.
- **UMUX-Lite:** means with confidence intervals.
- **Multiple comparisons:** 8 tasks × 3 comparisons × 2 devices is a lot of tests. Treat per-task significance cautiously (e.g. Holm correction) and lead with the overall pattern.
- **Segments:** directional only (Section 5).
- **Paths:** path diagrams for every task with < 80% success, to show where users go wrong.
- **Qualitative:** affinity-map open comments by variant and device; map themes to Askable findings.

### Decision criteria (agree before fieldwork)

| Outcome | Recommendation |
|---|---|
| One variant meets > 80% overall on desktop **and** mobile, and beats or matches Control | Progress that variant |
| Both variants meet the threshold | Choose on directness, UMUX-Lite, perception questions, Askable finding improvements and qualitative feedback |
| A variant meets 80% on desktop but not mobile (or vice versa) | Progress with targeted fixes for the weaker device; re-test that device |
| Neither variant meets 80% | Use failing tasks and paths to revise; re-test before build |
| Specific tasks fail across all variants | Likely an IA or labelling issue rather than the navigation pattern; flag for IA review |

## 10. Pre-launch QA and pilot

**Device matrix** (Finding #3): every variant checked on

- [ ] Desktop Chrome, Safari, Edge at 1440px and a common laptop width (1280/1366px)
- [ ] iPhone (Safari), current and one older model
- [ ] Android (Chrome), mid-range device
- [ ] Inside the testing tool's own browser frame/app on each

**Setup checks**

- [ ] All three variants live at stable, neutral URLs; builds frozen
- [ ] Every start and target URL set in every variant
- [ ] Microsite present in all variants; logo links home in all variants
- [ ] Prototype access works inside the tool (password screen, `noindex`, embedding)
- [ ] Task wording, order rules and questions identical across variants
- [ ] Consent flow includes parent/guardian consent for under-18s

**Pilot**

- [ ] Internal dry run: 2–3 people per variant, desktop and mobile
- [ ] Soft launch: [5] participants per variant (mix of segments and devices); review data before releasing the rest
- [ ] Log any changes; exclude pilot data if tasks or setup changed materially

## 11. Roles

| Role | Name | Responsibilities |
|---|---|---|
| Study owner | [Hugo Jenkins?] | Plan, decisions, sign-off |
| Researcher | [ ] | Platform setup, pilot, monitoring, analysis, report |
| Prototype build | [ ] | Variants, mobile layouts, microsite, freezes |
| UWA lead | [ ] | Approvals, recruitment channels, ethics/safeguarding, privacy sign-off |
| Recruiter | [ ] | Under-18 and international recruitment, consent |

## 12. Open decisions

| # | Decision | Why it matters |
|---|---|---|
| D1 | **How to recruit and consent 150 under-18s** | Platform panels likely can't supply them; changes recruiter, budget, timeline and ethics needs |
| D2 | **Budget scope:** AUD? Does $30 pp cover panel/recruitment fees, incentive, or both? Are platform fees and over-recruitment extra? | $7,200 covers exactly 240 with no buffer |
| D3 | **80% threshold:** per task, overall, per device; "met" vs "confidently met"; must a variant also beat Control? | Sets the pass/fail rule |
| D4 | **Search:** enabled or disabled in all variants? | Finding #1: search is a top way users find courses. Disabled search can depress T1 results |
| D5 | **Mobile readiness:** are V1 and V2 mobile layouts built? Device split 50/50? | SC5 can't be tested without them |
| D6 | **Microsite:** which one, and does it exist in all three variants? | Needed for T6–T8 (SC4) |
| D7 | **Current students:** UWA students or students from other universities? | UWA students know the existing nav (favours Control) |
| D8 | **International HS markets** and English level | Targeting, recruitment channel, incentives, time zones |
| D9 | **Platform choice** | Must support live-site or prototype URLs, mobile web, own participants and path tracking |
| D10 | **UWA benefits** statement | Not yet drafted |

## 13. Report outline

1. Executive summary: 80% threshold result per variant and device; recommendation
2. Method and participants (incl. exclusions)
3. Results against success criteria SC1–SC5
4. Task-by-task results with paths
5. Askable 2024 findings: improved / not improved, by variant
6. Desktop vs mobile
7. Audience segments (directional)
8. Qualitative themes
9. Recommendations and next steps
10. Appendix: data tables, tasks, screener, consent
