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
| 7 | T4 | Workbench week 12 screens (simplified; built) | Week 12 |
| 8 | D12 | Week 12 deck (simplified; built) | Week 12 |
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

Simplified in November 2026 (built as below): the first version had options appraisal, a gap walk, inputs, a risk register and a full stadium stress test, which was too much for one 90-minute session with no reading done.

```
Follow the standing instructions in toc_build_prompts.md §0.

Stage 3 of 5 of week9-toc-workbench.html: the week 11 screens. Spec: toc_buildplan.md §4 (principle 4), §6 Week 11, §7. Reading: [TC] pp. 7 and 9. Assume no reading has been done: every screen explains its idea in plain English.

THE LOCK: screens 7-9 are locked only while the backwards map has no arrows or has a loop. Unfinished week 10 checks show on screen 7 as a warning, not a lock.

SCREEN 7, IDEAS FROM THE ARROWS:
- What an arrow is: read from the bottom up, the lower box is needed for the upper box. Show it as a small figure built from the group's own arrow 1, with [TC] p. 7's "on the connector" quotation.
- The map diagram, with each idea drawn as a marker I1, I2 ... on its arrow.
- The arrows shared out among the members in turn (nothing stored).
- One card per arrow: its two boxes, its week 10 rationale, and its ideas. Each idea is written for one arrow in two halves: "If the club ..." and "... this arrow would happen because ...". At least three ideas.
- An idea whose arrow leaves the map is listed until it is given another arrow or removed.

SCREEN 8, TEST THE IDEAS:
- Choose two or three ideas (no more than three).
- For each, [TC] p. 9's three questions in plain words: "Why would it work here?" (plausible), "Could the club really do it?" (doable), "How would the club know it is working?" (testable). Each has two or three prompts, a word-counted answer and a verdict: strong, thin or fails. The verdict is the group's judgement; nothing is scored.
- Under plausible: which of the eight characteristics the idea could put at risk, or none.
- What would make the idea stronger.

SCREEN 9, OUR INTERVENTION:
- Tick the tested ideas that go into the intervention (at least one); a reason for each tested idea dropped.
- A short name, and the sentence "The club should create [what] [where], for [whom], open [when], run by [whom].", each gap word-counted, with a live preview and "So that: [the long-term outcome]".
- Week 11 close: the self-check asks the three questions of the intervention as a whole; print the intervention A6 card; export.

TESTS: the lock and the warning, the screen 7-9 gates, single-arrow ideas pruned with their arrow, markers on arrows, the intervention card, migrate() from the earlier week 11 file.

ACCEPTANCE: plan §9 items 6, 7, 8, 10 (A6 cards), 11 and 14.
```

---

## T4 — Workbench week 12 screens: the plan in detail

Simplified in November 2026, in the same way as week 11 (built; this prompt records what was built). The earlier version (indicators with the full M&E framework, a timeline check, an outside review with reviewer and author modes) is withdrawn.

