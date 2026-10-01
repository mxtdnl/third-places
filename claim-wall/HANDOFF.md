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

### Session 3 approval (2026-10-01)

Max approved Session 3 without amendments. Student-view boundary calls 1–5 above are adopted as written. The viewer was not added to `../index.html` or to the `../CLAUDE.md` file list, because spec Section 3 keeps changes inside `claim-wall/`. Session 4 may begin.

**Decision for Session 4: .xlsx export without SheetJS.** The viewer writes .xlsx itself, using a minimal inline writer: a zip archive of the required XML parts (content types, relationships, workbook, worksheets) and plain flat sheets, with no formulas or styling. No library is loaded from a CDN or vendored into the file. This keeps the viewer consistent with the repo's no-external-dependencies rule, and it keeps working offline from `file://`. This decision supersedes the "(SheetJS)" note in spec Section 5 and the CDN clause in Section 3 for this build. No .xlsx import is needed: Session 4 loads analysis JSON only, and its round-trip test uses the JSON export. Session 4 should check that the exported .xlsx opens with `openpyxl` and that its cell values equal the reconciled JSON.

---

## Session 4: Viewer, override, export, snapshot loading (2026-10-01)

**Status:** complete, awaiting Max's approval. Session 5 stays blocked until S2 exists.

**Gate check:** the Status table showed Session 3 approved (commit `c48947c`). `analysis/S1.json`, `analysis/schema.json`, the protocol and the theory file were not modified. The validator still reports 0 errors and 0 warnings on S1.

**Files created**
- `scripts/verify_session4.mjs`: Playwright checks for the Session 4 done-when criteria. Usage: `node scripts/verify_session4.mjs [--keep <dir>]`. Needs `pip install openpyxl jsonschema rfc3339-validator`. It runs a LibreOffice check only if LibreOffice Calc can open a reference workbook.
- `scripts/check_xlsx_export.py`: compares a viewer .xlsx export cell by cell with the matching JSON export. It applies the overrides itself, separately from the viewer's code. Usage: `python3 scripts/check_xlsx_export.py <x.xlsx> <x.json>`.

**Files modified**
- `index.html`: added override, export, loading and the snapshot selector (details below). `analysis/schema.json` is now embedded in `<script type="application/json" id="embedded-schema">`.
- `scripts/embed_analysis.py`: embeds and round-trip checks both the analysis block and the schema block. Re-run it after any change to `analysis/schema.json`.
- `scripts/verify_viewer.mjs`: tab expectations only. The new instructor-only Overrides tab makes four tabs (three edits: the tab list, the arrow-key wrap test and the tab count after toggling back).
- `claim-wall-spec.md`: Status table only.

**What was built**
- *Instructor override.* In instructor view, the Oldenburg mapping and each of the six strength criteria in the entry detail has an Override button. The form takes the score (with the anchor text), the quotes and rationale, and the criterion's own fields: better-fits claim, not an explanation, coded lens, testable implication and note, stated scope, Bodø question. It also requires a reason (live word count, minimum in `CONFIG.reasonMinWords`) and a name. Saving is refused if any of these apply: the reason is too short; a quote is not verbatim card text or contains brackets; the Oldenburg engagement and characteristics disagree; nothing changed; the document with overrides applied fails the schema. Each changed field becomes one `overrides` record: pointer, the analyst's `original_value`, `override_value`, reason, name and time (schema `$defs/override`). Setting a field back to the analyst's value removes its override. "Revert to analyst code" asks for confirmation, then removes the block's overrides.
- *Marks.* In the grid, an overridden score cell gets a red border and an asterisk, and its accessible name includes the analyst's score. Cards get an "Overridden: N fields" chip, and a "Gate now passed/failed (synthesis not recomputed)" chip when an override changes the protocol 9.1 gate result. In the detail, each overridden block is outlined and each overridden field is labelled "Overridden". An override box shows Field | Analyst original | Override, with the reason, name and time. In coverage, entries with an overridden Oldenburg mapping are marked "*". Synthesis panels list the overridden entries they discuss. The header shows the override count, and the Overrides tab lists every override.
- *Export.* "Export JSON" writes `claim-wall-<ID>[-with-overrides]-<date>.json`, which is validated before download. "Export .xlsx" uses an inline stored-zip SpreadsheetML writer, with no library. Its sheets are `Entries_Reconciled` (overrides applied, plus an `Overridden_Fields` column), `Entries_Analyst`, `Overrides` (original and new values as readable text and as JSON) and `Snapshot`. Scores and claim numbers are numeric cells.
- *Loading.* "Load analysis JSON" opens a file picker. The loader checks, in this order:
  1. It parses the JSON.
  2. It validates against the embedded schema. The in-browser validator implements exactly the keywords the schema uses, and refuses to run if the schema gains one it does not implement.
  3. It runs checks the schema cannot express: unique entry IDs, IDs matching the snapshot, entry and uncertain counts, claims 1–4 present once each, synthesis references resolving, and rationale and cluster quotes being verbatim card text.
  4. It checks each override against the file: pointer shape, target, unique IDs and pointers, and `original_value` equal to the file's analyst value.
  5. It applies the overrides and runs the schema and semantic checks again on the result.

  If any check fails, the file is rejected. The viewer lists up to 15 problems, naming entries by ID, in a `role="alert"` box, and changes nothing. A protocol version or theory-file hash that differs from S1's is accepted with a warning.
