# SLIDES.md

Blueprint for building a projection deck in this repository.

`theory-of-change.html` is the reference implementation. Read this document before building another deck, and read that file alongside it when a pattern is unclear.

This document covers only what is specific to decks. Everything in `CLAUDE.md` still applies: one self-contained HTML file, inline CSS and JS, no build step, no network calls, UK English, the eight-characteristic palette, zero border-radius, decorative geometry on every page.

---

## 1. What a deck is for

A deck is projected on a large screen in front of a room. That single fact drives every decision below and separates a deck from the other tools in this repository, which are used by small groups on one laptop.

Three consequences:

- **Text must be legible from the back of a room.** Body text lands at roughly 35px on a 1080p screen. That is about 28pt in PowerPoint terms.
- **The screen is the canvas.** A centred 780px column on a 1920px projector wastes 60% of the surface. Every slide fills the frame.
- **Nothing scrolls.** A presenter cannot scroll mid-sentence. Every slide fits its frame in every state it can reach, or it is not finished.

---

## 2. The stage model

This is the core mechanism. Get it right and everything else follows.

A deck is a fixed 16:9 stage centred in the viewport. The root font-size **is** the slide unit, so `1rem` equals 1% of stage width:

```css
html { font-size: min(1vw, 1.7778vh); }

.deck  { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; }
.stage { position: relative; width: 100rem; height: 56.25rem; background: var(--bg); overflow: hidden; }
body   { background: var(--text); overflow: hidden; }
```

`min(1vw, 1.7778vh)` is the larger of the two constraints that keeps a 16:9 box inside the viewport. The stage is then exactly `100rem` wide and `56.25rem` tall by definition, whatever the display.

**Express every dimension in rem.** Font sizes, padding, gaps, border widths, decorative shape sizes, shadow offsets. The entire composition then scales as one piece, and a layout verified at 1920x1080 is automatically correct at 1280x720 and on a 4K projector.

The body background is `--text` (dark brown), not `--bg`. On a projector at exactly 16:9 you never see it. On a 16:10 display you get slim dark letterbox bars, which read as intentional.

**Do not use `clamp()` or viewport units inside the stage.** They break the single-scale property. The stage already handles responsiveness.

---

## 3. Type scale

All values in stage units. The pixel column is at 1920x1080, where 1rem = 19.2px.

| Role | Size | At 1080p | Weight | Notes |
|---|---|---|---|---|
| Title `h1` | `7rem` | 134px | 800 | Title slide only, line-height `0.94` |
| Heading `h2` | `3.8rem` | 73px | 800 | Slide headings, line-height `1.02` |
| Sub-heading `h3` | `2rem` | 38px | 800 | Uppercase, `letter-spacing: 0.08em` |
| Lede | `2.1rem` | 40px | 400 | Title-slide standfirst, `--text-muted` |
| Body `p` | `1.85rem` | 35px | 400 | line-height `1.5` |
| `.small` | `1.55rem` | 30px | 400 | Dense slides, supporting paragraphs |
| Card body | `1.3` to `1.5rem` | 25 to 29px | 400 | Inside a three-column grid |
| `.micro` | `1.25rem` | 24px | 400 | Footnotes, captions |
| Eyebrow | `1.3rem` | 25px | 700 | Uppercase, `letter-spacing: 0.2em` |
| Chrome | `1.1rem` | 21px | 700 | Nav buttons, slide counter |

**`1.25rem` (24px) is the floor for anything a student must read.** Below that, treat it as chrome.

Prefer dropping to `.small` on a dense slide over shrinking the heading. A slide that needs body text below `1.3rem` has too much content and should be split.

---

## 4. Slide anatomy

Every slide has the same skeleton:

```html
<section class="slide" data-accent="var(--char-6)">
  <div class="rail"></div>
  <div class="slide-no"></div>
  <div class="slide-inner">
    <header class="s-head">
      <span class="eyebrow">Core Structure</span>
      <h2>The Causal Pathway</h2>
    </header>
    <div class="s-body"> ... </div>
  </div>
  <div class="deco ..."></div>
  <div class="deco ..."></div>
</section>
```

