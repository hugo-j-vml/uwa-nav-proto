# UWA Navigation Usability Test Plan: Remote Unmoderated

**Client:** The University of Western Australia (UWA) · **Agency:** VML · **Study owner:** Rebecca Lawrance · **Version:** 0.2 · **Date:** 5 November 2026
**Status:** Draft

---

## 1. Study summary

| Item | Detail |
|---|---|
| Method | Remote, unmoderated, task-based usability test of new navigation system |
| Variants | **Control** (existing navigation) · **Variant 1** (top bar) · **Variant 2** (side bar) |
| Participants | **240 total, 80 per variant**, across five audience segments (Section 6) · Each participant only sees one version|
| Devices | Desktop and mobile, [50/50] split within each variant |
| Session length | ~15–20 minutes: screener, tasks + short qualitative feedback at close |
| Platform | Shortlist: Lyssna, UXtweak, Maze |
| Budget | **$7,200** ($30 per participant × 240 |
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
| SC1 | Users understand where the navigation menu options are and how to access them | Stability, Consistency | T0, T1, T2 | First click, success, time to first menu interaction |
| SC2 | Users understand how to move back and forth through the IA levels in the menu | Orientation | T2, T3 | Success, directness, backtracks, path |
| SC3 | Users understand how to access parent pages for sections (e.g. Study, Research) | Orientation | T4, T5 | Success, first click, heading perception question |
| SC4 | Users understand when they are on a microsite menu, how to move back and forth, and how to switch between microsite and main site navigation | Stability, Orientation | T6, T7, T8 | Success, path, microsite awareness question |
| SC5 | Competency of the above across desktop and mobile | Consistency | All | All metrics compared by device |

## 4. Questions this research will address

| # | Question |
|---|---|
| RQ1 | Does each variant achieve > 80% task success, overall and on each task? |
| RQ2 | Does Variant 1 or Variant 2 outperform the Control on success, directness and ease? |
| RQ3 | Do users find and open the navigation straight away, on both devices? (SC1) |
| RQ4 | Can users move down, up and across IA levels without getting lost? (SC2) |
| RQ5 | Do users recognise and use section headings as links to parent pages? (SC3) |
| RQ6 | Do users recognise when they're in a microsite, and can they get back to the main site? (SC4) |
| RQ7 | Is performance consistent between desktop and mobile? (SC5) |
| RQ8 | Do results differ by audience segment (directional only, Section 9)? |

## 5. Variants

| Variant | Description | Neutral label (URL / tool) | Desktop ready | Mobile ready | Microsite included |
|---|---|---|---|---|---|
| **Control** | Existing UWA navigation | [e.g. `/a/`] | [ ] | [ ] | [ ] |
| **Variant 1** | Top bar navigation | [e.g. `/b/`] | [ ] | [ ] | [ ] |
| **Variant 2** | Side bar navigation | [e.g. `/c/`] | [ ] | [ ] | [ ] |

### Fair comparison rules

- **Control source (decision):** [ ] rebuild the existing navigation in the prototype at the same fidelity and on the same content, **or** [ ] test the live uwa.edu.au site. Rebuilding is strongly preferred: the live site differs in fidelity, content, page speed and search, and can change during fieldwork.
- **IA (decision):** [ ] all variants use the same IA (isolates the navigation pattern), **or** [ ] Control uses the current IA and V1/V2 the proposed IA (measures IA + nav together; effects can't be separated).
- **Same pages and microsite** in every variant, with identical titles, breadcrumbs and body content. Every task target must exist in all three.
- **Logo links home** in all variants.
- **Search treated the same** in all variants (Section 18).
- **Neutral URLs and names.** Never "new", "old" or "control" anywhere participants can see.
- **Same start pages** per task in every variant.
- **Clean state** between tasks and participants (no saved menu state).
- **Comparable load times** on desktop and mobile.
- **Frozen builds** for the whole fieldwork period.

## 6. Participants

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

### Over-recruitment

Expect to exclude 10–20% of sessions (Section 14). The current budget covers exactly 240. Recommend recruiting **[265–290]** to finish with 240 valid sessions, or agree that the final valid n may be lower (Section 12).

### Segment definitions and targeting

| Segment | Targeting |
|---|---|
| **HS domestic** | Australian residents in Years 9–12 [mix of years, e.g. at least half in Years 11–12]; [WA weighting, e.g. 60% WA / 40% other states]; considering university |
| **HS international** | Years 9–12 (or equivalent) outside Australia; considering studying at an Australian university; [target markets, e.g. Singapore, Malaysia, China, India, Indonesia, Vietnam]; able to complete the study in English |
| **Prospective PG** | Holds or is completing a bachelor's degree; considering postgraduate coursework or research study in the next [2] years; [domestic/international split] |
| **Current UG** | Currently enrolled in an undergraduate degree [at UWA / at any Australian university] |
| **Current PG** | Currently enrolled in postgraduate coursework or research [at UWA / at any Australian university] |

> **Familiarity bias.** Current UWA students (and UWA graduates in the prospective PG group) know the existing navigation, which advantages the Control. Either recruit current students from other universities, or recruit UWA students and report their results separately. [Decision: Section 18]

### Recruiting under-18s (needs attention)

**150 of 240 participants (62%) are high school students in Years 9–12, typically aged 14–17.** This shapes the whole study:

- **Panel access:** none of the three platforms' pricing pages state whether their panels include under-18s. Maze's core panel is powered by Prolific, which is adults-only. Assume the platform panels **cannot** supply under-18s until each vendor confirms in writing.
- **Consent:** participants under 18 need **parent/guardian consent** as well as their own assent. Build a consent step that captures both, or recruit through a channel that manages consent.
- **Likely recruitment routes:** UWA's future-student enquiry and event databases (with consent to contact), school partnerships and careers advisers, UWA international agents, or a specialist recruiter that handles minors [e.g. Askable, if it can recruit under-18s; confirm]. Then run the study on the platform with your own participant links.
- **Safeguarding and approvals:** confirm with UWA whether ethics review or child-safety approval is needed for a commercial UX study with minors, and follow WPP/VML policy on research with children.
- **Incentives:** check incentive types and amounts suitable for minors (e.g. gift cards paid via parents).
- **Data:** collect no more personal data than needed; avoid video/webcam recording of minors unless consented to and essential.

## 7. Tasks

### Guidelines

- Realistic scenarios in the user's words. **Never use navigation labels** in task wording.
- Same task set for **all** segments so results can be pooled and compared. Scenarios are written so a high school student, prospective PG or current student can all relate to them.
- One correct destination (or an agreed list of acceptable URLs) per task, set in **every** variant.
- Task order randomised after the warm-up, **except** T6 → T7 → T8, which run as a fixed microsite sequence (randomise its position among the other tasks).
- Each task has "Done" and "Give up" options, and a time limit of [4] minutes.

### Task set (draft)

| ID | Criterion / finding | Scenario (as shown to participant) | Start page | Target (all variants) | Success = |
|---|---|---|---|---|---|
| T0 | Warm-up · SC1 | "Take a quick look at this university website. When you're ready, find the page that tells you where the university's campus is." | Home | [Campus / Contact page] | Not analysed (except first click / time to open nav) |
| T1 | SC1 | "You're interested in studying [subject area, e.g. engineering]. Find the page for a course in that area." | Home | [Specific course page(s)] | Reaches any accepted course URL |
| T2 | SC1, SC2 | "You'd like to know what scholarships might help pay for your studies. Find information about scholarships for [your situation / international students]." | Home | [Scholarships page, L3–L4] | Reaches target URL |
| T3 | SC2 | "You're reading about a course and now want to find out about places to live while you study. Find information about student accommodation." | [Deep page under Study, e.g. course page] | [Accommodation page, in another branch] | Reaches target; path shows movement up/across levels |
| T4 | SC3 | "Find the main page that gives an overview of everything about research at the university." | [Any content page] | [Research L1 landing page] | Reaches L1 landing page |
| T5 | SC3 | "You're looking at one study area but want to see the full list of study areas the university offers. Find that page." | [A specific study area page, L3] | [Study areas L2 parent page] | Reaches L2 parent page |
| T6 | SC4 | "You've arrived on the website for [microsite, e.g. a research institute]. Find out who leads it / how to contact them." | [Microsite home] | [Page within microsite] | Reaches target within microsite |
| T7 | SC4 | "While you're here, you also want to find out how to apply to study at the university. Find that information." | [Microsite page from T6] | [Main site How to apply page] | Leaves microsite nav and reaches main site target |
| T8 | SC4 | "Go back to the university's main homepage." | [Deep microsite page] | [Main site home URL] | Reaches main home; report method (logo / menu / breadcrumb) |

[Confirm subject areas, scholarship type, microsite and all target URLs against the IA used in the variants.]

### Perception questions (asked once, after specific tasks)

| ID | After | Question | Purpose |
|---|---|---|---|
| PQ1 | T4 | Show a screenshot of an open menu panel with its heading highlighted: "Do you think you could click this heading?" (Yes, it's a link / No, it's just a title / Not sure) | Heading as link (SC3) |
| PQ2 | T7 | "During the last two tasks, were you on the main university website or a separate section of it?" (Main site / Separate section, e.g. an institute site / Not sure) | Microsite awareness (SC4) |

PQ1 needs a variant-specific screenshot. If a variant has no menu heading, adapt the question to that variant's equivalent parent-page link.

## 8. Session flow

| Step | Content | Time |
|---|---|---|
| 1. Welcome and consent | Plain-language purpose, what's recorded, right to stop; **parent/guardian consent confirmed for under-18s** | 1–2 min |
| 2. Screener confirmation | Segment and device check | 1 min |
| 3. Instructions | How tasks work, "Done" and "Give up", that some content is placeholder, search status (Section 18) | 1 min |
| 4. Warm-up (T0) | | 1–2 min |
| 5. Tasks T1–T8 | After each: **SEQ** "Overall, how easy or difficult was this task?" (1 = very difficult, 7 = very easy). PQ1 after T4, PQ2 after T7 | 10–13 min |
| 6. Post-test | UMUX-Lite (2 items) + 2 open questions | 2 min |
| 7. Thank you | Incentive details | <1 min |

Target **under 20 minutes**. Keep it shorter if possible for younger participants and mobile users; drop T0 analysis or T5 if piloting runs long.

## 9. Metrics

| Metric | Definition | Linked criteria |
|---|---|---|
| Task success rate | % reaching target URL (direct + indirect) | Objective, all SCs |
| Direct success rate | % reaching target with no backtracking | SC2, SC3 |
| Give-up / failure rate | % giving up, ending elsewhere or timing out | All |
| First-click accuracy | % whose first click was on a correct path | SC1, SC3 |
| Time to first nav interaction | Seconds until the first click on the navigation | SC1 |
| Time on task | Seconds to "Done", successful attempts only | All |
| Backtracks / path length | Back-steps and pages visited vs the optimal path | SC2, SC4 |
| Route used | E.g. logo vs menu vs breadcrumb (T8); "All UWA" equivalent vs other (T7); search attempts (T1) | SC1, SC4 |
| SEQ | Mean per-task ease (1–7) | All |
| PQ1 / PQ2 | % answering correctly | SC3, SC4 |
| UMUX-Lite | Perceived usability, 0–100 | Overall |
| Open comments | Coded themes | Secondary objective |

All metrics reported **per variant**, and **per variant × device**.

## 10. Analysis plan and decision criteria

### Analysis

- **80% threshold:** per task and overall, per variant and per device, with 95% confidence intervals (adjusted Wald). Report "met" and "confidently met" (Section 3).
- **Variant comparisons:** success rates V1 vs Control, V2 vs Control, V1 vs V2 (chi-square or Fisher's exact). Overall success compared using a model that accounts for repeated tasks per participant [e.g. logistic mixed model], or compare per-participant success counts.
- **Time on task:** geometric means; compare log-transformed times.
- **SEQ and UMUX-Lite:** means with confidence intervals.
- **Multiple comparisons:** 8 tasks × 3 comparisons × 2 devices is a lot of tests. Treat per-task significance cautiously (e.g. Holm correction) and lead with the overall pattern.
- **Segments:** directional only (Section 6).
- **Paths:** path diagrams for every task with < 80% success, to show where users go wrong.
- **Qualitative:** affinity-map open comments by variant and device.

### Decision criteria (agree before fieldwork)

| Outcome | Recommendation |
|---|---|
| One variant meets > 80% overall on desktop **and** mobile, and beats or matches Control | Progress that variant |
| Both variants meet the threshold | Choose on directness, SEQ, perception questions and qualitative feedback |
| A variant meets 80% on desktop but not mobile (or vice versa) | Progress with targeted fixes for the weaker device; re-test that device |
| Neither variant meets 80% | Use failing tasks and paths to revise; re-test before build |
| Specific tasks fail across all variants | Likely an IA or labelling issue rather than the navigation pattern; flag for IA review |

## 11. Platform comparison: Lyssna, UXtweak, Maze

Prices are in **USD** as published (no AUD pricing found) and were checked on 5 November 2026. Some details didn't load from the vendors' pages. Confirm everything with each vendor before choosing.

| | **Lyssna** | **UXtweak** | **Maze** |
|---|---|---|---|
| Plan needed | Growth: US$199/month, or US$165/month billed annually (US$1,990/yr). Live website and mobile testing are on Growth | Business: price not shown on the page at time of checking (a Dec 2025 UXtweak blog listed ~€92/month billed annually; unverified) | Plan names and prices not shown on the pricing page at time of checking; request a quote. Mobile testing tagged Enterprise |
| Live website testing | Yes (Growth) | Yes ("Website Testing") | Yes |
| Prototype testing | Yes (Free and up) | Yes (Figma or from scratch) | Yes |
| Mobile | Yes (Growth) | Mobile app testing listed; confirm mobile *web* testing of a URL | Yes; plan level to confirm |
| URL-based success + path tracking | Not stated on pricing pages; confirm | Not stated on pricing pages; confirm | Not stated on pricing pages; confirm |
| Seats | 5 (Growth); no extra seats | 1, upgradable to 3 (Business) | Not stated |
| Response limits | Unlimited self-recruited (Growth); 5 in-depth studies/month | 350 responses/month (upgradable to 750); 1–3 concurrent studies | Panel orders 1–250 participants per study |
| Own participants | Yes, unlimited on all plans, no extra cost | Yes ("Own database", up to 10,000 on Business) | Listed; confirm |
| Panel cost | US$1 per minute per response + US$2 screener + US$2 recording. A 20-min test ≈ **US$24 per response** before bulk discounts | Pre-paid panel add-on; price not stated | Credits US$5 each. Unmoderated B2C: 3 credits (core panel) ≈ **US$15**, 5 credits (extended) ≈ **US$25**, incentives included |
| Panel geography | 690k+ panellists, international; Australia coverage not stated | Business panel from 8 countries (not named); global on Custom | Core panel via Prolific; extended network for other regions; Australia coverage not stated |
| Under-18s | Not stated | Not stated | Not stated (Prolific is adults-only) |

### What matters most for this study

1. **Own-participant recruitment.** Because most of the sample is under 18, most participants will likely come through UWA or a specialist recruiter, not the platform panel. Lyssna (unlimited own responses on Growth) and UXtweak (own database) both state support. With 240+ responses, UXtweak's **350 responses/month** cap is enough if fieldwork stays within a month.
2. **Testing the Control and prototypes in the same way.** If the Control is the live site, check each tool's live-website method works on both the live site and the hosted prototype. Some tools need a script snippet on the site being tested.
3. **Mobile web testing** of a URL, with path and click capture on phones.
4. **Between-subjects setup.** Three parallel studies (one per variant) with random assignment from a single recruitment link, or built-in A/B assignment.
5. **Path analysis and first-click reporting**, plus CSV export for the confidence-interval analysis.

**Recommendation:** run a free trial of Lyssna and UXtweak, and get a Maze quote. Pilot one task on the live site and the prototype, on desktop and mobile, in each tool. Pick on (a) path/first-click quality, (b) mobile behaviour and (c) handling of own participants. [Add quality notes after the trial.]

## 12. Budget

| Item | Estimate | Notes |
|---|---|---|
| Participants | $7,200 | $30 × 240. [Confirm AUD] |
| Over-recruitment (10–20%) | [$720–$1,440] | Not currently budgeted |
| Platform subscription | [e.g. Lyssna Growth US$199 for one month, or annual] | Not currently budgeted; confirm whether VML/WPP already holds a licence |
| Specialist recruitment (under-18s, international) | [Quote] | Likely higher than $30 per head for minors and international students |
| Incentives for own-recruited participants | Within $30 pp? | [Confirm amount suitable for a ~20-min session, e.g. A$20–30 gift card] |

**Check:** $30 per participant has to cover recruitment *and* incentive if it's a panel price. Approximate panel costs per response for a 20-minute test: Lyssna ≈ US$24, Maze ≈ US$15–25. Depending on the exchange rate, Lyssna and Maze's extended network may exceed A$30. Panels are also unlikely to supply the under-18 segments at all (Section 6).

## 13. Pre-launch QA and pilot

**Device matrix**: every variant checked on

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

## 14. Data quality and exclusions

Agree before fieldwork; apply the same rules to every variant:

- Total session time under [4] minutes, or straight-lining on ratings
- Technical failure (prototype didn't load, recording incomplete)
- Wrong device for assigned device quota
- Failed screener checks or nonsense open answers
- Task time over [4] minutes is counted as a failure, not excluded

Report exclusions per variant, device and segment.

## 15. Ethics, privacy and accessibility

- Informed consent for all; **parent/guardian consent plus participant assent for under-18s** (Section 6).
- Confirm with UWA whether ethics or child-safety review is required, and follow WPP/VML policy for research with minors.
- Collect only the personal data needed; no names in reports. Confirm where the platform stores data and for how long (Australian data residency requirements, if any).
- International participants: confirm privacy requirements in each target market.
- Check variants work with keyboard and at common zoom levels. Unmoderated panel testing won't represent assistive technology users well; plan separate sessions if accessibility is in scope.

## 16. Timeline

| Week | Activity |
|---|---|
| [W1] | Confirm decisions (Section 18); agree success definition and decision criteria; platform trial |
| [W1–2] | Finalise tasks and target URLs; freeze variants; consent flow; recruitment brief and approvals for minors |
| [W2–3] | Device QA, internal dry run, soft launch |
| [W3–4] | Full fieldwork (allow longer for under-18 and international recruitment) |
| [W5] | Analysis |
| [W6] | Report and playback to UWA |

## 17. Roles

| Role | Name | Responsibilities |
|---|---|---|
| Study owner | [Hugo Jenkins?] | Plan, decisions, sign-off |
| Researcher | [ ] | Platform setup, pilot, monitoring, analysis, report |
| Prototype build | [ ] | Variants, mobile layouts, microsite, freezes |
| UWA lead | [ ] | Approvals, recruitment channels, ethics/safeguarding, privacy sign-off |
| Recruiter | [ ] | Under-18 and international recruitment, consent |

## 18. Open decisions

| # | Decision | Why it matters |
|---|---|---|
| D1 | **How to recruit and consent 150 under-18s** | Platform panels likely can't supply them; changes recruiter, budget, timeline and ethics needs |
| D2 | **Budget scope:** AUD? Does $30 pp cover panel/recruitment fees, incentive, or both? Are platform fees and over-recruitment extra? | $7,200 covers exactly 240 with no buffer |
| D3 | **Control:** rebuilt prototype or the live site? | Fidelity, content and search differences would bias the comparison |
| D4 | **IA:** same IA in all variants, or current IA in Control? | Determines whether results are about the nav pattern or IA + nav |
| D5 | **80% threshold:** per task, overall, per device; "met" vs "confidently met"; must a variant also beat Control? | Sets the pass/fail rule |
| D6 | **Search:** enabled or disabled in all variants? | Search is a common way users find courses. Disabled search can depress T1 results |
| D7 | **Mobile readiness:** are V1 and V2 mobile layouts built? Device split 50/50? | SC5 can't be tested without them |
| D8 | **Microsite:** which one, and does it exist in all three variants? | Needed for T6–T8 (SC4) |
| D9 | **Current students:** UWA students or students from other universities? | UWA students know the existing nav (favours Control) |
| D10 | **International HS markets** and English level | Targeting, recruitment channel, incentives, time zones |
| D11 | **Platform choice** after trial | Section 11 |

## 19. Report outline

1. Executive summary: 80% threshold result per variant and device; recommendation
2. Method and participants (incl. exclusions)
3. Results against success criteria SC1–SC5
4. Task-by-task results with paths
5. Desktop vs mobile
6. Audience segments (directional)
7. Qualitative themes
8. Recommendations and next steps
9. Appendix: data tables, tasks, screener, consent