- *Snapshot selector.* Lists the built-in snapshot and each loaded file, with override counts in instructor view. Loading the same file name again replaces that copy. "Compare snapshots" is a disabled button, with a visible note that it waits for S2.
- *Persistence.* Overrides, loaded files and the last name used are kept in `localStorage` (`claim-wall-viewer:v1`). On reload they are validated again, and anything that no longer validates is dropped with a notice. "Reset" asks for confirmation, then clears them. Student view hides load, export and reset, and keeps the selector.

**Judgement calls for Max**
1. *What "export reconciled data" means in each format.* The JSON export leaves every analyst code in place and adds the `overrides` array; the reconciled values are derived by applying it. This follows ANALYSIS_PROTOCOL.md Section 10, line 312 ("An override never edits the analyst's code in place") and keeps `validate_analysis.py` passing on exports, with 0 errors and 1 warning that overrides are present. The .xlsx export holds the reconciled values (`Entries_Reconciled`) next to the originals. A JSON with reconciled values written in place would need a schema change: the root has `additionalProperties: false`, and the validator would then check overridden codes as if they were the analyst's.
2. *Which codes can be overridden.* The rubric 4.1 and 4.2 codes: the Oldenburg mapping, and every field of the six strength criteria. The transcription caveat, the analyst note, the claim synthesis and the snapshot gaps cannot be overridden. The schema allows `claim_synthesis` and `snapshot_gaps` override targets; the loader rejects them with a message, because nothing writes them.
3. *Oldenburg mapping is overridden as a single unit* (pointer `/entries/<i>/oldenburg`). `none_rationale` is present or absent depending on engagement, and an override pointer cannot represent an absent original. The whole mapping is therefore marked, and the box shows the original and new mappings in full.
4. *The claim synthesis is not recomputed.* Its `why` texts are written analysis. Panels say which overridden entries they discuss, synthesis sub-scores stay the analyst's, and the grid flags gate changes.
5. *Constraints on overrides:* the schema, plus verbatim, bracket-free quotes (spec 4: a code needs a quoted basis). Protocol rules that the schema does not encode, such as "lens fit 2 only when the primary lens is the filed lens", are not enforced on overrides.
6. *Student view* shows reconciled values for what it already showed (the Oldenburg mapping, the testable implication and note, and the Bodø question), marked "Revised by instructor". It does not show originals, reasons or names. Overrides on fields that student view hides leave no trace there.
7. *The reason minimum is 25 words,* the repo's default for required free text (`CONFIG.reasonMinWords`). This may be heavy for quick corrections. Lower it in `CONFIG` if wanted.
8. *Persistence in `localStorage`* is not named in spec Section 5. I added it so overrides survive a reload. The JSON export remains the durable record.
9. *An instructor-only Overrides tab* was added to list all overrides. This changed three expectations in the Session 3 harness (listed above).