```
Follow the standing instructions in toc_build_prompts.md §0.

Stage 4 of 5 of week9-toc-workbench.html: the week 12 screens. Spec: toc_buildplan.md §4 (principle 8), §6 Week 12, §7. Reading: [TC] pp. 6–8. No reading is assumed of students; copy is plain English.

NO LOCK: screens 10-11 always open, each on its own; unfinished week 11 work (the map has arrows and no loop, and screen 9 passes) shows as a warning. Each screen starts with empty rows ready to type in. Week 12 roles are optional. Short answers pass (one real word for when, who and what it needs). "By when" takes 12, 12 months or 2 years. The plan cards print whatever is filled in. Import JSON also accepts the week12-plan-workbench.html file.

SCREEN 10, THE PLAN IN DETAIL:
- The week 11 intervention restated (sentence, long-term outcome, the ideas it is built from), with a link to screen 9.
- Activities ([TC] p. 7: "We use activity to describe all the specific actions that make up an intervention."), at least three: what happens, when and how often, who makes it happen, what it needs; each word-counted; optionally the idea from the intervention it carries out.
- What could go wrong, at least two, each with what the club would do about it. Prompts, and the characteristics week 11 flagged as at risk.

SCREEN 11, WILL IT WORK?:
- It will work if: two or three items, started from the assumption register (text copied in to edit; that assumption is marked riskiest) or written from scratch; each with how the club could check it before it opens. Each check goes on find out first.
- Signs it is working: two or three, each on a box of the map (the long-term outcome or an outcome), with [TC] p. 8's four targets (how many, of whom, doing what, by when in months after opening, 1 to 60), read back as "By [N] months after opening, [how many] [of whom] will [do what].", how the club would count it, and whether today's number is known (if so, the number and its source; if not, it goes on find out first).
- The week 12 close: self-check, then the plan A6 cards (one per "it will work if" item, one per sign).

STATE (through migrate()): activities, risks, workIf, indicator baselineKnown; assumptions[].riskiest follows workIf; find out first follows screen 11 (sources "check" and "baseline").

TESTS: the lock, each gate with its messages, one-character entries refused, the limits, riskiest marking, find-out-first sync, migrate() from a stage 3 export, round trip, text and report, cards.

ACCEPTANCE: plan §9 items 7, 8, 10 (plan cards), 11 and 14.
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
  - A6 cards: the recommendation, plus the existing long-term outcome, intervention and plan cards;
  - Copy as text for the whole pack.

SCREEN 14, CLASS VIEW (instructor):
- Load any number of group exports.
- Show side by side: recommendation sentences, long-term outcomes, ceiling placements, the week 11 intervention sentences, the characteristics each group's ideas could put at risk, the riskiest assumptions across groups, and the most common find-out-first items.
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
2. Sequence band: describe, explain, adjudicate, intervene (intervene current). Second band: weeks 9–15 (9 long-term outcome, 10 backwards map, 11 interventions, 12 the plan in detail, 13 recommendation, 14 rehearse, 15 client).
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

Build week11-toc-deck.html (Activity 18). Spec: toc_buildplan.md §4 (principle 4), §6 Week 11. Reading: [TC] pp. 7–9. Assume no reading has been done: teach each idea directly, in plain English, with no reading check.

SLIDES (13):
1. Title poster. Eyebrow "Week 11 · Intervene". Title "What Should the Club Build?".
2. Today: three steps (ideas, screen 7, 20 minutes; test, screen 8, 30 minutes; choose, screen 9, 15 minutes); "You leave with one intervention, printed on a card".
3. What is an arrow? A figure of two boxes and an upward arrow, read from the bottom up: the lower box is needed for the upper box. Example adapted from [TC] p. 8 ("parents read to their children"). The week 10 rationale is the reason on the arrow.
4. Where an intervention goes: the same figure with "literacy classes" ([TC] p. 7) sitting on the arrow; [TC] p. 7's "on the connector" quotation; start from an arrow rather than a favourite idea.
5. An idea in two halves: "If the club ..." / "... this arrow would happen because ...", with a worked example and three rules.
6. The three questions, as in the workbench (CONFIG.tests.questions), with the verdicts strong, thin, fails and [TC] p. 9's question.
7. Worked example: literacy classes put through the three questions, with quotations from [TC] pp. 7 and 8, a verdict for each and a fix.
8. One intervention in one sentence: "The club should create [what] [where], for [whom], open [when], run by [whom].", so that the long-term outcome.
9–12. In the workbench:
   - 15–35 ideas from the arrows (screen 7);
   - 35–65 test the ideas (screen 8);
   - 65–80 our intervention (screen 9);
   - 80–90 close (screen 9).
13. Close: the intervention card, week 12 (the plan in detail), one optional reading ([TC] p. 8), export.

Add the index.html card and the CLAUDE.md entry.
```

---

## D12 — Week 12 deck: "The Plan in Detail"

Simplified in November 2026 with the week 12 screens (built; this prompt records what was built). The earlier "Will the Club Know?" deck (reading check, M&E framework table, outside review) is withdrawn.

```
Follow the standing instructions in toc_build_prompts.md §0, and the deck brief in the "Deck prompts: shared brief" section of that file.

Build week12-toc-deck.html (Activity 19). Spec: toc_buildplan.md §6 Week 12. Reading: [TC] pp. 6–8. Plain English; no reading check and no reading assumed.

SLIDES (13):
1. Title poster. Eyebrow "Week 12 · Intervene". Title "The Plan in Detail".
2. Today: three steps (detail, must be true, signs), with screens and minutes.
3. What is an activity? [TC] p. 7's literacy classes broken into its own activities, with the p. 7 definition quoted.
4. Four questions for every activity (what happens, when, who, what it needs), with an example built from the literacy classes. Labels and hints copied from the workbench.
5. What could go wrong, and what the club would do. Prompts copied from the workbench.
6. It will work if …, with a check before opening; "conditions you take for granted" ([TC] p. 6).
7. Four targets for every sign: [TC] p. 8 quoted, with its classroom example split into the four targets.
8. One sign, one sentence: the workbench's sign sentence with its gaps; the box on the map, how it is counted, today's number.
9–12. In the workbench: 10–40 the plan in detail (screen 10); 40–60 it will work if (screen 11); 60–82 signs it is working (screen 11); 82–90 close.
13. Close: the plan cards; week 13; one optional reading ([TC] p. 9 §8).

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
