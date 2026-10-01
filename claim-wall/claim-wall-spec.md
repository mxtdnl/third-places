# Claim Wall Analyser: Build Spec

This spec is built across several Claude Code sessions. **Every session starts by reading this file in full, then the theory file, then `HANDOFF.md` (if present).** Each session ends by updating the Status table below and appending to `HANDOFF.md`.

## Status

| Session | Scope | Status | Approved by Max |
|---|---|---|---|
| 1 | Theory extraction, protocol, schema | Approved (proposed defaults for A2, A5, A8, A9 adopted) | Yes, 2026-10-01 |
| 2 | Code S1 entries, validator | Not started | — |
| 3 | Viewer: read-only views | Not started | — |
| 4 | Viewer: override, export, snapshot loading | Not started | — |
| 5 | Snapshot comparison (runs once S2 exists) | Blocked: no S2 | — |
| R | Recurring: code a new snapshot | Available after 2 | — |

---

## 1. Context

This repo supports the BSc PEP "Social Phenomena Challenge" course at Hult (third places and their decline; client is a professional football club in Bodø, Northern Norway, building a community third place into a new stadium). The course runs four verbs in strict order: describe, explain, adjudicate, intervene. Explanation must not slide into intervention.

Students maintain a physical claim wall (corkboard). "Decline" is decomposed into four claims (rows), each explained through three disciplinary lenses (columns: Psychology, Economics, Politics):

1. Quantity: the number of third places is declining
2. Usage: people use third places less than they did before
3. Outcomes: outcomes of third places are worsening for social/community
4. Quality: remaining places exhibit fewer third-place characteristics

Each card is a student-proposed explanation. The board is photographed each session and transcribed into a workbook (S1 now; S2, S3… appended later). The tool analyses entries against Oldenburg's characteristics of third places and assesses the strength of each explanation relative to the claim it is filed under.

## 2. Inputs

**Theory file.** A Markdown file in this repo describes Oldenburg's theory and characteristics. It is the sole authority for definitions. Do not import characteristics, names or definitions from your own knowledge. If the file is ambiguous or incomplete on any point, report the gap and stop rather than filling it. Never modify this file.

**Entries workbook** (`claim_wall_S1.xlsx`). Sheet `Entries`, columns:
`Entry_ID | Snapshot_ID | Snapshot_Date | Claim_No | Claim_Label | Discipline | Card_Text | Transcription_Confidence | Transcription_Notes`

- `Card_Text` is verbatim student text with original spelling. Square brackets mark transcriber insertions or best-guess readings and are not student text.
- `Uncertain` rows are analysed with an explicit caveat. Never resolve an uncertain reading by guessing what the student meant.
- Sheet `Claims` holds the four claim statements as written on the board.

## 3. Architecture

No API keys, no backend, GitHub Pages compatible.

**Location.** All files created by this build live in `claim-wall/`. All paths in this spec are relative to that folder. Do not create, modify or move files outside it. The Oldenburg theory file lives elsewhere in the repo; locate it, reference it by relative path, and never move or modify it. Existing HTML tools elsewhere in the repo may be read for visual conventions only. The viewer is named `index.html` so it is served at `/claim-wall/`.

- **Analysis** is performed by Claude Code as the analyst, following `ANALYSIS_PROTOCOL.md`, and written to `analysis/<Snapshot_ID>.json`.
- **Validator** (`scripts/validate_analysis.py`) checks any analysis JSON mechanically against the workbook, theory file and schema.
- **Viewer** is a single self-contained HTML file (CSS and JS inline; libraries via pinned CDN script tags only) that loads analysis JSON. Match the visual conventions and file layout of existing HTML tools in the repo.

## 4. Coding rubric

Every code requires a one-line rationale quoting the specific words of the card it relies on. A code without a quoted basis is invalid.

### 4.1 Oldenburg mapping (per entry)
- `characteristics`: zero or more characteristics from the theory file, using its exact names.
- `relation` for each: `erodes` (characteristic weakening), `barrier` (something preventing it forming), `invokes` (named without a mechanism), or `none`.
- Flag loose use of Oldenburg vocabulary (e.g. "neutral ground", "leveller", "low profile", "playful" on Claim 4 cards) and state whether the usage matches the theory file's definition.

### 4.2 Explanation strength (per entry; each 0/1/2, anchors defined in the protocol)
These cards are unevidenced assertions. Assess explanatory structure, not truth. Do not award or imply evidential strength.

1. **Claim fit.** Does it explain the claim it is filed under? Record `misfiled_to` if it better explains another claim; flag `not_an_explanation` if it restates the claim, describes an outcome, or proposes an intervention.
2. **Mechanism.** Is a causal pathway specified? A bare label ("Inflation", "Polarization") scores 0.
3. **Explains change.** Does it invoke something that changed over the relevant period? A static feature that was always true scores 0.
4. **Lens fit.** Does it use the discipline it is filed under? Record `actual_lens`.
5. **Testability.** Can an observable implication be derived? Write one where possible.
6. **Scope.** Does it state or imply where it holds? Pose, as an open question and not a verdict, whether it plausibly transfers to Bodø / Northern Norway (welfare state, small-city dynamics, club-based civil society).

