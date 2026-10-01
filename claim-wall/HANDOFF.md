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
