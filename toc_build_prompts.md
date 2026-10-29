# Build Prompts: Weeks 9–13 Workbench and Decks

Prompts for building everything in `toc_buildplan.md` §7. Run one prompt per Claude Code session, in the order below; each stage must be ready before its class.

| Order | Prompt | Builds | Ready by |
|---|---|---|---|
| 1 | T1 | Workbench core and week 9 screens | Week 9 |
| 2 | D9 | Week 9 deck | Week 9 |
| 3 | T2 | Workbench week 10 screens | Week 10 |
| 4 | D10 | Week 10 deck | Week 10 |
| 5 | T3 | Workbench week 11 screens | Week 11 |
| 6 | D11 | Week 11 deck | Week 11 |
| 7 | T4 | Workbench week 12 screens | Week 12 |
| 8 | D12 | Week 12 deck | Week 12 |
| 9 | T5 | Workbench week 13 screens, class view, final acceptance | Week 13 |
| 10 | D13 | Week 13 deck | Week 13 |

Each prompt begins "Follow the standing instructions in `toc_build_prompts.md` §0", so paste the prompt as it stands; the session reads §0 from the repository.

---

## §0 Standing instructions (apply to every prompt)

1. Read `CLAUDE.md`, `toc_buildplan.md` (all of it), and the sections of the core reading named in your prompt: `ToCBasics.pdf` [TC] and `ToCgov.pdf` [GAF]. Page numbers refer to those PDFs. [GAF] is image-only: read the pages visually.
2. Follow `CLAUDE.md`'s process: reply first with a short build plan for **this stage only** (components, state fields touched, any deviation from `toc_buildplan.md`, questions), then wait for approval, then build.
3. **The client brief is confidential.** Never ask for it, quote it, summarise it or put any of its content in a file, commit, comment or test. Tools and decks refer to it only as "the client brief (on the VLE)". Students type what they use from it, with slide numbers.
4. **Quotations from the readings** must match the PDF exactly and carry a page reference, for example "([TC] p. 3)". Check every quotation against the page before committing. Do not paraphrase inside quotation marks.
5. Never invent study findings, statistics, citations or facts about real places. Any invented example or placeholder text starts with `PLACEHOLDER:` and goes in your final report.
6. Use the vocabulary in `toc_buildplan.md` §3.2: [TC] terms first, [GAF] equivalents in the glossary.
7. UK English. Follow the prose rules in `SLIDES.md` §11 in decks: no dashes as punctuation, no "it is not X, it is Y".
8. Run `test.html` headless (see `CLAUDE.md` Testing) before committing; all tests must pass. Decks also run the four `SLIDES.md` §13 harnesses.
9. Commit with a clear message and push to your working branch. Do not open a pull request unless asked.
10. Final report:
   - what was built;
   - acceptance results, each item pass or fail with evidence;
   - every `PLACEHOLDER:` string;
   - every quotation, with its page;
   - anything deferred.

---

## T1 — Workbench core and week 9 screens

