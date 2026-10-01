# Claim Wall Analyser: Handoff Log

Append one section per session. Read `claim-wall-spec.md` in full, then `../third-place-content.md` (the theory file), then this file, before starting any session.

---

## Session 1 — Theory extraction, protocol, schema (2026-10-01)

**Status:** complete, awaiting Max's approval. Session 2 must not start until the Status table shows Session 1 approved.

**Theory file located:** `../third-place-content.md` (Section A, "The 8 Characteristics of a Third Place"). SHA-256 `91fd689b30e0ccb4aae1a9ff092391b6d3993ffe1266a45e0f4f1e4e33b974ab`, recorded in the protocol so later sessions can detect changes. Not modified.

**Files created**
- `ANALYSIS_PROTOCOL.md` (v1.0-draft): characteristic list with verbatim definitions and line citations (Section 2); proposed lens definitions (3.2); coding procedure (4); rationale, caveat and Oldenburg-mapping rules (5–7); 0/1/2 anchors for all six criteria, each anchor with one S1 worked example (8); synthesis procedure, including a gate for strongest candidates that avoids a total score (9); extraction report of 13 gaps and ambiguities (Appendix A).
- `analysis/schema.json` (JSON Schema 2020-12): snapshot metadata, entry codes, claim synthesis, snapshot-level gaps, and an `overrides` array (JSON Pointer + original value + new value) for Session 4. Checked against the 2020-12 meta-schema and against a throwaway synthetic fixture (14 rejection cases, all rejected); the fixture was not committed.
- This file.

**Files modified:** `claim-wall-spec.md` Status table only.

**Entries coded:** none beyond the 18 single-criterion worked examples in protocol Section 8 (index in Appendix B). All worked-example quotes were checked verbatim against `claim_wall_S1.xlsx`.

**Open decisions for Max (protocol Appendix A)**
- A2: which form of each characteristic name is "exact" (proposed: Section A `###` headings).
- A5: cost/payment cards may map to Neutral Ground, The Leveler and Accessibility and Accommodation at once (proposed: map to each whose definition the words match).
- A8: lens definitions are not in the theory file; Section 3.2 proposes them.
- A9: Claim 3 (Outcomes) has two readings; claim-fit scores for several Claim 3 cards depend on which governs.

**Notes for Session 2**
- `openpyxl` and `jsonschema` were not pre-installed; `pip install openpyxl jsonschema` was needed.
- `Snapshot_Date` is blank for all S1 rows → `snapshot_date: null`.
- A pink card outside the grid was not captured (workbook `Notes` sheet); record in `snapshot.notes`, do not code.
- The schema enforces bracket-free quotes but cannot check that quotes are substrings of `Card_Text`, that `card_text` equals the workbook, or that the theory file hash matches; the validator must do those.
- Worked-example scores are not binding; if full application of the protocol yields a different score for any of the 18, report the divergence.

### Session 1 approval (2026-10-01)

Max approved Session 1. No amendments were given for open decisions A2, A5, A8 and A9, so the proposed defaults stand: Section A heading names; multi-mapping of cost/payment cards; the Section 3.2 lens definitions; Claim 3 read as worse social or community consequences associated with third places (Section 3.1). Protocol bumped from 1.0-draft to 1.0; use `"protocol_version": "1.0"` in analysis JSON. Session 2 may begin.

---

## Session 2: Code S1, validator (2026-10-01)

**Status:** complete, awaiting Max's spot-check. Session 3 must not start until the Status table shows Session 2 approved.

**Gate check:** the Status table showed Session 1 approved (commit `a124e71`). Theory file SHA-256 still `91fd689b…b974ab`, matching the protocol. Protocol not amended.

**Files created**
- `scripts/validate_analysis.py`. Usage from `claim-wall/`: `python3 scripts/validate_analysis.py analysis/S1.json` (needs `pip install openpyxl jsonschema`). Exit 0 means no errors. Checks: schema; theory file hash against the JSON and the protocol; protocol version; characteristic names against the Section A `###` headings; every workbook entry coded once and no unknown IDs; card text, claim, discipline, confidence, counts and date equal to the workbook; every rationale quote a verbatim substring of `Card_Text` and bracket-free; caveats on every `Uncertain` entry; lens-fit 2 only when the primary lens is the filed lens; vocabulary flags present for every Section 2.2 trigger term (bare "neutral" is a warning only); claim synthesis recomputed from the entry codes (gate, order, imported candidates, nearest misses, cluster and convergence references, unengaged characteristics, lenses without mechanism). After a pass it prints the flagged-entry list. It was checked against 14 deliberate mutations (bad quote, corrected student spelling, missing or extra entry, removed caveat, edited card text, wrong name, stale synthesis, missing flag, added total, bracketed quote, wrong hash); all 14 were rejected.
- `analysis/S1.json`: 39 entries (7 Uncertain), four claim syntheses, snapshot gaps, `overrides: []`. Validator: 0 errors, 0 warnings.

