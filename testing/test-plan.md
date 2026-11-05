# UWA Navigation Usability Test Plan: Remote Unmoderated

**Client:** The University of Western Australia (UWA) 

**Version:** 0.2

**Date:** 5 November 2026

**Status:** Draft

---

## 1. Background

UWA is redesigning its main website navigation. Two new concepts, a top bar version and a side bar version are being tested against the existing navigation to decide which to progress.

This new system is a full-site solution for a navigation system including core site navigation, co-branded site navigation, and breadcrumbs. Previous testing in 2024 found navigational issues that the new concepts aim to address. This study checks whether they do, and whether either concept meets the 80% task success threshold on desktop and mobile. 

## 2. Objective and success criteria

### Primary objective

**More than 80% task success** with the navigation.

- **Per task, per variant:** each task's success rate is reported against 80%.
- **Overall, per variant:** mean success across the analysed tasks must exceed 80%.
- **Per device:** the threshold must hold on desktop and mobile separately.
- **Against Control:** a new variant should also meet or beat the Control, not only pass 80%.

> **Note on certainty.** With 80 participants per variant, a measured success rate has a margin of error of roughly ±8–9 percentage points (±12 per device with 40). A variant measuring 82% might really be anywhere from ~73% to ~89%. To be confident the *true* rate is above 80%, the measured rate needs to be around **90%**. Report both: "met the target" (measured > 80%) and "confidently met" (lower bound of the 95% confidence interval > 80%).

### Success criteria

| # | Success criterion | Principle | Tasks | Main measures |
|---|---|---|---|---|
| SC1 | Users understand where the navigation menu options are and how to access them | Stability, Consistency | T1, T2 | First click, success |
| SC2 | Users understand how to move back and forth through the IA levels in the menu | Orientation | T2, T3 | Success, directness, backtracks, path |
| SC3 | Users understand how to access parent pages for sections (e.g. Study, Research) | Orientation | T4, T5 | Success, first click, heading perception question |
| SC4 | Users understand when they are on a co-branded menu, how to move back and forth, and how to switch between co-brand and main site navigation | Stability, Orientation | T6, T7, T8 | Success, path, co-brand awareness question |
| SC5 | Competency of the above across desktop and mobile | Consistency | All | All metrics compared by device |

## 4. Questions this research will address

| # | Question |
|---|---|
| RQ1 | Does each variant achieve > 80% task success, overall and on each task? |
| RQ2 | Does Variant 1 or Variant 2 outperform the Control on success and directness? |
| RQ3 | Do users find and open the navigation on the first click, on both devices? (SC1) |
| RQ4 | Can users move down, up and across IA levels without getting lost? (SC2) |
| RQ5 | Do users recognise and use section headings as links to parent pages? (SC3) |
| RQ6 | Do users recognise when they're in a co-branded site, and can they get back to the main site? (SC4) |
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
| **HS domestic** | Australian residents in Years 9–12; considering university |
| **HS international** | Years 9–12 (or equivalent) outside Australia; considering studying at an Australian university; able to complete the study in English |
| **Prospective PG** | Holds or is completing a bachelor's degree; considering postgraduate coursework or research study in the next 2 years |
| **Current UG** | Currently enrolled in an undergraduate degree at UWA / any Australian university |
| **Current PG** | Currently enrolled in postgraduate coursework or research at UWA / at any Australian university |

## 6. Tasks

### Notes on tasks

- Every task is **standalone** so the order can be randomised. Each has its own start page and a self-contained scenario, and none depends on the previous task.
- Task order is randomised.

### Task set (draft)

| ID | Criterion | Scenario (as shown to participant) | Start page | Target (all variants) | Success = |
|---|---|---|---|---|---|
| T1 | SC1 | "You're interested in studying data science. Find the page for a course in that area." | Home | Data and computer science study area/course page | Reaches accepted course or study area URL |
| T2 | SC1, SC2 | "You'd like to know what scholarships might help pay for your studies. Find information about scholarships for your situation." | Home | Study > Scholarships and fees > Scholarships > any of these  | Reaches any target section URL |
| T3 | SC2 | "You're reading about a course that interest you, and now you need to find out about places to live at the university while you study. Find information about student accommodation." | Data and computer science study area/course page | Life at UWA > Accommodation > Live at UWA | Reaches target URL |
| T4 | SC3 | "To get an idea about the research credentials of the organisation, find the page that gives an overview of all the research institutes run by the university." | Home  | Our research > Institutes and centres | Reaches target URL |
| T5 | SC3 | "You're looking at one study area but want to see the full list of study areas the university offers. Find that page." | Study > Explore courses > Study areas > Data and computer science > course page | Study > Explore courses > Study areas | Reaches parent page |
| T6 | SC4 | "You've arrived on the website for the Oceans Institute. Find out about the leadership team at the Institute." | Oceans Institute home | OI > About the OI > Our People | Reaches target URL within the Oceans Institute |
| T7 | SC4 | "You're on the website for the Oceans Institute. You want to find out how to apply to study for an undergraduate degree at the university that runs the Ocean Institute. Find that information." | Oceans Institute home | UWA > Study > How to apply > Undergraduate applicants > Section or any child page | Leaves co-brand nav and reaches main site target |
| T8 | SC4 | "Go back to the university's main homepage." | Library > Contact | UWA home | Reaches main home; report method (logo / menu / breadcrumb) |

