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