**Verification**
- `node scripts/verify_session4.mjs`: 228 checks, 0 failures, on two consecutive runs.
  - *Override* (47 checks). A short reason, a quote that is not on the card, engaged with no characteristic, and an unchanged save are each refused, with focus moved to the errors and nothing saved. Three overrides were saved: S1-003 mechanism 2→0, the S1-001 Oldenburg mapping (none → Accessibility and Accommodation, barrier, quoting "crowded spaces"), and the S1-014 testable implication. They are marked in the grid (exactly one marked score cell), the detail, coverage, the claim 1 and 2 synthesis panels and the Overrides tab. The S1-003 gate chip reads "Gate now failed". Student view marks exactly S1-001 and S1-014. It shows no scores, reason, name, original implication or override controls, and hides load, export and reset. Escape inside a form cancels the form, not the dialog. Overrides survive a reload.
  - *Export* (14 checks). The exported JSON, minus `overrides`, is identical to `analysis/S1.json`. Each override's original equals the analyst value. Python `jsonschema` (with format checking) accepts the export, and `validate_analysis.py` reports 0 errors and 1 warning ("3 override(s) present"). `check_xlsx_export.py` ran 2,649 cell checks with 0 failures. LibreOffice Calc opened the .xlsx and converted it. Calc was not installed in the container, so I installed `libreoffice-calc` for this check.
  - *Round trip* (21 checks). In a fresh browser with empty storage, the exported JSON was loaded through the file picker. All three overrides came back with the same originals, values, reasons and marks. Re-exporting gave a byte-identical file. Switching to the built-in snapshot and back keeps both. Revert asks for confirmation, and the next export then has 2 overrides. Reset asks for confirmation and clears overrides, loaded files and storage.
  - *Malformed files* (98 checks, 19 files). All 19 were rejected with a specific message, a `role="alert"` region and "Nothing was changed". The selector, the cards and the current snapshot's 3 overrides stayed as they were, with no console errors. The files were: truncated JSON; an empty file; a top-level array; a `.txt` file; a score of 3; a missing `strength`; an unknown root field; a testability of 0 with an implication; a malformed entry ID; "The Leveller" for "The Leveler"; three claims; a quote not on the card; an `entry_count` of 40; a duplicate entry; an override with a tampered original; an override pointing to `/snapshot/analyst`; an override value of 5; a target/pointer mismatch; and an override with an empty reason.
  - *Schema parity* (2 checks). The in-browser validator and Python `jsonschema` agree on all 401 documents: S1 plus 400 seeded random mutations, of which 332 are invalid and 69 valid.
  - *Layout* (46 checks). At 360 and 1280 px there is no horizontal scroll, text contrast meets WCAG AA, and every control, including form fields and radio/checkbox labels, is at least 44 px. This was checked on the data bar, the reset confirmation, the Oldenburg and claim-fit forms (with errors), the override box, the Overrides tab, the load-error box and student view with a revision.
- `node scripts/verify_viewer.mjs` (Session 3 criteria): 10,512 checks, 0 failures, with the 317-string student-view leak check clean.
- Defects found and fixed during verification:
  - The export buttons used `--char-3`, which gives 4.49:1 with white text; they now use `--char-5`.
  - The loader called every rejection "does not match the analysis schema", including semantic and override failures. It now says "is not a valid analysis file".
  - Harness bugs: fixture file names, section bookkeeping, and contrast measured mid hover transition.

**Not done (out of scope or constrained)**
- The diff view is a disabled placeholder (Session 5).
- No "Copy as text" button. The repo's build conventions ask for one; no session in the spec does. Max to decide.
- The print stylesheet hides the new controls and keeps override marks in colour, but A4 output was not checked.
- `../index.html`, `../CLAUDE.md` and `../test.html` were not touched (spec Section 3).

**Notes for Session 5**
- The selector already holds several snapshots (`SLOTS`). A diff view can read `SLOTS[i].base` and `.overrides`, and should decide whether to compare analyst codes or reconciled codes.
- Enable `#diff-btn` and replace `CONFIG.diffNote` once `analysis/diff_S1_S2.json` exists. Embedding S2 needs a second embedded block, or the embed script needs extending.
- After any change to `analysis/*.json` or `schema.json`, run `python3 scripts/embed_analysis.py`, then the validator, `node scripts/verify_viewer.mjs` and `node scripts/verify_session4.mjs`.

### Session 4 approval (2026-10-01)

Max approved Session 4, conditional on one change. Judgement calls 1–4, 6, 8 and 9 are adopted as written.

**Call 7 reversed: no word minimum on the override reason.** The reason is still required, because the schema's `override.reason` has `minLength: 1`. An empty or whitespace-only reason is refused with "Reason: required". There is no longer a minimum length or a word count. `CONFIG.reasonMinWords`, `wordCount`, the live counter and its CSS were removed from `index.html`. This supersedes the references above to `CONFIG.reasonMinWords`, the live word count and the short-reason check.

**Verification after the change:**
- `node scripts/verify_session4.mjs`: 229 checks, 0 failures. The override section now checks three things: no counter is shown, an empty reason is refused, and a 4-word reason is accepted.
- `node scripts/verify_viewer.mjs`: 10,512 checks, 0 failures.

Session 5 stays blocked until S2 exists.
