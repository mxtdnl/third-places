# Claim Wall Analysis Protocol

**Version:** 1.0-draft (Session 1). **Status:** awaiting Max's approval. Nothing in this file may be used to code entries until the Status table in `claim-wall-spec.md` shows Session 1 approved.

This protocol tells the analyst (Claude Code) how to code claim-wall entries and write claim-level synthesis. Output is `analysis/<Snapshot_ID>.json`, which must validate against `analysis/schema.json`. The protocol is fixed during Session R: if a card cannot be coded within it, report the card rather than amending the protocol in-session.

---

## 1. Sources and precedence

| Source | Path (relative to `claim-wall/`) | Authority |
|---|---|---|
| Theory file | `../third-place-content.md` | Sole authority for characteristic names and definitions. Never modified. SHA-256 at extraction: `91fd689b30e0ccb4aae1a9ff092391b6d3993ffe1266a45e0f4f1e4e33b974ab` |
| Entries workbook | `claim_wall_S1.xlsx` (sheets `Entries`, `Claims`, `Notes`) | Sole authority for card text, claim filing, lens filing and transcription confidence |
| Build spec | `claim-wall-spec.md` | Rubric (Section 4) and constraints (Section 6) |
| This protocol | `ANALYSIS_PROTOCOL.md` | Operational rules and score anchors |

If the theory file's SHA-256 no longer matches the value above, stop and report: the characteristic list below may be stale.

---

## 2. Characteristic list

Extracted from Section A of the theory file ("## A. The 8 Characteristics of a Third Place", line 10). The theory file states that "the **canonical list below follows Oldenburg (1999) as reproduced in Source 1's Table 1**" (line 30). Names are the `###` heading text with the leading number removed. Definitions are the `**Definition:**` line of each subsection, verbatim.

| ID | Name (exact, for coding) | Source heading | Definition (verbatim) |
|---|---|---|---|
| C1 | Neutral Ground | `### 1. Neutral Ground` (line 34; definition line 36) | A third place is a setting where people can come and go freely, without obligation, invitation, or the need to play host. |
| C2 | The Leveler | `### 2. The Leveler` (line 46; definition line 48) | A third place is a socially levelling environment where individuals' rank, status, and roles in the outside world carry no weight. |
| C3 | Conversation is the Main Activity | `### 3. Conversation is the Main Activity` (line 58; definition line 60) | Talk — lively, playful, wide-ranging — is the primary social activity in a third place, valued collectively for its own sake. |
| C4 | Accessibility and Accommodation | `### 4. Accessibility and Accommodation` (line 70; definition line 72) | A third place is easy to access and accommodating to its visitors' schedules — one can go alone, at almost any time, and expect to find familiar faces. |
| C5 | The Regulars | `### 5. The Regulars` (line 82; definition line 84) | A third place has a core group of regular visitors who set the social tone, attract newcomers, and give the space its characteristic mood. |
| C6 | A Low Profile | `### 6. A Low Profile` (line 94; definition line 96) | Third places are characteristically unpretentious, plain, and without airs — their décor maximises comfort by avoiding ostentation. |
| C7 | The Mood is Playful | `### 7. The Mood is Playful` (line 106; definition line 108) | The dominant mood of a third place is one of playfulness — frivolity, humour, verbal wit, and lightheartedness are the norm. |
| C8 | A Home Away from Home | `### 8. A Home Away from Home` (line 118; definition line 120) | A third place provides a sense of rootedness, comfort, and warmth analogous to being at home — it is a psychological anchor in daily life. |