Sub-scores are reported separately. Do not collapse them into a total unless the protocol justifies the weighting explicitly.

### 4.3 Claim-level synthesis (per claim)
- Strongest candidate explanations, with the sub-scores that put them there.
- Clusters of overlapping or duplicate explanations, including across claims.
- Cross-lens convergence: the same mechanism in different disciplinary language.
- Tensions or contradictions between cards.
- Gaps: characteristics engaged by no card; lenses with no mechanism-level explanation.

### 4.4 Snapshot comparison
Match entries across snapshots by text similarity and claim/lens position; classify as added, removed, moved, or revised; summarise how explanations strengthened, weakened or were reframed. List low-confidence matches for manual review.

## 5. Viewer requirements

- **Grid view:** claims × lenses mirroring the board; each cell shows its cards with a compact sub-score display.
- **Oldenburg coverage view:** characteristics × claims.
- **Entry detail:** card text, transcription caveat, all codes with quoted rationales, testable implication, scope question.
- **Claim synthesis panel** per claim.
- **Student view toggle:** hides scores and synthesis; keeps grid, Oldenburg mapping and testable implications. In weeks 6–7 students adjudicate themselves, and pre-scored explanations would pre-empt that.
- **Instructor override:** any code editable, original Claude code preserved alongside; export reconciled data as JSON and .xlsx (SheetJS).
- **Snapshot loading and diff view.**
- Responsive, accessible contrast, no reliance on colour alone.

## 6. Global constraints

- Do not invent evidence, statistics or sources.
- The analysis assesses explanations; it does not recommend what the club should build.
- Do not start work belonging to a later session. If a session finishes early, stop and report.

---

## 7. Sessions

### Session 1: Theory extraction, protocol, schema
**Why separate:** every later session depends on the characteristic list and score anchors, and both need Max's judgment before use.

**Do:**
1. Locate and read the theory file. Extract each characteristic with its definition exactly as given, citing the heading or line it comes from.
2. Propose 0/1/2 anchors for each criterion in 4.2, each with one worked example drawn from the S1 cards.
3. Write `ANALYSIS_PROTOCOL.md`: characteristic list, anchors, coding procedure, rationale and caveat rules, synthesis procedure.
4. Write `analysis/schema.json` (JSON Schema) covering entry codes, claim synthesis, snapshot metadata and an `overrides` structure for Session 4.

**Do not:** code any entries beyond the worked examples.

**Done when:** the protocol and schema exist, and the extraction report lists any gaps or ambiguities in the theory file.

**Gate:** stop and present the characteristic list and anchors to Max. Session 2 does not begin until the Status table shows Session 1 approved.

### Session 2: Code S1, build validator
**Why separate:** coding 39 entries with quoted rationales is the largest context load in the build, and the output needs Max's spot-check before anything is built on it.

**Do:**
1. Write `scripts/validate_analysis.py`. Checks: JSON validates against the schema; every entry in the workbook snapshot has every code; every rationale contains a quoted fragment present in `Card_Text`; every characteristic name appears verbatim in the theory file; every `Uncertain` entry carries a caveat; no entry IDs in the JSON are absent from the workbook.
2. Code all S1 entries per the protocol. Write `analysis/S1.json`.
3. Write the claim-level synthesis (4.3) for all four claims.
4. Run the validator; fix until clean.

**Done when:** the validator passes, and a summary lists entries flagged `misfiled_to`, `not_an_explanation` or `actual_lens` ≠ filed lens.

**Gate:** Max spot-checks codes before Session 3.

### Session 3: Viewer, read-only views
**Why separate:** front-end work needs none of the coding context, and building against fixed, approved data keeps scope contained.

**Do:** build the viewer with S1 embedded: grid view, Oldenburg coverage view, entry detail, claim synthesis panels, student view toggle. Read-only.

**Done when:** all five components render S1 correctly, the student toggle hides exactly what Section 5 specifies, and there are no console errors at mobile and desktop widths.

### Session 4: Viewer, override, export, snapshot loading
**Do:**
1. Instructor override: edit any code, store the original alongside, mark overridden fields visibly.
2. Export reconciled data as JSON and .xlsx.
3. File-picker to load any `analysis/*.json`; validate it against the schema in-browser and reject malformed files with a clear message.
4. Snapshot selector UI. The diff view is a disabled placeholder until Session 5.

**Done when:** an override survives export and re-import round trip, and loading a malformed file fails cleanly.

### Session 5: Snapshot comparison (blocked until S2 exists)
**Why deferred:** building the diff against invented data would test the tool against a fabricated scenario. Wait for real S2 data.

**Do:**
1. Run Session R for S2.
2. Implement matching (4.4) as `scripts/match_snapshots.py`, outputting `analysis/diff_S1_S2.json` with a confidence score per match.
3. Write the narrative comparison per 4.4.
4. Enable the viewer diff view.

**Gate:** Max reviews low-confidence matches before the diff is treated as final.

### Session R: Recurring, code a new snapshot
**Do:** confirm the new rows exist in the workbook, code them per `ANALYSIS_PROTOCOL.md` without altering the protocol, write `analysis/<Snapshot_ID>.json`, run the validator. If any card cannot be coded within the existing protocol, report it rather than amending the protocol in-session.