```
Follow the standing instructions in toc_build_prompts.md §0.

Build week9-toc-workbench.html (Activity 15, "Bodø Theory of Change"), stage 1 of 5: the core of the tool plus the week 9 screens. Spec: toc_buildplan.md §4, §6 (Week 9), §7. Reading: [TC] pp. 1–4; [GAF] pp. 8–15 and 43–44.

Match the visual language of third-place-decoder.html and third-place-lab.html (the week 2–3 tools) and the newer conventions in week6b-adjudication-bench.html and week7-bodo-decline.html (header and footer, CONFIG pattern, export header documentation, A6 card printing). Light theme.

CORE (used by all later stages; build it to last):
- One CONFIG object at the top, heavily commented, holding all copy, including:
  - the glossary crosswalk (plan §3.2);
  - the reading references per screen (plan §7.1);
  - the self-check questions for plausible, doable and testable ([TC] p. 9);
  - per-field minimum word counts;
  - roles: Facilitator, Scribe, Sceptic, Evidence lead, Timekeeper (groups of 5 only), each with a one-line duty;
  - the activity-verb and "and" lint lists;
  - the soft cap of 15 outcomes;
  - week 7 facts copied from week7-bodo-decline.html CONFIG.facts with their sources.
- The full state shape from plan §7.2, created with defaults now, so exports from week 9 import cleanly into later stages. Document it in the file header as schemaVersion 1. Include a migrate(state) function that fills missing fields with defaults.
- Screen navigation for all 14 screens in plan §7.1. Screens not yet built show "Arrives in week N" and their reading references. Earlier screens always stay editable.
- Revision log: an edit to a screen from a closed week is logged with a timestamp. A week closes when its self-check is completed.
- A side panel on every screen with the glossary, the screen's reading references and the self-check.
- Autosave to localStorage (key namespaced by tool and schema version, try/catch), Reset with confirm, Export JSON, Import JSON (validate, confirm, readable errors), Copy as text, an A4 print stylesheet, and an A6 card printer (four per A4, cut lines). Make the last three generic, so later stages add sections and cards without rewriting them.
- A reusable word-counted textarea component that enforces minimum words with a live count; one character never passes.
- A reusable gate component: a list of checks with specific messages; the next step stays disabled until all pass. Nothing is scored.
- Roles: on setup and at the start of each week, assign roles to members. Rotation is suggested (no member holds the same role two weeks running) but can be overridden.
- "Find out first" list: a shared store that any screen can add to, showing each item's source.

WEEK 9 SCREENS (plan §6 Week 9):
1. Setup: group name, 3–5 member names, roles for week 9, optional week 7 export import (schemaVersion 2; the sentences appear as draft problem statements).
2. Client's intended impact:
   - claim cards typed by students, each with a required slide number;
   - order the cards into a chain;
   - mark each link "evidence given in the brief" or "not given";
   - the client's stated ambition, with its slide number;
   - "whose community?" (word-counted).
   The screen states that the brief is on the VLE and is not stored in this tool.
3. Problem and long-term outcome:
   - problem statement naming at least one decline claim (SUPPLY, USE, QUALITY, OUTCOME), with where and for whom;
   - positive opposite: a long-term outcome phrased as a condition, with a lint for activity verbs and negatives;
   - definitions: each key term with its meaning, and at least one required;
   - accountability ceiling: ultimate goal, and the client's ambition placed above, at or below it, with a reason.
   Show the guidance from [TC] pp. 3–4 beside each part.
4. Stakeholders: [GAF] p. 8's eight questions as prompts; each stakeholder has affected yes/no, influence and interest (low/medium/high), "from the brief" with slide, and "can we ask?". Every "no" adds a find-out-first item.
- Week 9 close: self-check, then print the long-term outcome A6 card.

REPOSITORY:
- Card in index.html (Activity 15 · Weeks 9–13) inside .activity-grid.
- CLAUDE.md Files entry.
- Tests in test.html for:
  - CONFIG integrity (every role has a duty, every screen has reading refs);
  - the word counter;
  - the gate logic;
  - the lint functions;
  - migrate();
  - export and import round trip;
  - absence of smart quotes in JS strings.

ACCEPTANCE: plan §9 items 1, 3, 4, 7, 8, 11 and 14 for the week 9 screens; plus: an export made now imports with every later-stage field present and empty.
```

---

## T2 — Workbench week 10 screens: backwards mapping