**Files modified:** `claim-wall-spec.md` (Status table only).

**Candidates (protocol 9.1)**
- Claim 1: S1-003.
- Claim 2: S1-014, then S1-016. Imported from other claims: S1-001, S1-006, S1-020, S1-027.
- Claim 3: none pass the gate. Nearest misses: S1-020, S1-021, S1-024, each failing claim fit only.
- Claim 4: S1-035, then S1-031 (ordered by testability). Imported: S1-015.
- No card on any claim engages The Regulars. Claims 1 and 3 engage no characteristic.

**Flagged entries**
- misfiled_to: S1-001 → 2, S1-006 → 2, S1-015 → 4, S1-020 → 2, S1-027 → 2.
- not_an_explanation: S1-019 (describes_outcome), S1-029 (restates_claim), S1-033 (restates_claim).
- actual_lens ≠ filed lens: S1-010 Undeterminable (filed Psychology), S1-021 Psychology (filed Economics), S1-031 Undeterminable (filed Psychology), S1-033 Undeterminable (filed Economics), S1-037 Economics (filed Politics), S1-038 Economics (filed Politics), S1-039 Undeterminable (filed Politics).

**Worked examples:** all 18 Section 8 worked-example scores were reproduced when coded in full. No divergences.

**Entries that could not be coded within the protocol:** none.

**Judgement calls for the spot-check.** These apply the anchors and do not amend them. Each is applied consistently across S1.
1. *Lens fit when mechanism is 0.* The anchor-1 bare-label clause ("lens is indicated but no causal work can be assessed") is applied to every card that states no causal relation, so such cards score lens fit at most 1. Fifteen cards have mechanism 0: 13 score lens fit 1, and S1-033 and S1-039 score 0 because the filed lens is absent. Of the 13, three are single-word labels the anchor covers directly (S1-009, S1-019, S1-022); the other 10 score 1 only because of this extension (S1-001, S1-002, S1-017, S1-023, S1-025, S1-026, S1-029, S1-030, S1-032, S1-036).
2. *"Closest to the claim" (3.2).* This is read as the last variable in the stated chain before the filed claim's own variable. Hence S1-021: wage → demotivation gives Psychology primary, Economics secondary.
3. *Scope.* A cause stated as an unqualified general trend (introversion, polarisation, rising living costs) is not treated as a scope condition, consistent with the S1-027 worked example. Under a literal reading of "names a condition", S1-006 and S1-014 would score 2 rather than 0.
4. *Explains change.* A level stated without comparative or change wording ("High cost of living", "Lack of funding") scores 0. "-ization" nouns score 1 (they can denote a state or a process). "Inflation" and "Deterioration" score 2.
5. *Testable implications* are written for the card's own stated claim. Distance from the filed claim is captured by claim fit.
6. *S1-019* ("Social anxiety and stress", Claim 3) is flagged describes_outcome under the 8.1 no-added-words rule. The cause reading is recorded in the rationale.
7. *Cost cards (A5).* S1-032 is mapped to Accessibility, Neutral Ground and The Leveler; S1-034 to Neutral Ground and Accessibility. S1-038 is mapped to The Leveler only, because it names no cost.
8. *S1-010 and S1-031* (virtual availability, technology) are coded actual lens Undeterminable. Neither card names a variable from any Section 3.2 lens.

**Notes for Session 3**
- `analysis/S1.json` is the data to embed. Clusters and convergences that span claims are repeated under each claim with a member and share a `cluster_id`.
- The builder used to write S1.json was a session-local script and is not committed. The JSON is the record, and the validator is the check.

### Session 2 approval (2026-10-01)

Max approved Session 2 without amendments. `analysis/S1.json` stands as coded, and the eight judgement calls listed above are adopted as written. Session 3 may begin.

