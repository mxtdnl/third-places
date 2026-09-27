# Signal Tower: notes

`signal-tower.html` is built to the Signal Tower design handoff (spec sections 1–11). This file records where the build departs from the spec, the calibration record, and notes for running it in class.

## Running it

- Open `signal-tower.html` from the file system or GitHub Pages. No network calls.
- The seed word is shown in the header. Give the class one seed for identical seasons.
- `signal-tower.html?test=1` runs the model suite in the browser. `node tests/signal-tower.mjs` runs the same suite plus file-level checks.
- State autosaves to `localStorage` under `signal-tower-v1`. Only the inputs are saved (seed, quest, dashboard, weekly allocations, review changes), and the season is replayed from them. Export JSON and Import JSON move a session between devices. Reset asks for confirmation first.

## Where the build departs from the spec

These are design decisions made during calibration. Each one can be changed in `CONFIG`.

| Area | Spec | Build | Why |
|---|---|---|---|
| Gain scale | not specified | `gainScale 0.8` on weekly gain | With the raw formula the tower reaches 100 within the season |
| Fatigue scale | not specified | `fatigueScale 0.5` on every action's `f` | With raw `f` values the passive bot burns out almost every week |
| Saturation | not specified | tokens past 4 on one action work at half rate | Stops single-action spam beating the expert |
| Burnout | E −3 next week | also sheds 0.15 fatigue (the crash) | Without it, burnout repeats every week once F passes 0.7 |
| Rest | `f = −0.15` and `−0.15 × rest` in the F update | counted once, in the F update | Avoids counting rest twice |
| Plateau | drawn with p = 0.6/7 per week | exactly one plateau per season, starting in a non-checkpoint week from 2 to 10; if none is drawn it is placed in week 5, 6 or 7 | Every season needs the persistence-or-pivot lesson |
| Filler words noise | σ 2 | σ 1 | At σ 2 the plateau is not detectable in the lead |
| Half-marathon fatigue | long run "f high", speed f 0.12 | easy 0.02, long 0.06, speed 0.10; injury p 0.5 − 0.2 × strength tokens when F > 0.6 | Brings the running quest into the calibration bands |
| Spanish and network f values | not specified | convo 0.09, SRS 0.02, grammar 0.03, coffee 0.07, follow-up 0.02, give 0.04, events 0.03, connect 0.01 | Authored for calibration |
| Lead slots | 1 lag + 3 leads | the lag is required; lead slots may be left empty, with a warning | Allows the "lag-only dashboard" case in section 10 |
| Archetypes | six titles, no order | checked in this order: Burnout Sprinter, Vanity Curator, Busy Bee, Lucky Wanderer, Signal Reader, Rear-View Driver; fallback **Steady Climber** | The spec does not define a default |
| Typography | Jost, embedded or fallback | fallback stack only, starting with `Jost` if installed locally | No network or embedded font |
| Palette | six tokens | adds `--card #F3EEE2` (raised paper) and `--red-text #A32A22` | Paper on `#B8322A` is 4.4:1, below AA for body text. Red fills that carry text use the deeper red. The suite checks every text pairing |
| Transfer card | no storage | autosaved with the rest of the session; per-field minimum word counts (goal 6, indicators 3–4, others 1–3) | Repo conventions require autosave and word minimums. The default 25 words does not suit short fields, so the minimums are set per field in `CONFIG.transfer` |
| Group names | repo convention says capture a group | one optional name field | The spec is single-player |

## Calibration record

50 seeds per policy per quest (`cal0` to `cal49`), mean final C ± SD. Every cell is inside the spec band. The suite fails if any cell drifts out.

| Policy (band) | Speaking | Running | Spanish | Network |
|---|---|---|---|---|
| Passive (35–45) | 42.5 ± 1.4 | 37.0 ± 3.9 | 42.1 ± 1.4 | 44.1 ± 1.3 |
| Lag-only (45–55) | 51.6 ± 2.7 | 49.0 ± 3.5 | 49.5 ± 2.3 | 52.6 ± 2.7 |
| Vanity-heavy (35–45) | 35.2 ± 4.0 | 38.6 ± 3.8 | 43.2 ± 3.9 | 35.9 ± 3.8 |
| Good dashboard, sensible (65–75) | 69.0 ± 3.8 | 66.4 ± 2.1 | 69.9 ± 3.6 | 67.4 ± 2.7 |
| Expert bot (75–85) | 77.2 ± 3.1 | 80.1 ± 2.9 | 77.2 ± 3.2 | 82.4 ± 2.9 |

Other section 10 requirements, as checked by the suite:

- **Dashboard effect vs seed spread:** the gap between sensible and lag-only play is 4.6× to 5.7× the larger SD.
- **Spam:** the best single-action spam scores 44.6 (speaking), 49.6 (running), 47.0 (Spanish) and 49.6 (network), all well below the expert.
- **Burnout:** reached by lag-only play without a guardrail in 20 of 20 seeds on every quest.
- **Vanity readings:** the vanity dashboard meets its own targets in 68% (speaking) to 100% of weeks while its tower stays at 35–45.
- **Plateau:** in the plateau week, good C-reading leads (filler words, new words used, meaningful conversations) move 47–50% as much as the week before. The resting-heart-rate lead in the running quest lags two weeks, so it shows the plateau later, as its card says.

The policies are defined in `BOTS` in the model script:

- **passive:** 2 tokens on each lever, no dashboard.
- **lagOnly:** 3/3/2/2 down the effectiveness order, with at most one token on hard sessions (f ≥ 0.1), one on a feel-good action, and no rest until a burnout card lands.
- **vanity:** 3 tokens on each feel-good action, the rest spread; its dashboard is two vanity leads, a weak lead and the flattering lag.
- **sensible:** the lag-only template with two feel-good tokens and one rest token, or three rest tokens when its guardrail shows fatigue above 0.5.
- **expert:** meets its own targets first, then fills greedily by marginal effect net of a fatigue price. It rests enough to keep predicted fatigue at or below 0.2, as read through its guardrail.

## Authored content to review

The spec fully specifies the speaking quest only. For the other three quests these were authored for this build and are design values, not empirical claims: indicator ratings, noise, units, reading formulas, default targets, event headlines, card-flip sentences, and the `e` and `f` values the spec leaves open. The eight warm-up sort cards, the archetype lines and the fallback Steady Climber title are also authored. All of it lives in `CONFIG` in `signal-tower.html`.