```
Follow the standing instructions in toc_build_prompts.md §0.

Stage 2 of 5 of week9-toc-workbench.html: the week 10 screens. Spec: toc_buildplan.md §4 (principles 2, 3, 5, 6, 7, 11), §6 Week 10, §7. Reading: [TC] pp. 4–6; [GAF] pp. 16–18, 23–26, 29–31. Do not change the stage 1 state shape except by adding defaults through migrate().

SCREEN 5, BACKWARDS MAP:
- Outcomes are edited as structured lists, never by drag-and-drop:
  - text;
  - level (early, intermediate, or the long-term outcome from screen 3);
  - pathway label;
  - lenses (PSYCHOLOGICAL, POLITICAL, ECONOMIC);
  - characteristics (the eight);
  - "leads to" (one or more higher outcomes or a cluster).
- Clusters ([TC] p. 4): group preconditions that act together; a cluster has one "leads to".
- Each arrow (link) needs a rationale (word-counted): "X is needed for Y because ...".
- Lint on outcome text: activity verbs ("build", "run", "offer", "host", ...) and " and " ([GAF] p. 16 quotation on the warning).
- Soft cap warning above CONFIG.maxOutcomes ([GAF] p. 5, proportionality).
- Live inline SVG diagram, laid out by level (early at the bottom, long-term outcome at the top), with the accountability ceiling as a dashed line above the long-term outcome and the ultimate goal above it ([TC] p. 3). Clusters are drawn as a bordered group with one arrow. Characteristic colours for pathway accents. No overlapping boxes at 360px (the diagram scrolls horizontally inside its own container; the page never does). Keyboard: every outcome and arrow in the diagram is focusable and opens its editor.

SCREEN 6, ASSUMPTIONS AND EVIDENCE:
- Sorter ([TC] p. 6, plan §4.2). Any belief typed anywhere ("add a belief" is available on screens 5 and 6) asks one question: "Is this already true in Bodø today?"
  - Yes, with evidence → assumption register (linked to an arrow).
  - No → offered as a new precondition on the map.
  - We cannot know without access to residents → find-out-first.
  Nothing enters the register without passing the sorter. Show [TC] p. 6's quotation ("assumptions are already in place and do not need to be brought about").
- Evidence log:
  - summary, source, type (course reading, week 5 field data, week 6 adjudication, week 7 Bodø fact, client brief with slide, parallel-course claim, other);
  - optional ratings on the four week 6 criteria, copied with definitions and questions from week6b-adjudication-bench.html CONFIG.criteria and using its rating scale;
  - scope conditions carry the Bodø verdict (travels, bends, breaks, unknown);
  - each item attaches to rationales and assumptions.
- Reverse Import: one entry per member (course, claim, link, stance support/challenge).
- Completeness pass: once the map has no unconnected outcome, prompt a second sweep for assumptions per arrow ([TC] p. 6, "when you think the outcomes framework is complete").
- Week 10 close: self-check. Gate for later stages: every outcome reaches the long-term outcome, every arrow has a rationale, every belief has been sorted.

PRINT: the full diagram on A4 landscape and A3; the assumption register on A4. Copy as text includes both.

TESTS: graph functions (reachability to the long-term outcome, cycle detection, cluster handling), layout (no overlaps across 30 random maps of up to 15 outcomes), sorter routing, lint, migrate() from a stage 1 export.

ACCEPTANCE: plan §9 items 5, 7, 8, 10 (diagram), 11 and 14.
```

---

## T3 — Workbench week 11 screens: interventions

