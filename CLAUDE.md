# Third Places

Interactive teaching tools for Ray Oldenburg's third-place theory. Static HTML files with inline JavaScript — no build step, no dependencies.

## Files

- `index.html` — Landing page with links to every activity
- `third-place-decoder.html` — Characteristic-matching quiz (Activity 1)
- `third-place-lab.html` — Multi-phase classroom lab (Activity 2): case analysis, stress tests, synthesis
- `third-place-builder.html` — Resource-management simulation (Activity 3): build a third place over eight seasons under money, attention and ownership constraints. Design notes in `spec.md`
- `third-place-portrait.html` — Visual portrait of a completed third place (Activity 4)
- `third-place-recall.html` — Recall reconstruction exercise for the eight characteristics (Activity 5)
- `evidence-compass.html` — Evidence evaluation across disciplinary lenses (Activity 6)
- `theory-of-change.html` — Interactive slide deck on Theory of Change methodology (Activity 7)
- `third-place-content.md` — Source content and curriculum notes
- `spec.md` — Mechanics, tuning values and design assumptions for the builder
- `test.html` — Test suite (81 tests) covering data integrity, pure functions, HTML generators, and encoding

When adding a new activity HTML file, also add a card for it in `index.html` (inside the `.activity-grid` div) and list it in this Files section.

## Testing

After any change, open `test.html` in a browser (serve via any local HTTP server — the tests use XHR to load the other HTML files). All tests must pass.

To run headless:

```sh
node -e "const h=require('http'),f=require('fs'),p=require('path');h.createServer((q,r)=>{try{r.end(f.readFileSync(p.join('.',q.url==='/'?'/test.html':q.url)))}catch{r.writeHead(404);r.end()}}).listen(8080)" &
npx playwright test --headed  # or open http://localhost:8080/test.html
```

## Conventions

- All HTML files must declare `<meta charset="utf-8">` before any content
- JavaScript strings use straight quotes (`'` or `"`), never Unicode smart/curly quotes
- No external dependencies — everything is inline

## Visual Style

A warm, hard-edged Bauhaus visual language across all activities. Color is structural, not decorative — accent hues from the eight-characteristic palette mark sections, signal state and create rhythm the way a Bauhaus poster uses a red square or a yellow triangle. Neutral surfaces stay quiet so that every accent reads as deliberate. Colors are defined as CSS custom properties on `:root`. Follow these values exactly when modifying or adding UI.

### Design Principles

1. **Color is architecture.** The eight characteristic colors are the primary visual vocabulary. Use them to identify sections, mark boundaries, signal relationships and create visual weight — not merely to label data. A page should feel color-rich from a distance.
2. **Geometry over ornament.** Hard edges, solid color fields, thick rule lines. No gradients, no rounded-corner softness, no decorative illustration. Decoration comes from the arrangement of coloured rectangles and typographic scale.
3. **Asymmetric balance.** Compositions are deliberately off-centre and weighted. A heavy coloured block on the left balanced by lighter type on the right. Avoid centred symmetry outside of narrow content columns.
4. **Contrast creates hierarchy.** Use bold colour-on-neutral and neutral-on-colour pairings. A `--char-N` background with white or `--text` foreground is always preferred over a muted tint when emphasis is needed.
5. **Economy.** Every element earns its space. If a colour block, rule or accent does not help the reader orient, remove it. Density is good; clutter is not.

### Themes

Two fixed themes — no `prefers-color-scheme` toggle:

- **Light** (Decoder, Builder, Portrait, Recall, Compass, Index): warm cream bg (`#F2DFBE`), dark brown text (`#2A1F18`)
- **Dark** (Lab): near-black bg (`#1A1510`), cream text (`#F2DFBE`) — an inversion of light

### Color Palette (CSS custom properties)

**Surface & text (light theme):**

| Variable | Hex | Usage |
|---|---|---|
| `--bg` | `#F2DFBE` | Page background |
| `--bg-card` | `#FFFAF2` | Card / panel background |
| `--bg-deep` | `#E8D2A8` | Inset tracks, deeper surfaces |
| `--text` | `#2A1F18` | Headings, primary text |
| `--text-muted` | `#6A5A48` | Secondary / supporting text |
| `--border` | `#D8C8A8` | Borders, dividers |

