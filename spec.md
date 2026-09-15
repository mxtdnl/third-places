# Third Place Builder — design spec

Activity 3. A single-file simulation (`third-place-builder.html`) in which the player runs a venue for eight seasons and tries to give it Oldenburg's eight characteristics. The teaching point is that the characteristics compete with each other, with money, and with whoever owns the building.

## Assumptions made without asking

These would have been clarifying questions. Each is easy to change.

| Question | Decision | Where to change |
|---|---|---|
| Individual play or projected in class? | Individual or small group on a laptop; light palette from the Decoder. Works at phone width. | CSS in the file head |
| Deterministic or random events? | Deterministic and state-conditional, so two students with the same choices get the same result and the class can compare. | `EVENTS[].when` |
| How long is a game? | 8 seasons (two years), 3 actions in season 1 then 2 a season. | `SEASONS`, `ACTIONS_FIRST_SEASON`, `ACTIONS_PER_SEASON` |
| Show tradeoffs up front or reveal them after? | Shown up front on every card (direct effects, disruption, money). The hidden part is the emergent dynamics and the events. | `effectChips()` |
| One site or several? | Three sites mirroring the content file: a community unit like COMMON, a high street lease like Starbucks, a campus room like The Common Room. | `SCENARIOS` |

## Core loop

1. Choose a site. Each has starting money, rent, subsidy, base footfall and its own event deck.
2. Each season, pick up to N action cards. Every card sets one of 11 levers (entry policy, prices, hours, layout, noise, interior, Wi-Fi, staffing, programme, children, marketing). One change per lever per season.
3. End the season. Direct characteristics move toward their targets; emergent ones grow or shrink; money changes; a result screen shows both.
4. If a state-conditional event is eligible, it fires as a dilemma with two to four choices. Some choices require conditions (money, or regulars and home-away-from-home above a threshold). Two "tryable" choices can be attempted without meeting the condition and fall back to a worse outcome.
5. After season 8, or on closure, a verdict screen with the final profile, score by season, generated lessons and discussion questions. Print export.

## Model

Five characteristics are **direct**: Neutral Ground, Leveler, Conversation, Accessibility, Low Profile. Each has a target computed from the levers (plus persistent event modifiers) and moves 70% of the way to it each season.

Three are **emergent** and cannot be set: Regulars, Playful Mood, Home Away from Home.

- Regulars target = mean(NG, AC, CV) × (0.55 + 0.45 × staff continuity). Moves 35% toward target per season, minus 0.9 × disruption, plus 3 in a season with no changes.
- Playful Mood target = 0.45 CV + 0.3 RG + 0.25 (100 − rules pressure). Moves 50% per season.
- Home Away target = (0.4 RG + 0.2 NG + 0.2 LP + 0.2 AC) × (0.7 + 0.3 × continuity). Moves 30% per season, minus 0.5 × disruption.

Disruption is the sum of the changed levers' weights (entry 10, layout 8, interior 7, staffing 7, prices 6, hours 5, noise 4, programme 3, children 3, marketing 3, Wi-Fi 2).

Economy per season: takings = visits/week × 12 × spend per visit. Costs = rent (or service charge), staff (scaled by hours), campus security for long hours, running costs of the chosen options, and supplies at 35% of takings. Footfall multipliers reward branding, fast Wi-Fi, long hours and low prices; regulars add up to 40%.

Score = mean of the eight values. Verdicts: score ≥ 72 with no characteristic under 50 is "a third place"; ≥ 55 "in the making"; ≥ 38 "a venue"; below that "a second place in disguise". Overdrawn twice closes the place.

## Tradeoffs the model enforces

- Open doors, low prices and long hours raise Neutral Ground, Leveler and Accessibility and lose money.
- Branding, design, fast Wi-Fi and loyalty schemes raise footfall and takings and lower Low Profile, Conversation and Leveler.
- Membership, booking, quiet policies and corporate hire are the most reliable income and kill Neutral Ground, Conversation and Playful Mood.
- Stable staff are expensive; cheap staff and agency staff lose continuity, which caps the regulars.
- Every change costs regulars and home-away-from-home, so fixing a weak characteristic delays the emergent ones. Doing nothing is a valid move.
- Success triggers its own problems: strong regulars can close ranks; designed interiors attract awards and virality; the owner can sell, reclassify or withdraw a subsidy.

## Balance (from the tuning harness)

| Strategy | Community unit | High street | Campus |
|---|---|---|---|
| Change nothing | Closed | Closed | Second place (estates takes the room) |
| Community-minded, cheap staff | Third place, ~£4k left | Third place, ~£66k | Third place, ~£58k |
| Community-minded, stable staff | Closed | Third place, ~£41k | Third place, ~£29k |
| Chain-style (premium, branded, quiet, laptops) | Closed | Venue, ~£92k | Closed or second place |
| Change something every season | Closed | In the making, overdrawn | Closed |
| Gated (membership, individual, fast Wi-Fi) | Closed | Closed | Second place |

The community unit is the hard mode: viable only on cheap staff with a community programme, and only if the residents can be rallied when the developer sells.

## Content sources

Events and lever descriptions are drawn from the cases and intervention cards in `third-place-content.md`: the Common Room's booking reclassification and postgraduate clique, Starbucks's digital refit, community levy and TikTok virality, Elm Road's design award and funding cuts, and COMMON's sale to HIVE.