```
Follow the standing instructions in toc_build_prompts.md §0.

Stage 3 of 5 of week9-toc-workbench.html: the week 11 screens. Spec: toc_buildplan.md §4 (principle 4), §6 Week 11, §7. Reading: [TC] p. 7; [GAF] p. 11 (questions 6–7), pp. 19–22, 27–28.

DESIGN LOCK: screens 7–9 stay locked until the week 10 gate passes, with a message listing what is missing. Show [TC] p. 7's quotation ("we deliberately ask groups to hold off on interventions").

SCREEN 7, OPTIONS APPRAISAL:
- At least two options: summary, location, and a word-counted judgement each for plausible, doable and testable ([TC] p. 9).
- Choose one and record why each other option was rejected.
- Show [GAF] p. 11's "alternative strategies" question.

SCREEN 8, INTERVENTIONS:
- Each intervention: name, activities, and one or more arrows from the map ([TC] p. 7: interventions sit on the connector from a precondition to the outcome it helps produce).
- Each intervention also records the characteristics it protects or produces.
- Interventions appear on the SVG diagram as markers on their arrows.
- Shoehorn check: an intervention with no arrow is flagged, with [TC] p. 7's "it's best not to shoehorn them in".
- Gap walk: list every arrow with no intervention; each must be marked "needs an intervention" (blocking) or "covered by an assumption" (choose one from the register).
- Inputs per intervention ([GAF] p. 21): resource, whether it comes from the brief (slide number required) or is our assumption, and the limitation questions (ring-fenced? skills? time limits on facilities?).

SCREEN 9, RISKS AND STRESS TEST:
- Risks ([GAF] p. 27): text, internal or external, likelihood (low/medium/high), mitigation, linked intervention. Show the definition quotation and the three questions.
- Explain the difference from an assumption beside the form.
- Stadium stress test: for each of the eight characteristics, how this setting could threaten it, and which intervention protects it (or "none yet", which goes to the risk register). The general question bank lives in CONFIG.stressQuestions. It must contain no brief content; a field invites groups to add their own question drawn from the brief.
- Week 11 close: self-check; print A6 cards for the three assumptions the group marks riskiest.

TESTS: lock logic, shoehorn and gap-walk checks, marker placement on arrows, migrate() from a stage 2 export.

ACCEPTANCE: plan §9 items 6, 7, 8, 10 (A6 cards), 11 and 14.
```

---

## T4 — Workbench week 12 screens: indicators and outside review

```
Follow the standing instructions in toc_build_prompts.md §0.

Stage 4 of 5 of week9-toc-workbench.html: the week 12 screens. Spec: toc_buildplan.md §4 (principles 8, 9), §6 Week 12, §7. Reading: [TC] pp. 8–9; [GAF] pp. 31, 37–42, 47–48.

SCREEN 10, INDICATORS AND M&E FRAMEWORK:
- "Share out" button: assigns outcomes to members in turn ([TC] p. 9: indicator development does not lend itself to group meetings); the owner can be changed.
- Per indicator:
  - [TC] p. 8's four targets: how many, of whom, what level, by when;
  - [GAF] p. 39's columns: definition, baseline (a value with its source, or "unknown": unknown adds a find-out-first item automatically), data source, frequency, responsible, reporting.
- Every outcome needs at least one indicator.
- Timeline check ([TC] p. 8, [GAF] p. 31): flag any outcome whose "by when" is earlier than any of its preconditions'. "By when" is entered as months after opening.
- Output: the M&E framework table on A4 landscape, and the find-out-first list grouped by source as the first-year learning plan.

SCREEN 11, OUTSIDE REVIEW:
- Author mode: export a review copy (the full state plus a review request).
- Reviewer mode: import another group's review copy; reviewer group name and members. Walk the review link by link:
  - [TC] p. 9's plausibility, feasibility and testability questions, quoted exactly;
  - then [GAF] p. 47's quality factors: consistent definitions and terms (check against the screen 3 definitions), stakeholders considered, context and evidence clear.
- Required: name the weakest assumption and propose how the club could test it; flag any claim above the accountability ceiling.
- Export the review file.
- Author mode, respond: import the review; every challenge needs accept, revise or rebut (word-counted reason). Revise jumps to the right screen and logs the change.
- The reviewer never edits the author's work.

TESTS: timeline check, share-out, baseline-to-find-out-first routing, review file round trip (a review made on one group's copy imports into that group only, matched by group name and export id), migrate() from a stage 3 export.

ACCEPTANCE: plan §9 items 7, 8, 10 (M&E table), 11 and 14; plus: a review exported by group A for group B is refused by group C with a readable message.
```

---

## T5 — Workbench week 13 screens, class view, final acceptance