---

## Session 3: Viewer, read-only views (2026-10-01)

**Status:** complete, awaiting Max's approval. Session 4 should not start until the Status table shows Session 3 approved.

**Gate check:** the Status table showed Session 2 approved (commit `884a00b`). `analysis/S1.json` was not modified; the validator still reports 0 errors and 0 warnings. Protocol, schema and theory file were not modified.

**Files created**
- `index.html`: the viewer, served at `/claim-wall/`. It is one self-contained file with inline CSS and JS and no external requests, and it works from `file://` and over HTTP. `analysis/S1.json` is embedded verbatim in `<script type="application/json" id="embedded-analysis">`. Editable wording, colours, the verbatim characteristic definitions (protocol Section 2), the verbatim anchors (protocol 8) and the relation definitions (protocol 7.2) are in `CONFIG`. A script check confirmed that all 8 definitions appear verbatim in `../third-place-content.md` and that all 18 anchors and 3 relation definitions appear verbatim in the protocol. The visual language follows the root tools: tokens, the header geometry, the lens colours from `week6b-adjudication-bench.html` (Psychology `--char-1`, Economics `--char-4`, Politics `--char-2`), and the claim colours from week6b's claim types (1 `--char-3`, 2 `--char-5`, 3 `--char-8`, 4 `--char-6`).
- `scripts/embed_analysis.py`: re-embeds an analysis JSON into `index.html` (default `analysis/S1.json`) and checks that the result parses back equal to the source. It escapes `</` as `<\/`. Standard library only.
- `scripts/verify_viewer.mjs`: Playwright checks against the done-when criteria. Usage: `node scripts/verify_viewer.mjs [--shots <dir>]`. It needs Playwright with Chromium; set `PLAYWRIGHT_MODULE` if the module is not resolvable.

**Files modified:** `claim-wall-spec.md` (Status table only).

**Components**
- *Grid:* claims × lenses, as on the board, with the claim text verbatim from `claim_text`. Each card shows its ID, its verbatim text with `[ ]` insertions set in muted italics, an uncertain-transcription marker, and its characteristics with relations. Instructor view adds the six sub-scores (abbreviation, digit and two-box bar, never colour alone, no total) and flag chips: Candidate, "Better fits claim N", "Not an explanation: …" and "Coded lens: …". It collapses to lens-headed cells under each claim at 1000px and below, and to one column at 700px and below.
- *Oldenburg coverage:* characteristics × claims. Each cell lists its entry IDs with the relation in text, and each row has an expandable verbatim definition with its source line. A footer gives the number of cards engaging any characteristic per claim. Below it is a vocabulary-flag table. The snapshot-gaps note appears in instructor view only.
- *Entry detail:* a modal `<dialog>`, opened from any card or entry ID. Focus moves to Close; Escape and backdrop clicks close it, and focus returns to the opener. It has Previous and Next buttons. It shows the card text, the transcription caveat with the codes it affects, the analyst note, and the Oldenburg mapping with quoted rationales and vocabulary flags. It then shows all six criteria, each with its score, the anchor text for that score, the quoted rationale, and its extras (`misfiled_to`, `not_an_explanation`, coded lens, stated scope). Last come the testable implication and the Bodø scope question.
- *Claim synthesis:* one panel per claim with these sections: candidates (sub-scores and `why`), imported candidates, nearest misses, clusters (each marked when it is also listed under another claim), convergence, tensions, and gaps. Entry IDs open the detail view, and each grid row links to its claim's panel.
- *Student view toggle:* the header button sets `aria-pressed`; `?view=student` opens in student view, and the toggle keeps the URL in step. Hidden content is not rendered at all, and the dialog is emptied on close, so no instructor text stays in the DOM.