The `name` field in analysis JSON must be one of the eight strings in the "Name" column, character for character (note the theory file's US spelling "Leveler").

### 2.1 Admissible material for boundary judgements

1. **Primary test:** the `**Definition:**` line.
2. **Admissible for disambiguation:** the same subsection's `**Extended description:**`, `**Example indicator:**` and `**Example counter-indicator:**` (Section A), and the boundary notes in Section B ("Distractor Content", lines 130–172), which state where one characteristic ends and another begins.
3. **Not admissible:** Sections C–F (fictional case studies, intervention cards, visual briefs, novel case). They apply the theory to invented venues and are not definitions. The Langlais & Vaux "evolving" characteristics (table at lines 18–28) are excluded: the theory file sets them aside for physical spaces (line 30).

Any rationale that relies on (2) must name the subsection it draws on.

### 2.2 Vocabulary variants (for loose-usage flags, rubric 4.1)

The theory file records label variants (line 14) and uses short forms in its own tables. A card term triggers a vocabulary flag if it matches, case-insensitively, any of:

| Characteristic | Trigger terms |
|---|---|
| Neutral Ground | neutral ground, neutral (when applied to a place, setting or surrounding) |
| The Leveler | leveler, leveller, levelers, levellers, leveling, levelling, equalizer, equaliser |
| Conversation is the Main Activity | conversation, conversational |
| Accessibility and Accommodation | accessible, accessibility, accommodation, accommodating |
| The Regulars | regulars |
| A Low Profile | low profile, low-profile |
| The Mood is Playful | playful, playfulness, playful mood |
| A Home Away from Home | home away from home |

Flags apply on all four claims, not only Claim 4.

---

## 3. Claims, lenses and the "relevant period"

### 3.1 Claims (from workbook sheet `Claims` and spec Section 1)

| No | Label | Board text (verbatim) | What a fitting explanation must account for |
|---|---|---|---|
| 1 | Quantity | The # of third places is declining (quantity) | Fewer third places existing: closures, failure to open, conversion to other uses |
| 2 | Usage | People use third places less than they did before (usage) | Less use of places that exist: frequency, duration, number of users |
| 3 | Outcomes | Outcomes of third places are worsening for social/community (outcomes) | Worse social or community consequences associated with third places (working reading; see Appendix A, item A9) |
| 4 | Quality | Remaining places exhibit fewer third-place characteristics (quality) | Characteristics from Section 2 weakening or absent in places that still exist |

### 3.2 Lenses (proposed working definitions; not from the theory file)

The theory file does not define the disciplinary lenses (Appendix A, item A8). These operational definitions are proposed for approval. A lens is identified by the kind of variable doing the causal work in the card.

| Lens | Causal work done through |
|---|---|
| Psychology | Individual mental states and dispositions: preferences, motivations, emotions, traits, habits, perceptions, expectations |
| Economics | Prices, costs, incomes, revenues, budgets, competition, profit, and the allocation of scarce resources including time |
| Politics | Governments, parties, policy, regulation, public spending decisions, ideology, power and collective conflict |

Where a card uses two lenses, `actual_lens.primary` is the lens of the variable that does the causal work closest to the claim; others go in `actual_lens.secondary`.

### 3.3 Relevant period

Neither the theory file nor the spec fixes the period or place over which decline is claimed (Appendix A, item A10). Until Max decides otherwise, "change" means change relative to an unspecified earlier state, matching the board wording "than they did before". The analyst does not supply dates.

---

## 4. Coding procedure (per entry)

For each row of `Entries` with the target `Snapshot_ID`, in `Entry_ID` order:

1. **Read the record.** Card_Text, Claim_No, Discipline, Transcription_Confidence, Transcription_Notes. Identify student text versus square-bracketed transcriber insertions; struck-through words are already removed and are never quoted or used.
2. **Caveat first.** If `Uncertain`, write the transcription caveat (Section 6) before any code, so the codes are made in its light.
3. **Classify.** Decide whether the card is an explanation. If it restates the claim, describes an outcome, or proposes an intervention, set `not_an_explanation` (Section 8.1). Continue coding all criteria regardless; the flag does not exempt the entry.
4. **Oldenburg mapping** (Section 7): characteristics engaged, relation for each, vocabulary flags.
5. **Six strength sub-scores** (Section 8), in order: claim fit, mechanism, explains change, lens fit, testability, scope. Score each against its anchors only, independently of the others.
6. **Write the testable implication** (Section 8.5) and **the Bodø scope question** (Section 8.6).
7. **Check:** every code carries a rationale with at least one verbatim quote (Section 5); no quote contains `[` or `]`; no code draws on admissible-only material without naming the subsection.

Sub-scores are reported separately. **No total is computed.** Section 9.1 explains how strongest candidates are identified without one.

---

## 5. Rationale rules

1. Every code (each characteristic link, each vocabulary flag, each sub-score, each flag such as `misfiled_to` or `not_an_explanation`) carries a rationale object: `quotes` (one or more fragments) and `text` (one line).
2. Each quote must appear verbatim, character for character, in `Card_Text`, including the student's spelling ("socilise", "polecies"). The validator checks this.
3. Quotes never include square-bracketed transcriber text. Quote around it.
4. For a bare-label card, the quote is the label itself.
5. `text` states the reasoning in one line. It must not assert any fact about the world, any statistic or any source. It assesses explanatory structure only (spec 4.2).
6. Where the rationale relies on admissible material from the theory file beyond the definition line, `text` names the subsection (e.g. "Low Profile counter-indicator").

---

## 6. Transcription caveat rules

1. Every `Uncertain` entry has a non-empty `transcription_caveat` naming the uncertain words or passages (from `Transcription_Notes`) and listing, in `caveat_affects`, which codes would or could change under a different reading.
2. Code only from legible student text. Never resolve an uncertain reading by guessing what the student meant, and never treat bracketed words as student text.
3. If a code depends on an uncertain passage, score on the legible text alone and state in the caveat that the score could change if the passage were read differently. Do not offer the alternative reading as preferred.
4. A `High` entry may also carry a caveat when its notes bear on meaning (e.g. a card that "ends mid-sentence"). This is optional but recommended.
5. Struck-through text recorded in notes is not student text and is never coded.

---

## 7. Oldenburg mapping rules (rubric 4.1)

### 7.1 Engagement

A characteristic is engaged when the card either (a) names it using a trigger term (Section 2.2), or (b) describes a definitional element of it in its own words (e.g. "come and go" engages the Neutral Ground definition's "come and go freely"). Association alone does not count: a card mentioning coffee or music does not engage any characteristic unless it says something that matches a definition. Each engaged characteristic needs its own quote.

If no characteristic is engaged, `engagement` is `"none"` and `none_rationale` says why, quoting the card.

### 7.2 Relation (one per engaged characteristic)

| Relation | Use when the card… |
|---|---|
| `erodes` | links a cause to the weakening or loss of the characteristic in places that exist |
| `barrier` | links a cause to something that prevents the characteristic forming, or prevents people reaching a place that has it |
| `invokes` | names or describes the characteristic without any causal pathway connecting it to anything |
| `none` | (entry level only) no characteristic engaged; recorded as `engagement: "none"` |

If a card could be read as either `erodes` or `barrier`, choose the one its words support; if they support both equally, choose `erodes` for Claim 4 cards (which concern remaining places) and `barrier` otherwise, and say so in the rationale.

### 7.3 Vocabulary flags

For each trigger term in the card, record: the term as written, the quote, the characteristic it maps to, and `usage_matches_definition`:

- `matches` — the card's use agrees with the definition line.
- `partial` — overlaps the definition but adds or omits a defining element, or blends it with another characteristic.
- `does_not_match` — the card's use describes something the definition does not, or something the theory file attributes to a different characteristic (Section B boundary notes are the test).
- `undeterminable` — the card gives too little to judge.

The rationale names the definitional element that is matched or missed.

---

## 8. Strength anchors (rubric 4.2)

These cards are unevidenced assertions. Every criterion assesses explanatory structure, not truth. No code, rationale or implication may award or imply evidential strength.

Worked examples below are single-criterion illustrations, not full codings. Session 2 codes all entries afresh against these anchors; a worked example's score is not binding if the protocol, applied in full, gives a different result, but any divergence must be reported.

### 8.1 Claim fit — does it explain the claim it is filed under?

| Score | Anchor |
|---|---|
| 2 | The card states or unambiguously implies an effect on the filed claim's own variable (Section 3.1). |
| 1 | A path to the filed claim exists only through a step the card does not state, or the card's effect fits two or more claims equally, or the card states no effect and its filing position is the only link. |
| 0 | No path to the filed claim, or the card is `not_an_explanation`. |

- `misfiled_to` (claim number or null) is recorded whenever another claim is a more direct fit, at any score.
- `not_an_explanation` types: `restates_claim`, `describes_outcome`, `proposes_intervention`. When a card admits both a restatement reading and a cause reading, take the reading that requires the analyst to add no words, and record the alternative in the rationale.

**Worked examples**

| Score | Entry | Card text | Reasoning |
|---|---|---|---|
| 2 | S1-003 (Claim 1, Economics) | "They aren't economically viable. The don't make enough revenue. They don't break even, harder to stay in business." | "harder to stay in business" states closure, which is the Quantity variable directly. |
| 1 | S1-006 (Claim 1, Economics) | "High cost of living means need to work instead of socilise." | The stated effect, "work instead of socilise", is on people's use of time (Usage). Reaching fewer places needs an unstated step (less use → less revenue → closure). `misfiled_to: 2`. Near-duplicate of S1-014 on Claim 2 (a cross-claim cluster for synthesis). |
| 0 | S1-033 (Claim 4, Economics) | "The Deterioration." | Read without added words, "Deterioration" restates the Quality claim (remaining places have deteriorated). `not_an_explanation: restates_claim`. Alternative reading (deterioration of premises as a cause) would require adding "of premises"; recorded, not adopted. |

### 8.2 Mechanism — is a causal pathway specified?

| Score | Anchor |
|---|---|
| 2 | Cause → at least one stated intermediate step → effect. The card says how the cause produces the effect. |
| 1 | A causal relation is stated (cause and effect, or a condition with a direction of effect) but with no intermediate step. |
| 0 | No causal relation stated: a bare label, a bare noun phrase, or a condition with no stated effect. |

**Worked examples**

| Score | Entry | Card text | Reasoning |
|---|---|---|---|
| 2 | S1-014 (Claim 2, Economics) | "People are working more and for longer because of rising living costs and therefore don't have time to go to third places" | Three linked steps: "rising living costs" → "working more and for longer" → "don't have time to go to third places". |
| 1 | S1-035 (Claim 4, Politics) | "Less of a leveller because of increased polarization" | Cause ("increased polarization") and effect ("Less of a leveller") joined by "because of", but nothing says how polarisation reduces levelling. |
| 0 | S1-009 (Claim 1, Politics) | "Polarization" | Single word; no effect or pathway stated. |

### 8.3 Explains change — does it invoke something that changed?

| Score | Anchor |
|---|---|
| 2 | The card states that its factor changed, through change language (increase, rising, more, less, become, nowadays) or a datable event. |
| 1 | The factor is one that can vary over time and the wording implies a shift, but the card does not state that it changed. |
| 0 | The card presents a standing condition or general truth that, on its wording, could always have held. |

Scored independently of mechanism: a single word that itself denotes a change (e.g. "Inflation") can score 2 here while scoring 0 on mechanism. A word that can denote either a state or a process scores 1.

**Worked examples**

| Score | Entry | Card text | Reasoning |
|---|---|---|---|
| 2 | S1-012 (Claim 2, Psychology) | "Covid Adaptation: people become more introverted cause they got used to lock down." | "become more introverted" is explicit change; "lock down" is a datable event. |
| 1 | S1-008 (Claim 1, Politics) | "Conservative governments have underinvested in third places." | Investment can vary over time and "have underinvested" implies a period, but the card does not say investment fell or that such governments became more common. |
| 0 | S1-034 (Claim 4, Economics) | "You can't really come and go as you please if you have to pay for it. (So there is no neutral ground)" | A general conditional ("if you have to pay for it") true of any paid venue at any time; the card does not say more places now charge. |

### 8.4 Lens fit — does it use the discipline it is filed under?

| Score | Anchor |
|---|---|
| 2 | The causal work is done through the filed lens's variables (Section 3.2). `actual_lens.primary` equals the filed lens. |
| 1 | The filed lens is present but shares or cedes the causal work to another lens; or the card is a bare label in the filed lens's vocabulary, so the lens is indicated but no causal work can be assessed. |
| 0 | The filed lens is absent; the causal work is done by another lens, or the lens is undeterminable. |

`actual_lens` is always recorded: `primary` (Psychology, Economics, Politics or Undeterminable) and `secondary` (zero or more).

**Worked examples**

| Score | Entry | Card text | Reasoning |
|---|---|---|---|
| 2 | S1-016 (Claim 2, Economics) | "Economics: Less disposable income for ticketed third spaces (museums etc)" | "disposable income" and "ticketed" are income and price variables. `actual_lens: Economics`. |
| 1 | S1-005 (Claim 1, Economics) | "Decrease in budget: relocation of money to other sectors. Also politics." | "Decrease in budget" is economic, but "relocation of money to other sectors" is a spending decision the card itself hands partly to another lens ("Also politics"). `actual_lens: Economics, secondary Politics`. |
| 0 | S1-037 (Claim 4, Politics) | "Overcommercialization causes the third places to focus on profit." | "focus on profit" and "Overcommercialization" are market variables; no government, party, policy or power is named. `actual_lens: Economics`. |

### 8.5 Testability — can an observable implication be derived?

| Score | Anchor |
|---|---|
| 2 | Cause, effect and direction are stated concretely enough that an observable implication follows without the analyst adding content. |
| 1 | An implication follows only after the analyst supplies one missing element (direction, effect, or the meaning of one vague term). The supplied element is stated in `implication_note`. |
| 0 | An implication would require the analyst to supply both the effect and the pathway, i.e. to write the explanation for the student. |

Implication format: "If [card's claim], one would expect [observable pattern], compared with [contrast]." The implication says what would be observed if the card were right; it never states whether it is observed, cites data, or estimates magnitude. Score 0 → `testable_implication: null` with the reason in `implication_note`.

**Worked examples**

| Score | Entry | Card text | Reasoning and implication |
|---|---|---|---|
| 2 | S1-013 (Claim 2, Economics) | "Some third places propose things that ppl can make themselves (for cheaper) -> coffee" | Cause, effect and contrast are on the card. *Implication:* if people substitute cheaper home-made versions, one would expect use to fall more at third places whose main offer can be made at home (such as coffee) than at places whose offer cannot. |
| 1 | S1-020 (Claim 3, Psychology) | "Social media massive consumption. Because people don't feel like they want to socialize anymore physically. & expectation" | The card links heavy social media use with not wanting to "socialize anymore physically", but "Because" makes the direction unclear and "& expectation" is undefined. *Supplied element:* treat the two as associated without fixing direction. *Implication:* people reporting heavier social media use would be expected to report less in-person socialising; this cannot discriminate which comes first. |
| 0 | S1-022 (Claim 3, Economics) | "Inflation" | Any implication would need the analyst to supply what inflation affects and how. `testable_implication: null`. |

### 8.6 Scope — does it state or imply where it holds?

| Score | Anchor |
|---|---|
| 2 | The card names a condition, subset of places or population, such that one can say where it would not apply. |
| 1 | A scope condition is implied (by an actor, event or institution whose presence varies) but not stated. |
| 0 | Stated as universal ("people", "third places") with no scope cue. |

Every entry also gets `bodo_question`: an open question, not a verdict, on whether the explanation plausibly transfers to Bodø / Northern Norway. The question may draw only on the three dimensions named in the spec (welfare state, small-city dynamics, club-based civil society). It must not assert any fact about Bodø, Norway or the club, and must not suggest what the club should build or do.

**Worked examples**

| Score | Entry | Card text | Reasoning and Bodø question |
|---|---|---|---|
| 2 | S1-007 (Claim 1, Economics) | "More recognized brands like Starbucks receive more money than the local brands." | Scope is stated by contrast: settings where "recognized brands like Starbucks" compete with "local brands". It would not apply where no such competition exists. *Bodø question:* Does a chain-versus-local contrast arise in a small city, and does it bear on third places organised through club-based civil society rather than commercial cafés? |
| 1 | S1-025 (Claim 3, Politics) | "Different political parties have different budget priorities. Public goods." | "Public goods" implies the claim holds where third places depend on public budgets that change with the governing party; this is not stated. *Bodø question:* In a welfare-state setting, how far does provision of community space depend on which party governs, and are club-based third places funded as public goods at all? |
| 0 | S1-027 (Claim 4, Psychology) | "People are more introverted and so socialise less." | "People" without qualification; no scope cue. *Bodø question:* Is there reason to expect the claimed shift towards introversion to hold equally in a small Northern Norwegian city, and would it apply to gatherings organised through clubs? |

---

## 9. Synthesis procedure (rubric 4.3, per claim)

Synthesis is written after all entries in the snapshot are coded. It cites entries by `Entry_ID` and sub-scores by name. It assesses explanations; it does not recommend what the club should build.

### 9.1 Strongest candidates (no total score)

A card is a **candidate** for its filed claim if `claim_fit = 2` and `mechanism ≥ 1` and `explains_change ≥ 1`. Rationale: an explanation of *this* decline must (a) be about this claim, (b) say something causal, and (c) involve something that changed; a card failing any of these cannot be the strongest explanation of a change regardless of its other scores. Lens fit, testability and scope are reported alongside but are not gates.

Candidates are listed with all six sub-scores. Where an ordering is needed, order by mechanism, then explains change, then testability, and state in `why` which sub-scores separate them. No sub-scores are summed. If no card passes the gate, record that explicitly and list the nearest misses with the criterion each fails. Cards with `misfiled_to` pointing at this claim are listed as `imported_candidates`, not as candidates.

### 9.2 Clusters

Group entries proposing the same or overlapping cause, including across claims (e.g. a cost-of-living card on Claim 1 and one on Claim 2). Each cluster: `kind` (`duplicate` = same cause and effect; `overlap` = same cause, different effect or framing), entry IDs, and the shared element quoted from at least two cards.

### 9.3 Cross-lens convergence

Identify one mechanism expressed in different disciplinary language (e.g. a Psychology card on time scarcity and an Economics card on working hours). Record the entries, their filed and actual lenses, and the shared mechanism stated neutrally.

### 9.4 Tensions

Pairs or groups of cards whose mechanisms cannot both hold as stated, or that predict opposite observable implications. Describe the tension; do not adjudicate it (students do that in weeks 6–7).

### 9.5 Gaps

- `characteristics_unengaged`: characteristics (Section 2 names) engaged by no card on this claim. Also report, at snapshot level, characteristics engaged by no card on any claim.
- `lenses_without_mechanism`: lenses with no card on this claim whose `actual_lens.primary` is that lens and whose `mechanism ≥ 1`.

---

## 10. Output conventions

- One file per snapshot: `analysis/<Snapshot_ID>.json`, validating against `analysis/schema.json`.
- `snapshot.snapshot_date` is copied from the workbook; if blank (as in S1), it is `null` and noted.
- `overrides` is an empty array when written by the analyst. It is populated only by the viewer (Session 4). An override never edits the analyst's code in place: it records a JSON Pointer to the overridden field, the original value, the new value, a reason and a timestamp. The analyst's code remains the record of what the protocol produced.
- `protocol_version` and `theory_file.sha256` are recorded so later readers can tell which protocol and theory text produced the codes.

---

## 11. Prohibitions

- No characteristic, name or definition from outside the theory file.
- No invented evidence, statistics, sources, or facts about real places, including Bodø.
- No evidential strength awarded or implied.
- No recommendations for interventions or for what the club should build (the course is in its explain/adjudicate phase).
- No guessing at uncertain readings.
- No total score.

---

## Appendix A. Theory extraction report: gaps and ambiguities

Items marked **Decision needed** change how entries are coded and should be settled before Session 2. The proposed default is what this protocol currently does.

**A1. The theory file is a secondary synthesis, not Oldenburg.** `third-place-content.md` is a "Content Reference Document" drawing on three secondary sources (lines 3–6), which "all ... draw on Oldenburg (1999)" (line 14). Definitions are the file's paraphrases, not Oldenburg's text. Treated as authoritative per spec; noted so no one cites the definitions as Oldenburg's own words.

**A2. Which name is "exact".** The file uses several forms for the same characteristic: Section A headings ("The Leveler", "A Low Profile", "The Mood is Playful", "Conversation is the Main Activity"), the Section A comparison table ("Leveler", "Conversation is Main Activity"), and Section C tables ("Leveler", "Low Profile", "Playful Mood", "Conversation", "Accessibility", "Regulars", "Home Away from Home"). **Decision needed:** proposed default is the Section A `###` headings without numbers.

**A3. Spelling: "Leveler" vs "leveller".** The theory file uses US "Leveler" throughout Section A, while the course's own documents and card S1-035 use "leveller". Coding uses "The Leveler" (the theory file's form); "leveller" is a recognised trigger term for vocabulary flags.

**A4. Langlais & Vaux's nine evolving characteristics.** The file describes them as "substantial, not cosmetic" reframings (line 30) but sets them aside for physical spaces. Excluded from coding. A card about digital spaces (e.g. S1-010 "virtual ones") is coded against the eight canonical characteristics only.

**A5. Price and payment sit across three characteristics.** The Section A Neutral Ground definition concerns obligation, invitation and hosting, and its extended description says no one is "financially ... compelled to be present" (line 38). The Accessibility counter-indicator includes "a price point that restricts regular attendance" (line 78). The Leveler counter-indicator includes "dress codes that signal economic status" (line 54), and Section B note 4(a) assigns social inclusiveness to the Leveler, not Accessibility. A card about cost or payment (e.g. S1-032, S1-034, S1-038) can therefore engage up to three characteristics. Proposed rule: map to every characteristic whose definition or admissible material the card's words match, each with its own quote. Section C (not admissible) is internally inconsistent here too: it rates a café requiring a purchase as Neutral Ground "Present" (Case 2) while a later card treats removing the purchase requirement as bearing on Neutral Ground (line 286). **Decision needed:** confirm the multi-mapping rule.

**A6. Accessibility includes "familiar faces".** The Accessibility definition ends "expect to find familiar faces" (line 72), which overlaps The Regulars. Proposed rule: a card about finding known people maps to The Regulars unless it also concerns ease of access or timing.

**A7. Conversation and playfulness overlap.** The Conversation definition describes talk as "lively, playful, wide-ranging" (line 60). Section B note 3(b) separates them: playfulness is "the register of interaction, not the centrality of conversation itself" (line 146). That note is the test applied.

**A8. No definition of the three lenses.** The theory file does not define Psychology, Economics or Politics as lenses, and no other repo file does operationally. Section 3.2 proposes working definitions. **Decision needed:** approve or amend Section 3.2; lens fit and `actual_lens` depend on it.

**A9. Claim 3 (Outcomes) is ambiguous; not a theory-file gap but it affects claim fit.** The board text "Outcomes of third places are worsening for social/community" can mean (a) the social outcomes that third places produce are worsening, or (b) social and community outcomes are worsening as third places decline. The course spine (CLAUDE.md, "Analytical spine") glosses OUTCOME as "social consequences such as belonging and trust have worsened". The theory file says nothing about outcomes or decline. Several Claim 3 cards (e.g. S1-021, S1-022, S1-026) read as causes of fewer or less-used places rather than of worse outcomes; their claim-fit score depends on this reading. **Decision needed:** which reading governs Claim 3.

**A10. No theory of decline, period or place.** The theory file defines what a functioning third place is; it says nothing about decline, its causes, its period or its geography. "Explains change" therefore has no theory-given reference period (Section 3.3).

**A11. No general definition of "third place".** The file defines the eight characteristics but not the concept itself (e.g. its relation to home and work). The only such use is in non-admissible Section F ("COMMON was a third place; HIVE is a second place", line 370). Cards about workplaces, gyms or ticketed venues (e.g. S1-016 museums, S1-032 leisure centres) cannot be ruled in or out as third places by the theory file. Proposed rule: code what the card says; do not judge whether the student's example is a third place.

**A12. Spec ambiguity: `relation: none`.** Spec 4.1 lists `none` alongside the per-characteristic relations, but a characteristic with no relation would carry no quotable basis. Interpreted as entry-level: `engagement: "none"` with a quoted `none_rationale`.

**A13. Workbook data notes (for Session 2).** `Snapshot_Date` is blank for all S1 rows (null in JSON). The `Notes` sheet records a pink card cut off in all photographs; it is not in `Entries` and will not be coded. S1-032 ends mid-sentence ("so they").

---

## Appendix B. Worked-example index

18 entries are scored on one criterion each in Section 8. No other entry is coded in Session 1.

| Criterion | 2 | 1 | 0 |
|---|---|---|---|
| Claim fit | S1-003 | S1-006 | S1-033 |
| Mechanism | S1-014 | S1-035 | S1-009 |
| Explains change | S1-012 | S1-008 | S1-034 |
| Lens fit | S1-016 | S1-005 | S1-037 |
| Testability | S1-013 | S1-020 | S1-022 |
| Scope | S1-007 | S1-025 | S1-027 |