```
Follow the standing instructions in toc_build_prompts.md §0.

Stage 5 of 5 of week9-toc-workbench.html: the week 13 screens, the class view, and full acceptance. Spec: toc_buildplan.md §1, §4 (principle 10), §6 Week 13, §7, §8, §9. Reading: [TC] p. 9 (§8 Narrative); [GAF] pp. 32–36.

SCREEN 12, DIAGRAMS AND NARRATIVE:
- Full diagram: everything, printable A3 or A4 landscape.
- Client diagram ([GAF] p. 32, "multiple versions ... for different users"): the group picks which outcomes and arrows to show, and the ceiling always shows. Gate: it fits one A4 page at readable size (body text at least 9pt in print).
- Narrative ([TC] p. 9: "one or two pages"):
  - an executive summary in plain English, drafted by one named member and then marked "reviewed by the group";
  - the other sections pre-assembled from workbench fields and editable.
  Word limit in CONFIG (default about 900 words for the narrative). Plain-language check against CONFIG.jargon.

SCREEN 13, RECOMMENDATION AND OUTPUTS:
- The recommendation sentence in the plan §1 shape, each slot pre-filled from the workbench and editable; every slot required.
- Values check: the client's stated values, typed with slide numbers. For each: does the recommendation speak to it, and at what cost to any characteristic? Plus "what is specific to Bodø rather than copied?"
- Outputs:
  - the recommendation pack in the plan §8 order (A4; narrative at most two pages, then appendix);
  - both diagrams;
  - A6 cards: the recommendation, plus the existing long-term outcome and riskiest-assumption cards;
  - Copy as text for the whole pack.

SCREEN 14, CLASS VIEW (instructor):
- Load any number of group exports.
- Show side by side: recommendation sentences, long-term outcomes, ceiling placements, interventions by characteristic protected, the riskiest assumptions across groups, and the most common find-out-first items.
- Projector-friendly layout. No scores or rankings.

FINAL ACCEPTANCE: run every item in plan §9 against the finished file and report each.
- Walk a complete group through weeks 9 to 13 with test data marked PLACEHOLDER:.
- Check that no brief content exists in the repository: ask the user for a list of brief terms to grep, and do not store the list.
- Update the CLAUDE.md entry to describe the finished tool.

TESTS: narrative word limit, client-diagram fit, recommendation slot completion, class view aggregation across 8 synthetic exports, migrate() from a stage 4 export.
```

---

## Deck prompts: shared brief

Every deck prompt below includes this paragraph. It is repeated in each prompt so that each runs alone.

> Build a projection deck to `SLIDES.md`, with `theory-of-change.html` as the reference implementation: 16:9 stage, rem units, the type scale, slide anatomy, the archetypes in §6, the interactions in §7, ink tones for gold and orange text, print and narrow layouts, and all four §13 harnesses. Cycle slide accents so no two adjacent slides share a hue. The deck opens the session (about 10–12 minutes, including the reading check) and then stays on screen: "In the workbench" slides carry a block title, the minutes, the screen number in `week9-toc-workbench.html`, three to five tasks, and the roles leading the block. Add an optional block countdown on those slides (start, pause and reset in the chrome; it idles out like the nav, honours reduced motion, and must not break fit). The deck contains no client brief content; it refers students to "the client brief (on the VLE)". Reading-check answers must be supported by the cited page; quote the page in the feedback text.

---

## D9 — Week 9 deck: "Where Are We Going?"