- **`data-accent`** names the slide's characteristic colour. JS reads it and sets `--slide-accent` on `documentElement`, which drives the rail, the head rule, the eyebrow, the progress bar and any component that inherits it. One attribute recolours the whole slide.
- **`.rail`** is a `1.9rem` full-height bar down the left edge in the slide accent. It is the deck's strongest recurring device: section identity, a hard left margin, and a Bauhaus colour block in one element.
- **`.slide-inner`** carries `padding: 3.8rem 5.5rem 4.6rem 7rem` and is a column flexbox. The extra left padding clears the rail. The larger bottom padding reserves space beneath the content for the presenter chrome.
- **`.s-head::before`** draws a `13rem × 0.9rem` accent bar above the eyebrow. Consistent across every slide, so the eye learns where a slide starts.
- **`.s-body`** is `flex: 1; min-height: 0` so it takes the remaining height and its children can be measured against the frame.
- **`.slide-no`** is numbered by JS (`01 / 13`), so slides can be reordered without editing markup.

**Cycle accents so adjacent slides contrast.** The reference deck runs purple, burnt orange, gold, red, magenta, lighter purple, red, magenta, brown, orange, burnt orange, purple, gold. Never two adjacent slides in the same hue.

---

## 5. Layout vocabulary

A small set of grid helpers covers almost everything:

```css
.grid   { display: grid; gap: 2.6rem; }
.g-2    { grid-template-columns: 1fr 1fr; }
.g-3    { grid-template-columns: repeat(3, 1fr); }
.g-7-5  { grid-template-columns: 7fr 5fr; }   /* text-dominant split */
.g-5-7  { grid-template-columns: 5fr 7fr; }   /* panel-dominant split */
.g-6-6  { grid-template-columns: 1fr 1fr; }
.stack > * + * { margin-top: 1.2rem; }
.center-y { align-content: center; }
```

Rules of thumb for a wide frame:

- **Prose belongs in two columns, never one.** A single column of body text across 87.5rem gives 120-character lines, which are unreadable. Split the paragraphs or set a `max-width` of about `84rem` and accept two or three lines.
- **Three columns is the natural card grid.** At `87.5rem` content width, a third is about `28rem`, which takes card body text at `1.3` to `1.5rem` comfortably.
- **Asymmetric splits beat even ones** when one side is a quote, a diagram or a photograph. `7fr 5fr` and `5fr 7fr` are the house ratios.
- **Fill vertical space rather than letting content float at the top.** If a slide has spare height, enlarge the type or the card padding until the composition reaches the bottom padding. A half-empty frame is a design failure.

---

## 6. Slide archetypes

Eight patterns cover a teaching deck. Each is demonstrated in the reference file.

**1. Title poster.** `g-7-5`. Left: eyebrow, `h1` broken across two lines, lede. Right: a geometric composition at full opacity (solid circle, rotated square, thick ring, triangle, diagonal bar) built from absolutely positioned divs inside a `position: relative` container. This is the one place where accent shapes are foreground art rather than background texture.

**2. Sequence band.** A full-width row of solid colour blocks marking a progression, with the current step taller and a small label beneath each. Used for the describe / explain / adjudicate / intervene spine. Runs the full content width; a sequence squeezed into a column loses its meaning.

**3. Quote plus commentary.** `g-6-6` with `center-y`. Left: a `.quote-block` with a `1rem` accent left border, italic text at about `2.05rem`, an uppercase attribution, and `justify-content: center` so the quote sits centred in a full-height card. Right: a `.stack` of commentary paragraphs ending in a small solid-colour banner.

**4. Horizontal chain diagram.** The most valuable pattern for a wide frame. Four nodes in `repeat(4, 1fr)`, each a card with a thick coloured top border. Connector text sits in a second row inset so each item centres on a seam between nodes:

```css
.chain       { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.6rem; }
.chain-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.6rem;
               margin: 0 calc(12.5% + 0.2rem); padding-top: 1rem; }
```

The inset is `W/8 + g/8`. With a `1.6rem` gap that is `12.5% + 0.2rem`, which puts each connector exactly over a seam. A CSS triangle on `.chain-link::before` points up at the join.

Direction bands above and below the chain state the two readings explicitly (design runs one way, change flows the other). A chain diagram without direction labels is ambiguous.

