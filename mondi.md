# Quattro Mondi

One pizza, four universes. A single-player competitive economics simulation on
market structure, built for first-year undergraduates. Eight rounds, 20-25
minutes, one self-contained file.

- The tool: `mondi.html`
- The tests: `tests/run.mjs` (Node built-ins only) and `mondi.html?test=1`
- This file: how to deploy it, how to run a class on it, how the numbers were
  traced, and what each mechanic is there to teach.

## What it is

The student runs the same pizza firm in four parallel universes. Identical
oven, identical staff, identical cost curve: `TC(q) = 500 + 4q + 0.05q²`, with
average cost at its minimum of £14 at q = 100. Only the market structure
differs.

| Universe | Structure | Levers |
|---|---|---|
| Mondo Quadrato | perfect competition | quantity, and an asking price that exposes price taking |
| Mondo Cerchio | monopolistic competition | price, brand spend |
| Mondo Triangolo | oligopoly | price, the cartel offer, leniency |
| Mondo Uno | patent monopoly | price |

The lesson lives in the comparison: the same costs produce radically different
prices, outputs, profits and welfare outcomes, driven by structure alone.

## Running it

It is one file with no dependencies, no build step and no network calls. It
works opened straight from the file system and from a web server.

**GitHub Pages.** Push the repository, then in the repository settings open
*Pages*, choose *Deploy from a branch*, pick the default branch and the root
folder, and save. The tool is then at
`https://<user>.github.io/<repo>/mondi.html`. Nothing else is needed; there is
no build step to configure.

**Offline.** Open `mondi.html` from disk. Everything, including the charts and
the test suite, runs from `file://` with the network switched off.

## URL parameters

| Parameter | Effect |
|---|---|
| `?seed=1234` | fixes the seed, so every student faces identical shocks and events |
| `?test=1` | runs the assertion suite in the browser and prints the results |
| `?verify=CODE&log=BASE64` | recomputes a submitted result from its log |

## For the instructor

**Setting one seed for the class.** Give everyone the same link with
`?seed=` set. The seed fixes the demand shocks, which round the price
leadership event arrives in, which round the cartel offer arrives in, and every
detection and leniency draw. Scores on one seed are therefore comparable.
Without the parameter, each student gets a random seed, which is shown in the
top right.

**Verifying a result.** The results screen prints a code of the form
`SEED-SCORE-XXXX`, where `XXXX` is an FNV-1a hash of the seed, the full
decision log, the diagnosis answers and the lens charges left. "Copy the code
and link" puts both the code and a `?verify=...&log=...` link on the clipboard.
Opening that link replays the log against the same seed, recomputes the score
from scratch and says whether the submitted code matches. A student who edits
their log or their score gets a mismatch.

**Saving and moving work.** Progress autosaves to `localStorage`, keyed by
seed, and every access is wrapped in `try/catch`, so the tool behaves
identically where storage is unavailable. "Export json" and "import json" move
a game between devices. "Copy as text" and the print stylesheet produce a clean
A4 record of the debrief.

## Scoring

Each round, in each universe:

```
regret = optimal profit for the realised state - profit actually earned
score  = 100 × max(0, 1 - regret / width)
```

The optimum is recomputed against the realised state every round, so the
demand noise never penalises the player. The widths were set from the traced
baselines below:

| Universe | Width | Why |
|---|---|---|
| Quadrato | 12 | the profit function is flat near the optimum, so the window has to be tight |
| Cerchio | 500 | the passive price of £20 gets worse every month as copycats arrive |
| Triangolo | 400 | wide enough that a small price error is survivable |
| Uno | 1250 | the passive price of £20 is about £1,180 below the optimum for five months |

The oligopoly score is capped at 120 rather than 100, so a cartelist who gets
away with it can score above the legal benchmark without the result becoming
absurd.

Composite, out of 106: 75% decision score (four universes weighted equally,
each averaged over eight rounds), 25% diagnosis, plus one point for each of the
six Economist's Lens charges left unspent.

## Traced baselines

Measured over 60 seeds for the bots and 250 seeds for the cartel comparison
(`node tests/run.mjs`; `--full` runs 200 and 1000).

| Path | Quadrato | Cerchio | Triangolo | Uno | Decision score |
|---|---|---|---|---|---|
| Textbook (per-round legal optimum) | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| Passive (every default) | 43.0 | 40.4 | 99.7 | 41.4 | 56.1 |
| Coin-flip (uniform random) | ~0 | ~14 | ~20 | ~35 | 18.4 |

The oligopoly is the deliberate exception: the passive default is the
prevailing price, which is close to optimal, because price rigidity is the
lesson of that universe. The other three hold the passive path inside the
35-45 band.

Composite figures, assuming a bot answers the diagnosis at chance (25%) and
spends no lens charges: textbook 87.3, passive 54.3, coin-flip 26.1. A textbook
path with a perfect diagnosis reaches the full 106.

Grade bands were set after that trace:

| From | Label |
|---|---|
| 0 | stallholder |
| 35 | franchisee |
| 55 | regional manager |
| 72 | market maker |
| 88 | multiversal tycoon |

**Cartel expected value.** Over 1,000 seeded runs, accepting the cartel and
holding the price returns 93% of the legal path, accepting and cheating 97%,
and accepting then reporting first 85%, each with far more variance than the
legal path. Collusion never dominates in expectation, which is the point.