```
Follow the standing instructions in toc_build_prompts.md §0, and the deck brief in the "Deck prompts: shared brief" section of that file.

Build week9-toc-deck.html (Activity 16). Spec: toc_buildplan.md §3, §4 (principles 1, 12), §6 Week 9. Reading: [TC] pp. 1–4; [GAF] pp. 8–15, 43–44.

SLIDES (about 15):
1. Title poster. Eyebrow "Week 9 · Intervene". Title "Where Are We Going?". Lede: the next five weeks build one recommendation to the client.
2. Sequence band: describe, explain, adjudicate, intervene (intervene current). Second band: weeks 9–15 (9 long-term outcome, 10 backwards map, 11 interventions, 12 indicators and review, 13 recommendation, 14 rehearse, 15 client).
3. Numbered cards: the three readings ([TC], [GAF], [A7]): what each is for, with the course file names.
4. Card grid or table: the terms crosswalk (toc_buildplan.md §3.2).
5–7. Reading check, three single-select slides:
   - (a) What do Taplin and Clark call perhaps the most important step? Correct: getting the long-term outcome right ([TC] p. 3).
   - (b) What does an accountability ceiling separate? Correct: the long-term outcome the group is accountable for, from an ultimate goal it links to but will not hold itself accountable for ([TC] p. 3).
   - (c) Who counts as a stakeholder? Correct: everyone directly or indirectly affected by, or with influence on, the outcomes ([GAF] p. 8).
   Distractors must be plausible and clearly wrong on the page.
8. Quote plus commentary: "Perhaps the most important step in the entire ToC process is getting the long-term outcome right." ([TC] p. 3). Commentary: why today is spent on one sentence.
9. Horizontal chain: problem statement → positive opposite → shared definitions → accountability ceiling, with direction labels. Use [TC] p. 4's own example (neighbourhood violent crime → a safe neighbourhood → agree what "safe" means and the boundaries).
10. Split with panel, "Whose community?": Oldenburg's third place (informal sociability among individuals; neutral ground; the leveller) beside the question every group must answer about the client's meaning. No brief content.
11. Card grid: [GAF] p. 8's eight stakeholder questions, plus the rule that a stakeholder we cannot ask creates a find-out-first item.
12. Card grid: the five group roles and their duties ([GAF] pp. 43–44: facilitators, everyone heard).
13–16. In the workbench:
   - 12–30 client's intended impact (screen 2);
   - 30–50 problem → long-term outcome (screen 3);
   - 50–60 definitions and ceiling (screen 3);
   - 60–83 stakeholders (screen 4).
17. Close: self-check (plausible, doable, testable, [TC] p. 9); print the long-term outcome card; export; pre-reading for week 10 ([TC] pp. 4–6; [GAF] Steps 4, 7, 9).

Add the index.html card and the CLAUDE.md entry.
```

---

## D10 — Week 10 deck: "What Must Be True?"

```
Follow the standing instructions in toc_build_prompts.md §0, and the deck brief in the "Deck prompts: shared brief" section of that file.

Build week10-toc-deck.html (Activity 17). Spec: toc_buildplan.md §4 (principles 2, 3, 5, 6, 7), §6 Week 10. Reading: [TC] pp. 4–6; [GAF] pp. 16–18, 23–26, 29–31.

SLIDES (about 16):
1. Title poster. Eyebrow "Week 10 · Intervene". Title "What Must Be True?".
2. Sequence band: weeks 9–15, week 10 current.
3–5. Reading check, single-select:
   - (a) What separates an assumption from a precondition? Correct: an assumption is already in place; a precondition must be brought about ([TC] p. 6).
   - (b) What does an "and" in an outcome tell you? Correct: split it into separate outcomes ([GAF] p. 16).
   - (c) What is a cluster? Correct: preconditions that belong together and act as a joint precondition ([TC] p. 4).
6. Horizontal chain with direction bands: early outcomes → intermediate outcomes → long-term outcome. Design runs backwards ("what must be true for this?"); change flows forwards.
7. Card grid of four: precondition, assumption, rationale, risk. Each with a one-line definition and its source page ([TC] p. 6; [GAF] p. 27).
8. Quote plus commentary: "assumptions are already in place and do not need to be brought about" ([TC] p. 6). Commentary: [GAF] p. 23 uses "assumption" more broadly, including beliefs about links; this course follows Taplin and Clark, as Activity 7 does: the "why" on each arrow is a rationale, and an assumption is a condition already in place. Today we keep them apart.
9. The sorter, as a chain: "Is this already true in Bodø today?" Yes → assumption register; No → precondition on the map; Can't know without residents → find out first.
10. Sorting practice, single-select per item, using [TC] p. 6's employment example: "suitable, decent-paying jobs exist" (precondition) and "existing public transportation will continue to operate" (assumption). Add at most two further items about a hypothetical third place, each prefixed PLACEHOLDER: for instructor review, including one that sorts to "find out first".
11. Split with panel: outcome wording. Positive conditions ([TC] p. 4); one change per outcome (quote [GAF] p. 16 exactly); activity verbs belong to interventions in week 11.
12. Card grid of four: the week 6 adjudication criteria (labels and definitions copied from week6b-adjudication-bench.html CONFIG.criteria). Scope conditions carry the week 7 Bodø verdict.
13. Reverse Import: each student places one claim from a parallel course on one link, as support or challenge.
14–17. In the workbench:
   - 12–45 backwards map (screen 5);
   - 45–65 rationales and assumptions as they come out (screens 5–6, Sceptic leads);
   - 65–80 evidence and Reverse Import (screen 6, Evidence lead leads);
   - 80–90 completeness pass and close.
18. Close: self-check; export; pre-reading for week 11 ([TC] p. 7; [GAF] p. 11 and Steps 5, 6, 8).

Add the index.html card and the CLAUDE.md entry.
```