**5. Numbered cards.** `g-3` with each card carrying a solid accent header bar containing a large faded numeral and the card name, and a neutral body below. This is the poster moment of a deck: three flat colour fields across the frame.

**6. Card grid.** `repeat(3, 1fr)` over two rows for six items. Each card gets a `0.9rem` accent left border, a name in the accent ink, and muted body text. Cycle colours so no two adjacent cards share a hue.

**7. Split with panel.** `g-5-7`. Principle text on one side, a worked example in a bordered card with an accent left border on the other. Use when one idea needs an illustration rather than a second idea.

**8. Takeaway grid.** `1fr 1fr` over three rows. Each item is a large accent numeral beside the text, with a `0.4rem` accent rule across the top. The rules align per row and read as a set of Bauhaus colour bars.

---

## 7. Interaction

A deck is not a slideshow with a quiz bolted on. Interactions exist to make the room commit to an answer before it sees one. Four patterns:

**Single-select check.** Click an option, it resolves immediately. The correct answer highlights green, a wrong pick flags red, then after 2.5s the wrong state clears and the options re-enable so the presenter can put it back to the room. Do not lock a wrong answer permanently.

**Multi-select with an explicit check.** Options toggle freely, a Check button resolves all at once and then hides itself. Use when the exercise is "how many can you find", not "which one is right".

**Independent reveals.** Three or more columns each expanding in place. Use when the items are parallel and a presenter may want several open at once. A visible "Click to reveal" hint prevents dead air.

**Select-one with a shared detail panel.** Cards select, and one panel below fills with the selection. Use when the detail is too long to sit inside a card, or when the frame cannot hold every item expanded. Reserve the panel's height with `min-height` and give it a placeholder line, so selecting a card does not make the layout jump.

**Navigation**

Keyboard is the primary interface: arrows, space, PageUp, PageDown, Home, End, and `f` for full screen. On-screen controls sit in a bordered plate in the bottom-right corner and idle out after 2.5s of no input, returning on any mouse move or keypress:

```js
['mousemove', 'keydown', 'touchstart', 'click'].forEach(function (evt) {
  document.addEventListener(evt, wake);
});
```

This is why the chrome can overlap the content safety margin without ever being seen during a presentation.

A `0.7rem` progress bar across the top of the stage takes the slide accent colour, so it recolours as the deck advances.

---

## 8. Decorative geometry at projection scale

The `CLAUDE.md` geometry rules apply, with deck-specific sizing.

- Background shapes run **`8rem` to `34rem`**. A `100px` shape that reads on a laptop disappears on a projector. Think in percentages of the frame, not pixels.
- Opacity stays at **`0.06` to `0.12`**. At projection size a shape at `0.15` competes with the text.
- Two or three shapes per slide, in contrasting hues, bleeding off at least one edge. `.deco { position: absolute; z-index: 1; pointer-events: none; }` with `.slide-inner` at `z-index: 2` and the rail at `4`.
- The stage already has `overflow: hidden`, so rotated shapes clip cleanly at the frame edge.
- Hide all decoration in print.

---

## 9. Colour, and the contrast exception

Use the eight palette values exactly as `CLAUDE.md` specifies for fills, rules, borders, card accents and decorative shapes.

**Two of them cannot be used as text on cream.** Measured against `--bg` (`#F2DFBE`):

| Colour | As text on cream | AA large (3:1) | AA normal (4.5:1) |
|---|---|---|---|
| `--char-4` gold `#D4A020` | **1.82:1** | fails | fails |
| `--char-7` orange `#CC6830` | **2.88:1** | fails | fails |
| `--char-3` burnt orange | 3.44:1 | passes | fails |
| `--char-8` lighter purple | 4.18:1 | passes | borderline |
| `--char-6` magenta | 4.39:1 | passes | borderline |
| `--char-2` red | 4.83:1 | passes | passes |
| `--char-5` brown | 4.94:1 | passes | passes |
| `--char-1` purple | 6.43:1 | passes | passes |

Gold and orange fail even the large-text threshold, and white on a gold fill is only 2.37:1. The reconciliation is two derived ink tones used **only** where those characteristics carry text:

```css
--char-4-ink: #7A5410;   /* 5.18:1 on cream */
--char-7-ink: #9E4718;   /* 4.77:1 on cream */
```

Pattern: give each component a paired custom property with a fallback, so the exception is opt-in per element and the default stays the palette colour.

```css
.sector-card .sector-name { color: var(--sector-ink, var(--sector-color)); }
```
```html
<div class="sector-card" style="--sector-color: var(--char-4); --sector-ink: var(--char-4-ink)">
```

On a **gold fill**, set the text to `var(--text)` rather than white. Dark brown on gold is 6.77:1; white on gold is 2.37:1.

Everything else keeps the palette values unchanged. Run the contrast harness in section 13 after any colour change.

---

## 10. Photographs

Decoration is geometric and never figurative. Photographs are different: they are content, used where a real case is being discussed and the image carries information the text cannot. Do not use them as background texture or ornament.

When a deck does need them:

- **Embed as base64 data URIs.** The one-file rule permits no network calls. A separate image file also breaks opening the deck from the filesystem.
- **Resize to the display box before encoding**, not after. The reference cards show a `660 × 215` banner; encoding at that aspect ratio and letting CSS `object-fit: cover` do the final fitting gives 30 to 40KB each at quality `0.72` to `0.74`. Encoding at a different aspect ratio and cropping twice wastes bytes and loses control of the framing.
- **Choose the crop deliberately.** Encode with a focus weight so the subject survives a wide crop, rather than accepting a centre crop that decapitates people.
- **Treat them in the house language:** hard edges, no radius, a `0.4rem` rule beneath in the card's characteristic colour.
- **Alt text on every image**, describing what is visible without asserting facts the photograph does not show.
- **Keep them in print** with `print-color-adjust: exact`.

If no image tooling is installed, Chromium via Playwright will resize and re-encode through a canvas. See `docs` in section 13 for the harness pattern.

---

## 11. Prose

A deck is read at a glance from twelve metres away. Two rules beyond normal UK English:

**No dashes as punctuation.** Not em dashes, not en dashes, not spaced hyphens. Rewrite the sentence with a colon, a comma, brackets or a full stop. Swapping one dash character for another is not a fix. En dashes in numeric ranges go too; use a plain hyphen (`weeks 9-14`).

**No "it is not X, it is Y".** This construction and its variants ("not a course requirement, a transferable skill"; "hope, not logic") read as filler. State the positive claim directly:

| Instead of | Write |
|---|---|
| "ToC is not an academic exercise. It is standard professional practice." | "ToC is standard professional practice." |
| "is not preamble, it is the foundation" | "builds the foundation" |
| "the link is hope, not logic" | "the link is only hope" |
| "The verb sequence is not arbitrary. It is the structure that..." | "The verb sequence is the structure that..." |

The exception is where the contrast **is** the content: a quiz option whose meaning depends on the distinction, feedback explaining why a wrong answer is wrong, or a definitional claim like backward versus forward mapping. There, keep the meaning and use "rather than".

Never invent study findings, statistics, citations or facts about real places. Content added as a placeholder is prefixed `PLACEHOLDER:` and reported.

---

## 12. Print, narrow screens and motion

**Print.** One slide per A4 page:

```css
@media print {
  html { font-size: 8.6pt; }
  .deck { position: static; display: block; }
  .stage { width: auto; height: auto; background: #fff; overflow: visible; }
  .slide { position: static; display: block !important; page-break-after: always; animation: none; }
  .slide-inner { height: auto; padding: 3rem 3rem 3rem 5rem; }
  .progress-track, .deck-chrome, .deco { display: none !important; }
}
```

Because every dimension is in rem, setting `html { font-size: 8.6pt }` rescales the whole deck to the page in one line. Reveal-style content is forced visible; select-one detail panels are hidden, since only one could ever print. Wide diagrams need a print-specific column count; a four-column chain becomes two columns on A4. Keep colour with `print-color-adjust: exact` on every filled element.

**Narrow and portrait.** Below `860px` or above square, the stage becomes a scrolling single-column document with a fixed bottom nav bar:

```css
@media screen and (max-width: 860px), screen and (max-aspect-ratio: 1/1) {
  html { font-size: max(3.1vw, 9px); }
  .deck { position: static; display: block; }
  .stage { width: 100%; height: auto; min-height: 100vh; padding-bottom: 8rem; }
  .slide { position: static; }
  ...
}
```

**The `screen and` prefix is load-bearing.** A bare `(max-aspect-ratio: 1/1)` also matches the A4 print viewport, which silently gives printed handouts the mobile layout. This bug shipped once in this repository; check for it.

Every multi-column grid collapses to `1fr` here, and touch targets go to at least 44px. Verify at 360px.

**Motion.** Honour `prefers-reduced-motion: reduce` by flattening all animation and transition durations to `0.001ms`.

---

## 13. Verification

A deck cannot be signed off by looking at it. Four harnesses, all headless Chromium via the preinstalled Playwright at `/opt/node22/lib/node_modules/playwright`. Run them after every change, not once at the end.

**Fit.** The single most important check. For each slide, measure the lowest point of any element in `.s-body` against the bottom of the content box. A positive number is content intruding into the bottom padding; anything past the padding is clipped.

```js
const r = await page.evaluate(() => {
  const s = document.querySelector('.slide.active');
  const inner = s.querySelector('.slide-inner');
  const pad = parseFloat(getComputedStyle(inner).paddingBottom);
  const limit = inner.getBoundingClientRect().bottom - pad;
  let m = 0;
  s.querySelector('.s-body').querySelectorAll('*').forEach(el => {
    const b = el.getBoundingClientRect();
    if (b.height > 0 && b.bottom > m) m = b.bottom;
  });
  return Math.round(m - limit);
});
```

Run at 1920x1080, 1440x900 and 1280x720. Because everything is in stage units the three should agree proportionally; if they do not, something is not in rem.

**Interactive states.** Fit must hold in every state a slide can reach, not just its initial one. Drive each interaction, then measure: answer the single-select, check the multi-select, open every reveal, select each card in turn. Feedback panels and expanded reveals are where decks overflow.

**Contrast.** Walk every text node on every slide, resolve its computed colour against the nearest non-transparent ancestor background, and apply the WCAG AA threshold for its size and weight (3:1 at 24px or 18.66px bold, otherwise 4.5:1). This is what surfaced the gold and orange failures in section 9. It also catches decorative glyphs such as disclosure arrows.

**Print.** Emulate print media, measure each slide's height against the A4 content box (about 1048px at 10mm margins), and render a PDF to confirm the page count equals the slide count.

Then screenshot every slide and look at it. The harnesses prove nothing is broken; only your eye tells you whether the composition is any good.

Finally, run the repository suite: serve the directory with a correct `Content-Type: text/html` header and open `test.html`. All tests must pass.

---

## 14. Build order

1. Write the content first, as plain prose. Decide the slide count and the argument.
2. Build the stage, the type scale and the slide skeleton. Verify a single slide fits.
3. Assign an accent colour per slide, cycling for contrast.
4. Lay out each slide against the archetypes in section 6. Measure fit as you go, not at the end.
5. Add interactions. Measure fit again in every state.
6. Add decorative geometry, sized in stage units.
7. Run the contrast harness. Apply ink tones where needed.
8. Add the print and narrow blocks. Confirm the page count and 360px.
9. Sweep the prose per section 11.
10. Screenshot every slide and judge the composition.
11. Add a card in `index.html` inside `.activity-grid`, and a line in the `CLAUDE.md` Files section.

---

## 15. Common failures

| Symptom | Cause |
|---|---|
| Content clipped at the bottom on a projector | A slide was never measured in its expanded state |
| Layout correct at 1920 but wrong at 1280 | A dimension in `px`, `vw` or `clamp()` instead of `rem` |
| Printed handout uses the mobile layout | Narrow media query missing the `screen and` prefix |
| Gold or orange labels wash out on screen | Palette colour used as text; needs the ink tone |
| Page reads as "beige with text" from the back | Too few accent fills; add colour blocks, not tints |
| Presenter controls sitting on top of the content | Idle-hide not wired, or the slide genuinely overflows |
| Diagram unreadable at 19 characters per line | Too many columns; reduce the count or move connectors to their own row |
| A slide needs body text below `1.3rem` | Too much content; split the slide |