**Student-view boundary: judgement calls for Max.** Spec Section 5 says the student view hides scores and synthesis and keeps the grid, the Oldenburg mapping and the testable implications. Applied as follows:
1. *Hidden:* all six sub-scores and their rationales and anchors; `misfiled_to`, `not_an_explanation`, `actual_lens` and `stated_scope` (these are codes of the scored criteria); the Candidate chip; the synthesis tab, the grid links to it, and the snapshot-gaps note; and the "why no implication" note on entries with a null implication.
2. *Hidden, though not a score:* the `analyst_note`. Several notes discuss scores or flags (e.g. S1-019, S1-021).
3. *Kept, though not in the "keeps" list:* the transcription caveat and the codes it affects. The caveat names criteria that could change but never states a score; S1-017's caveat says "a datable event would score 2", which is hypothetical. The Bodø scope question is also kept: it is neither a score nor synthesis, and the protocol defines it as an open question.
4. *Kept, though it reveals testability 1 vs 2:* the analyst's supplied-element note under a testable implication, labelled "Added by the analyst". Without it, students would read analyst-supplied content as the card's own claim. Vocabulary-flag verdicts (matches, partial, …) are also kept, as part of the Oldenburg mapping (rubric 4.1).
5. The toggle is a display mode, not access control: the embedded JSON, including every score, is in the page source.

**Verification** (`node scripts/verify_viewer.mjs`, Chromium; widths 360, 390, 768, 1280 and 1440, each in instructor and student view): 10,512 checks, 0 failures, on three consecutive runs.
- No console errors, warnings or page errors, and no horizontal page scroll, in any view at any width. Also checked over HTTP at 360 and 1440, in both views, with no errors.
- Grid: 39 cards, each in the correct claim × lens cell, with card text equal to the JSON. The uncertain marker appears on exactly the 7 Uncertain entries. Characteristic chips equal the JSON. Instructor view: every sub-score digit equals the JSON, and the flag chips equal those derived from it. Student view: no sub-scores, flags or synthesis links.
- Coverage: all 32 characteristic × claim cells equal the JSON, entry by entry and relation by relation; the footer counts are correct; all 6 vocabulary flags are present.
- Entry detail: all 39 entries are checked at 360 and 1440, and a sample (including all Uncertain entries) at the other widths. Each shows the card text and caveat, every characteristic and vocabulary rationale and quote, the testable implication and the Bodø question. Instructor view also shows all six score badges, rationales, quotes and extras. Focus moves to Close and returns to the card on Escape.
- Synthesis: 4 panels. Candidates, imported candidates and nearest misses match the JSON in order. Cluster IDs, the convergence and tension counts, and every `why`, shared element, cluster quote, mechanism, tension, gap list and gap note are present.
- Student view: 317 instructor-only strings (strength rationales, `not_an_explanation` rationales, analyst notes, null-implication notes and synthesis texts) were checked against the rendered text of every view and every opened dialog; none appear. The synthesis tab is absent. Toggling on from the synthesis tab falls back to the grid, and toggling off restores all three tabs.
- Accessibility: text contrast is at least WCAG AA for every visible text element in every view and in one dialog per claim. Every visible control is at least 44 × 44 px. Tabs use arrow, Home and End keys. Focus outlines are visible. `prefers-reduced-motion` turns transitions off.
- Defects found and fixed during verification: claim 1's colour (`--char-3`) gives 4.49:1 against white, so small white text on it failed AA in the coverage headers and the dialog header (the coverage headers are now large text, and the dialog header is dark); the definition toggles were 32px tall; a closed dialog kept instructor content in the DOM after switching to student view.

**Not done (out of scope or constrained)**
- No override, export, file loading, snapshot selector or diff (Session 4 and 5).
- `../index.html` (the activity card) and `../CLAUDE.md` (the Files list) were not updated. The repo's CLAUDE.md asks for both when an activity is added, but spec Section 3 forbids changes outside `claim-wall/`. Max to decide.
- `../test.html` was not run, because no file outside `claim-wall/` changed.
- The print stylesheet (current view only, controls hidden) is basic and was not verified against A4 output.
- The file starts with `<!doctype html>` before `<meta charset="utf-8">`. The root tools have no doctype and render in quirks mode.

**Notes for Session 4**
- The spec allows SheetJS "via pinned CDN script tags", but the repo's CLAUDE.md says "No external dependencies — everything is inline", and the build instructions say "no CDN dependencies". This needs Max's decision before the .xlsx export is built.
- Once overrides exist, the student view needs a rule for overridden fields. The current rule is render-time exclusion in `wallCard`, `renderCoverage`, `renderDetail` and `renderSynthesis`, each guarded by `state.student`.
- Loaded snapshots can reuse the render functions: they read only the module-level `DATA`, `ENTRIES`, `BY_ID`, `SYN` and `CANDIDATE_IDS`.
- After any change to `analysis/S1.json`, run `python3 scripts/embed_analysis.py`, then the validator, then `node scripts/verify_viewer.mjs`.