---

## D11 — Week 11 deck: "What Should the Club Build?"

```
Follow the standing instructions in toc_build_prompts.md §0, and the deck brief in the "Deck prompts: shared brief" section of that file.

Build week11-toc-deck.html (Activity 18). Spec: toc_buildplan.md §4 (principle 4), §6 Week 11. Reading: [TC] p. 7; [GAF] pp. 11, 19–22, 27–28.

SLIDES (about 16):
1. Title poster. Eyebrow "Week 11 · Intervene". Title "What Should the Club Build?".
2. Quote plus commentary: "we deliberately ask groups to hold off on interventions" ([TC] p. 7). Commentary: why design unlocks only now.
3–5. Reading check, single-select:
   - (a) Where does an intervention sit on the outcomes framework? Correct: on the connector from the precondition to the outcome it helps produce ([TC] p. 7).
   - (b) Which list does [GAF] give as possible inputs? Correct: funding, existing structures, people and partners, intelligence, and policies ([GAF] p. 21).
   - (c) What is a risk? Correct: an internal or external factor that can influence the programme positively or negatively ([GAF] p. 27).
6. Numbered cards: strategy, intervention, activity, as [TC] p. 7 defines them.
7. Split with panel: options appraisal. [GAF] p. 11 "Are there alternative strategies to meet your aims?"; each option tested as plausible, doable, testable ([TC] p. 9); one chosen, the rest rejected with reasons.
8. Chain: placing interventions on arrows, then the gap walk (every arrow is served by an intervention or covered by an assumption). Quote "it's best not to shoehorn them in" ([TC] p. 7).
9. Card grid: inputs and [GAF] p. 21's limitation questions (ring-fenced budget? the right skills? time limits on facilities?). Constraints from the brief are cited by slide; anything else is stated as an assumption.
10. Split with panel: risk versus assumption, with [GAF] p. 27's three questions.
11. Card grid of eight, one per characteristic in its colour: the stadium stress test, two general questions each (from the workbench CONFIG.stressQuestions; no brief content).
12–16. In the workbench:
   - 12–30 options (screen 7);
   - 30–55 interventions and gap walk (screen 8);
   - 55–70 inputs (screen 8);
   - 70–85 risks and stress test (screen 9);
   - 85–90 close.
17. Close: self-check; print the riskiest-assumption cards; export; pre-reading for week 12 ([TC] pp. 8–9; [GAF] Step 11 and pp. 47–48).

Add the index.html card and the CLAUDE.md entry.
```

---

## D12 — Week 12 deck: "Will the Club Know?"