**Surface & text (dark theme — Lab):**

| Variable | Hex | Usage |
|---|---|---|
| `--bg` | `#1A1510` | Page background |
| `--bg-card` | `#2E241C` | Card background |
| `--bg-surface` | `#241C14` | Mid-tone surface, bar tracks |
| `--bg-elevated` | `#382E24` | Elevated panels |
| `--text` | `#F2DFBE` | Primary text |
| `--text-muted` | `#A89878` | Secondary text |
| `--text-dim` | `#6A5A48` | Tertiary / disabled text |
| `--border` | `#3A3228` | Borders |

**Eight characteristic colors (identical across all themes):**

| Variable | Hex | Characteristic |
|---|---|---|
| `--char-1` | `#5C3A96` | Neutral Ground (purple) |
| `--char-2` | `#B52838` | The Leveler (red) |
| `--char-3` | `#C85218` | Conversation is the Main Activity (burnt orange) |
| `--char-4` | `#D4A020` | Accessibility and Accommodation (gold) |
| `--char-5` | `#7A5828` | The Regulars (brown) |
| `--char-6` | `#B83068` | A Low Profile (magenta) |
| `--char-7` | `#CC6830` | The Mood is Playful (orange) |
| `--char-8` | `#7E58A8` | A Home Away from Home (lighter purple) |

**Feedback colors:**

| Token | Light (Decoder/Builder) | Dark (Lab) |
|---|---|---|
| correct / present | `#2A7A42` / bg `#E6F4EA` | `#2A8A4A` / bg `rgba(42,138,74,0.15)` |
| incorrect / absent | `#B82828` / bg `#FDEEEE` | `#C83838` / bg `rgba(200,56,56,0.12)` |
| ambiguous | `#B98A10` / bg `#FFF3D6` | `#D4A020` / bg `rgba(212,160,32,0.12)` |

In the dark theme, feedback backgrounds use RGBA for transparency over dark surfaces; in the light theme they use solid hex.

### Accent Color Usage

The eight `--char-N` colours are the system's primary expressive tool. Use them generously and structurally:

- **Section identity.** Each major section or phase of an activity should carry a characteristic colour as its accent — via a thick left border, a coloured top rule, or a coloured eyebrow label. When sections correspond to characteristics, use that characteristic's colour. Otherwise, cycle through the palette so adjacent sections contrast.
- **Card left accents.** Every card that belongs to a group (an activity, a characteristic, a phase) gets a `border-left: 6px solid var(--char-N)` in its group's colour, with the eyebrow label set to the same `color: var(--char-N)`.
- **Coloured rule lines.** Use `<hr>` or `::before`/`::after` pseudo-elements as thick (`3px`–`6px`) horizontal rules in accent colours to separate page regions. These act as Bauhaus colour bars — compositional elements, not mere dividers.
- **Solid-colour headers and banners.** For high-emphasis moments (phase introductions, score summaries, completion states), use a full-bleed or full-width block with a `--char-N` background and white text. The colour field itself is the visual event.
- **Active/selected states.** When a card, tab or option becomes active, its border or background should shift to an accent colour — never just darken or lighten a neutral.
- **Data visualisation.** Bar fills, dots, swatches and chart segments always use the characteristic colour for the data they represent. Never substitute a generic colour when a `--char-N` mapping exists.
- **Colour pairing.** Avoid placing two adjacent accent elements in the same hue. When cycling, prefer sequences that maximise contrast: purple → gold → red → orange, not purple → lighter purple → brown.
- **Tinted backgrounds (light theme).** For secondary emphasis, use an accent colour at `0.08`–`0.12` opacity over `--bg-card`: e.g. `rgba(92,58,150,0.08)` for a purple-tinted panel. Reserve for tooltips, expanded detail areas, or highlight states — not every card.
- **Tinted backgrounds (dark theme).** Same principle at `0.10`–`0.15` opacity over `--bg-card`.
- **Do not tint neutrals.** `--bg`, `--bg-card`, `--bg-deep` stay exactly as specified. Accent colours appear on top of neutrals, never mixed into them.