## 7. Session setup

| Step | Content | Time |
|---|---|---|
| 1. Welcome and consent | Plain-language purpose, what's recorded, right to stop; **parent/guardian consent confirmed for under-18s** | 1–2 min |
| 2. Instructions | How tasks work, "Done" and "Give up", that some content is placeholder, search status (Section 12) | 1 min |
| 4. Tasks T1–T8 | Users complete tasks | 10–13 min |
| 5. Post-test | UMUX-Lite (2 items) + 2 open questions | 2 min |
| 6. Thank you  and close  | | <1 min |

## 8. Metrics

| Metric | Definition | Linked criteria |
|---|---|---|
| Task success rate | % reaching target URL (direct + indirect) | Objective, all SCs |
| Direct success rate | % reaching target with no backtracking | SC2, SC3 |
| Give-up / failure rate | % giving up, ending elsewhere or timing out | All |
| First-click accuracy | % whose first click was on a correct path | SC1, SC3 |
| Backtracks / path length | Back-steps and pages visited vs the optimal path | SC2, SC4 |
| Route used | E.g. logo vs menu vs breadcrumb (T8); "All UWA" equivalent vs other (T7); search attempts (T1) | SC1, SC4 |
| UMUX-Lite | Perceived usability, 0–100 | All |
| Open comments | Coded themes | All |

All metrics reported **per variant**, and **per variant × device**.

## 9. Analysis plan and decision criteria

### Analysis

- **80% threshold:** per task and overall, per variant and per device. Report "met" / "confidently met" (see Section 3).
- **Variant comparisons:** success rates V1 vs Control, V2 vs Control, V1 vs V2.
- **Multiple comparisons:** 8 tasks × 3 comparisons × 2 devices is a lot of tests. Treat per-task significance cautiously and lead with the overall pattern.
- **Segments:** directional feedback only.
- **Paths:** path diagrams (depending on platform support) for every task with < 80% success, to show where users go wrong.
- **Qualitative:** affinity-map open comments by variant and device.

## 10. Pre-launch QA and pilot

**Device matrix**: every variant checked on

- [ ] Desktop Chrome, Safari, Edge at 1440px and a common laptop width (1280/1366px)
- [ ] iPhone (Safari), current and one older model
- [ ] Android (Chrome), mid-range device
- [ ] Inside the testing tool's own browser frame/app on each

**Setup checks**

- [ ] All three variants live at Github Pages URLs; builds frozen
- [ ] Prototype access works inside the tool (password screen, `noindex`, embedding)
- [ ] Task wording, order rules and questions identical across variants

**Pilot**

- [ ] Internal dry run: 2–3 people per variant, desktop and mobile
- [ ] Soft launch if supported by platform: [5] participants per variant (mix of segments and devices); review data before releasing the rest
- [ ] Log any changes; exclude pilot data if tasks or setup changed materially

## 11. Roles

| Role | Name | Responsibilities |
|---|---|---|
| Study owner | Rebecca Lawrance | Decisions, sign-off |
| Researcher | Hugo Jenkins | Platform setup, pilot, monitoring, analysis, report |
| Prototype build | Hugo Jenkins | Variants, mobile layouts, freezes |
| UWA lead | Jack Kellett | Approvals, recruitment channels, ethics/safeguarding |

## 12. Open decisions

| # | Decision | 
|---|---|
| D1 | **Search:** enabled or disabled in all variants? | 
| D2 | **Microsite:** which one, and does it exist in all three variants? | 
| D3 | **Current students:** UWA students or students from other universities? | 

## 13. Report outline

1. Executive summary: 80% threshold result per variant and device; recommendation
2. Method and participants
3. Results against success criteria SC1–SC5
4. Task-by-task results with paths
5. Desktop vs mobile
6. Audience segments (directional)
7. Qualitative themes
8. Recommendations and next steps
9. Appendix: data tables, tasks, screener, consent