**Exploits checked and closed.** Zero output in Quadrato (the £500 oven cost is
still owed), maximum brand spend in Cerchio (past the marginal-return optimum),
holding the monopoly price after the patent expires (demand runs out at £30 and
the firm sells nothing), and always cheating on the cartel. None of the four
beats the textbook path. The Shark bot, which cheats and takes the seeded
detection draws as they fall, averages about half a point above the textbook
path on the decision score with very much higher variance; that is the
intended shape of the 120% oligopoly ceiling, not a loophole.

## Theory map

| Mechanic | What it teaches |
|---|---|
| Identical cost curve in all four universes | price differences come from structure, not from costs |
| Quadrato's asking price field | a price taker faces horizontal demand: ask a penny more and sell nothing |
| Quadrato's entry rule, `ΔN = round(π/60)` | profit is a signal; entry competes it away until P = min ATC = £14 |
| Cerchio's copycat entry, `a ← a − 0.04 π*` | free entry drives economic profit to zero while market power survives |
| Cerchio's tangency at a ≈ 244 | P = ATC, P > MC and q < 100 all at once: excess capacity is the standing cost of variety |
| Cerchio's brand spend, effective for one month | diminishing returns on differentiation, with a well-defined per-month optimum |
| Triangolo's kink at the prevailing price | rivals match a cut and ignore a rise, so marginal revenue jumps and the price sticks |
| Triangolo's round 5 cost shock | marginal cost moves from £13 to £14, stays inside the £14.50 to −£23 gap, and the price does not move |
| Triangolo's price leadership event | the kinked model explains rigidity, not how the price was set; leadership needs followers |
| Triangolo's cartel, detection and leniency | the prisoner's dilemma with a real enforcement regime attached |
| Uno's elasticity meter | a monopolist with positive marginal cost always operates on the elastic part of demand |
| Uno's shaded triangle | deadweight loss is the surplus that the monopoly price destroys, about £587 at the optimum |
| Uno's patent expiry in round 6 | when demand flattens the optimum moves, and adjusting late is expensive |
| The Economist's Lens, six charges | reason from the numbers first; the curves are a resource, not wallpaper |

## Accuracy guardrails

The handout this activity grew out of contains errors. The build does not
reproduce them, and the debrief states each correction plainly:

1. Monopoly demand is **not** inelastic at the profit-maximising price. The
   passive default of £20 sits at an elasticity of −0.67, and the tool says so.
2. Economic profit tends to zero in the long run under free entry, in perfect
   competition and in monopolistic competition alike. The short run is where
   the profits live.
3. The kinked demand model explains price rigidity, not price formation.
4. Every profit figure is economic profit, labelled as such.

## Editing the content

Everything editable sits in one `CONFIG` object at the top of
`<script id="model">`: the round count, the copy for each universe, the news
headlines, the whole feedback bank, the grade bands and the five closing notes.
Text can be changed freely. The numbers under `CONFIG.model` are the economics;
changing them invalidates the calibration recorded above, so re-run
`node tests/run.mjs` after any change there.

## Architecture

- `<script id="model">` holds the economics and touches no DOM. It exports a
  single `QM` object: the cost functions, the four universes' `init`,
  `prepare`, `optimum` and `step`, the scoring function, the diagnosis builder,
  the four bots, the replay and verification helpers, the PRNG (mulberry32) and
  the shared assertion suite.
- The second script block holds the interface: state, screens, inline SVG
  scenes, canvas charts and the feedback writer.
- All randomness is drawn from the seed up front, so the player and all four
  bots face exactly the same luck.
- The results screen emits machine-readable lines to a collapsible panel and to
  `console.log`, in the form
  `DATA|seed=1234|world=cerchio|round=5|p=18.20|S=60|q=72.4|profit=211.5|opt=248.0|score=85.2`.

## Where this build departs from the specification

| Change | Reason |
|---|---|
| The file is `mondi.html`, not `index.html`; this document stands in for `README.md` | asked for, and the repository already has an `index.html` listing ten other tools |
| Cerchio's brand effect β is 3, not 6 | at β = 6 the optimal brand spend is the £400 ceiling in every state, so "always spend the maximum" would be the right answer and the diminishing-returns feedback could never fire. At β = 3 the optimum is interior, near £167 in round 1 |
| Cerchio's entry rate κ is 0.04, not the suggested 0.06 | 0.04 lands round 8's optimal profit at 10.9% of round 1, inside the required 15% ceiling, without pushing the firm into loss |
| Round 1 carries no demand shock | so that every stated opening figure is exactly right on screen: P = £17 in Quadrato, a = 340 in Cerchio, the kink at £22, q = 300 − 6P in Uno. The ±3% shock runs from round 2 |
| A two-month price war follows a cartel bust | with no chill after a bust, accepting the cartel returned 101% of the legal path, just outside the required 85-100% band. With it, 93% |
| Quadrato's clearing price is floored to whole pennies | so that "match the market" is exactly the market price and never a rounding penny above it |
| The ranking item in the Diagnosis asks for month 8 prices, lowest first, rather than consumer surplus | consumer surplus is not comparable across the four demand curves at the firm level; price order is, and the explanation makes the link to surplus |
| The ghost leaderboard compares decision scores only | the bots do not sit the diagnosis and never spend a lens charge |
| Export/import JSON, copy as text, an A4 print stylesheet and an optional name field were added | required by the repository's own build conventions in `CLAUDE.md` |

No invented study findings, statistics, citations or facts about real places
appear anywhere in the tool, so there are no `PLACEHOLDER:` strings to report.
The market news lines are fictional in-game narration about a fictional pizza
firm. The two statements of law are accurate: cartel price fixing is prohibited
by Chapter I of the Competition Act 1998 and is a criminal offence under
section 188 of the Enterprise Act 2002, and UK competition fines are capped at
10% of worldwide turnover.