```
Follow the standing instructions in toc_build_prompts.md §0, and the deck brief in the "Deck prompts: shared brief" section of that file.

Build week12-toc-deck.html (Activity 19). Spec: toc_buildplan.md §4 (principles 8, 9), §6 Week 12. Reading: [TC] pp. 8–9; [GAF] pp. 31, 37–42, 47–48.

SLIDES (about 15):
1. Title poster. Eyebrow "Week 12 · Intervene". Title "Will the Club Know?".
2. Quote plus commentary: "How many of who or what will reach what level by when?" ([TC] p. 8).
3–5. Reading check, single-select:
   - (a) What does testability refer to? Correct: how well the indicators are crafted ([TC] p. 9).
   - (b) What does a baseline record? Correct: the current value, the starting point ([GAF] p. 39).
   - (c) When should quality review happen? Correct: throughout construction ([TC] p. 9, "an ongoing process during the construction of your theory").
6. Numbered cards: the four targets, each with a generic illustration marked PLACEHOLDER:.
7. Table archetype: [GAF] p. 39's M&E framework rows (indicator, definition, baseline, target, data source, frequency, responsible, reporting), with what each means for the club.
8. Split with panel: unknown baselines. Without access to residents, most baselines are unknown; each becomes a find-out-first item, and together they form the club's first-year plan.
9. Chain: timeline consistency. An outcome cannot be due before its preconditions ([TC] p. 8; [GAF] p. 31).
10. Numbered cards: plausible, doable, testable, each with [TC] p. 9's questions quoted exactly.
11. Card grid: being an outside reviewer. [GAF] p. 47's quality factors; how to write a fair, specific challenge; naming the weakest assumption and how to test it; flagging claims above the ceiling.
12. Card grid: responding to a review (accept, revise, rebut with a reason).
13–15. In the workbench:
   - 10–40 indicators, shared out (screen 10);
   - 40–72 outside review (screen 11, reviewer mode);
   - 72–90 respond (screen 11, author mode).
16. Close: export; pre-reading for week 13 ([TC] p. 9 §8; [GAF] Step 10).

Add the index.html card and the CLAUDE.md entry.
```

---

## D13 — Week 13 deck: "The Recommendation"

```
Follow the standing instructions in toc_build_prompts.md §0, and the deck brief in the "Deck prompts: shared brief" section of that file.

Build week13-toc-deck.html (Activity 20). Spec: toc_buildplan.md §1, §4 (principle 10), §6 Week 13, §8. Reading: [TC] p. 9; [GAF] pp. 32–36.

SLIDES (about 14):
1. Title poster. Eyebrow "Week 13 · Intervene". Title "The Recommendation".
2. Quote plus commentary: "It may also be helpful to have multiple versions of your visualisation with different levels of detail for different users." ([GAF] p. 32).
3–5. Reading check, single-select:
   - (a) How long should a narrative be? Correct: one or two pages ([TC] p. 9).
   - (b) What two purposes does the narrative serve? Correct: to convey the theory's major elements easily and quickly to others, and to understand how the elements work as a whole ([TC] p. 9).
   - (c) When should a ToC be updated? Correct: when new evidence is available and if the intervention changes ([GAF] p. 33).
6. Sentence anatomy: the recommendation shape from toc_buildplan.md §1, each slot as a coloured block.
7. Split with panel: two diagrams. The full diagram for the appendix and reviewers; the client diagram on one page, with what to keep (the long-term outcome, the ceiling, the main pathways) and what to leave to the narrative.
8. Card grid: the pack sections (toc_buildplan.md §8), each with the workbench screen it comes from.
9. Split with panel: the executive summary. [TC] p. 9's procedure: one person drafts in plain English, the group reviews.
10. Values check: speaking to the client's values without trading away a characteristic unstated; what is specific to Bodø (the week 7 swap test).
11. Sequence band: week 13 pack → week 14 rehearsal and class synthesis → week 15 client.
12–15. In the workbench:
   - 10–20 recommendation sentence (screen 13);
   - 20–35 two diagrams (screen 12);
   - 35–65 narrative (screen 12);
   - 65–75 values check (screen 13);
   - 75–90 print and class view.
16. Close: what each group hands the client.

Add the index.html card and the CLAUDE.md entry.
```