### Typography

- **Font stack:** `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Base size:** `16px` (Decoder, Builder), `20px` (Lab)
- **Line-height:** `1.5`–`1.6` body, `1.05`–`1.25` headings
- **h1:** `clamp(1.8rem, 4vw, 3rem)` to `clamp(2.2rem, 6vw, 4rem)`, weight `800`
- **h2:** `clamp(1.5rem, 3vw, 2.1rem)`, weight `800`
- **Body:** `0.95rem`–`1.05rem`
- **Labels / eyebrows:** `0.68rem`–`0.85rem`, weight `600`–`700`, `letter-spacing: 0.08em`–`0.2em`, `text-transform: uppercase`
- **Uppercase is used pervasively:** buttons, headings, labels, tags, tabs, table headers — this is part of the Bauhaus character. When adding new UI, default to uppercase for any non-body text element.
- **Coloured type.** Eyebrow labels and section subtitles may use `color: var(--char-N)` to tie them to their section's accent. Headings stay `--text` unless they sit on a coloured background (then white).

### Layout

- **Reset:** `* { box-sizing: border-box; }` — Lab and Builder also zero margin/padding
- **Max-widths:** `640px`–`720px` for content columns, `960px`–`1180px` for full app containers
- **Centering:** `margin: 0 auto`
- **Page padding:** `2rem` (Decoder, Lab), `16px` inline (Builder)
- **Grids:** `repeat(auto-fill, minmax(230px–300px, 1fr))` for card grids; named two-column layouts for dashboards
- **Compositional asymmetry.** When laying out a header area or hero block, prefer an offset arrangement — e.g. a coloured accent block or thick rule on one side, with text aligned to the other. Full-centre compositions are reserved for narrow single-column flows.

### Geometry

The design is deliberately angular — zero border-radius on cards, buttons and panels. This is non-negotiable for the Bauhaus identity. Exceptions:

| Element | Radius |
|---|---|
| Legend swatches | `3px` |
| Progress dots, decorative circles | `50%` |
| Everything else | `0` |

Rectangles and squares are the primary shapes. Use thick borders (`2px`–`6px`) and solid colour fills to create geometric presence. Thin `1px` borders read as incidental; default to `2px` minimum.

### Shadows

Shadows are warm-tinted, not neutral gray. Used sparingly — the design relies on colour and border for depth, not shadow.

- **Card hover:** `0 4px 12px rgba(42,31,24,0.1)` to `rgba(42,31,24,0.12)`
- **Sticky tray (Builder):** `0 -6px 18px rgba(42,31,24,0.08)`
- **Default state:** no shadow — cards rely on border and accent colour alone

### Components

- **Buttons:** `var(--char-1)` (purple) bg, white text, weight `700`, uppercase, `letter-spacing: 0.12em`–`0.15em`. Hover: `var(--char-2)` (red) bg, `translateY(-2px)`. Active: `translateY(0)`. Disabled: `opacity: 0.4`, `cursor: not-allowed`. Ghost variant (Builder): transparent bg, `2px solid var(--text)`. Secondary actions may use other `--char-N` backgrounds (e.g. `--char-3` for a "next phase" button) — always with white text.
- **Cards:** `var(--bg-card)` bg, `2px solid var(--border)`, no radius. Left accent: `border-left: 6px solid var(--char-N)` — always use a characteristic colour, not `--border`, when the card has a group identity. Interactive hover: `translateY(-2px)` + shadow + border-color shifts to the card's accent colour. States: `.correct` (green border/bg), `.incorrect` (red), `.current` (accent-colour border, deeper bg), `.pending` (purple), `.disabled` (`opacity: 0.35`).
- **Section dividers.** Horizontal rules between major sections use `border-top: 4px solid var(--char-N)` — coloured, not neutral. Alternate colours between consecutive dividers.
- **Tabs (Builder):** `display: flex; gap: 4px; border-bottom: 2px solid var(--border)`. Active: `border-bottom: 3px solid var(--char-N)` in the tab's accent colour, with the label in the same colour. Badge inside tab: `var(--char-1)` bg, white text.
- **Bar charts:** label–track–value grid row. Track: `var(--bg-deep)` or `var(--bg-surface)`, no radius. Fill: colored with characteristic hex. Animation: `transition: width 0.6s`–`0.7s` (CSS) or JS-staggered `setTimeout` at `40ms`–`80ms` per bar.
- **Progress dots (Decoder):** `28px` square, `2px solid var(--border)`, filled with characteristic color on completion.
- **Chips (Builder):** `0.68rem`, weight `700`, `padding: 2px 7px`, `1.5px solid` border. Color-coded: `.up` (green), `.down` (red), `.warn` (brown, dashed).
- **Feedback boxes:** `border-left: 5px solid` (green for correct, amber for hint), matching light background, `padding: 1.25rem 1.5rem`.
- **Colour-block banners.** For phase transitions, completion screens or score reveals: a full-width rectangle with `var(--char-N)` background, `padding: 1.5rem 2rem`, white text, uppercase heading. These are the Bauhaus "poster moments" — bold, flat, geometric.
- **Accent pips and markers.** Small coloured squares (`8px`–`12px`, no radius) used inline to mark list items, legend entries or step indicators. Always solid `--char-N` fill.

### Animations

- **Screen transitions:** `opacity 0.4s ease` (Decoder), `opacity 0.15s ease` (Lab)
- **Question transitions (Decoder):** slide-left exit (`translateX(-16px)`), slide-right enter (`translateX(16px)`), `0.25s ease`, timed with `setTimeout(280)`
- **Card/button hover:** `translateY(-2px)`, `0.15s ease`
- **Feedback reveals:** `opacity 0` + `translateY(8px)` to visible, `0.3s ease`
- **Bar fills:** width from 0, staggered by index or via CSS transition
- **Causal chain steps (Lab):** `max-height` + `opacity` + `transform`, `0.4s ease`, revealed sequentially by click
- **Colour transitions.** When an element's accent colour changes (e.g. on selection or phase change), transition `border-color`, `background-color` or `color` over `0.2s ease`. Colour shifts should feel snappy, not sluggish.

### Responsive

- **Decoder `@media (max-width: 600px)`:** grids collapse to single column, evolving exercise goes vertical
- **Lab `@media (max-width: 800px)`:** investigate layout to single column, bar labels narrow, summary cards shrink
- **Builder `@media (max-width: 860px)`:** board to single column, result grids stack; `(max-width: 520px)`: dash-bars to single column
- Coloured rule lines and accent borders remain at full width on small screens — they anchor the layout when grid structure collapses.

### Print

`@media print`: hide interactive controls (buttons, navigation), force white background, remove shadows. Use `print-color-adjust: exact` on colored elements (bar fills, dots, status tags, lessons, accent borders, colour-block banners) to preserve color.

### Naming Conventions

- Hyphenated compound names: `bar-row`, `bar-fill`, `char-grid`, `char-tile`
- Component prefixes: `ev-` (evolving), `char-` (characteristic), `bar-` (bar chart), `pred-` (prediction), `tl-` (timeline), `vote-comp-` (vote comparison)
- State classes: `.active`, `.visible`, `.filled`, `.current`, `.selected`, `.correct`, `.incorrect`, `.disabled`, `.exiting`, `.entering`, `.expanded`, `.used`, `.pending`, `.blocked`
- Layout suffixes: `-grid`, `-layout`, `-wrap`, `-panel`, `-section`
- Visual marker suffixes: `-dot`, `-pip`, `-swatch`, `-chip`, `-badge`
- Utility classes: `.quiet` (muted), `.alert` (error), `.neg` (red), `.pos` (green), `.lede` (intro paragraph), `.eyebrow` (small uppercase label)
- Data attributes for JS: `data-action`, `data-val`, `data-ci`, `data-status`, `data-bar`, `data-target`, `data-lever`, `data-opt`, `data-scenario`
