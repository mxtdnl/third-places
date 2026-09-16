# Third Places

Interactive teaching tools for Ray Oldenburg's third-place theory. Static HTML files with inline JavaScript — no build step, no dependencies.

## Files

- `third-place-decoder.html` — Characteristic-matching quiz (Activity 1)
- `third-place-lab.html` — Multi-phase classroom lab (Activity 2): case analysis, stress tests, synthesis
- `third-place-builder.html` — Resource-management simulation (Activity 3): build a third place over eight seasons under money, attention and ownership constraints. Design notes in `spec.md`
- `third-place-content.md` — Source content and curriculum notes
- `spec.md` — Mechanics, tuning values and design assumptions for the builder
- `test.html` — Test suite (81 tests) covering data integrity, pure functions, HTML generators, and encoding

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

All three tools share a warm, angular, Bauhaus-inspired visual language. Colors are defined as CSS custom properties on `:root`. Follow these values exactly when modifying or adding UI.

### Themes

Two fixed themes — no `prefers-color-scheme` toggle:

- **Light** (Decoder, Builder): warm cream bg (`#F2DFBE`), dark brown text (`#2A1F18`)
- **Dark** (Lab): near-black bg (`#1A1510`), cream text (`#F2DFBE`) — an inversion of light

### Color Palette (CSS custom properties)

**Surface & text (light theme — Decoder, Builder):**

| Variable | Hex | Usage |
|---|---|---|
| `--bg` | `#F2DFBE` | Page background |
| `--bg-card` | `#FFFAF2` | Card / panel background |
| `--bg-deep` | `#E8D2A8` | Inset tracks, deeper surfaces (Builder) |
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

### Typography

- **Font stack:** `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Base size:** `16px` (Decoder, Builder), `20px` (Lab)
- **Line-height:** `1.5`–`1.6` body, `1.05`–`1.25` headings
- **h1:** `clamp(1.8rem, 4vw, 3rem)` to `clamp(2.2rem, 6vw, 4rem)`, weight `800`
- **h2:** `clamp(1.5rem, 3vw, 2.1rem)`, weight `800`
- **Body:** `0.95rem`–`1.05rem`
- **Labels / eyebrows:** `0.68rem`–`0.85rem`, weight `600`–`700`, `letter-spacing: 0.08em`–`0.2em`, `text-transform: uppercase`
- **Uppercase is used pervasively:** buttons, headings, labels, tags, tabs, table headers

### Layout

- **Reset:** `* { box-sizing: border-box; }` — Lab and Builder also zero margin/padding
- **Max-widths:** `640px`–`720px` for content columns, `960px`–`1180px` for full app containers
- **Centering:** `margin: 0 auto`
- **Page padding:** `2rem` (Decoder, Lab), `16px` inline (Builder)
- **Grids:** `repeat(auto-fill, minmax(230px–300px, 1fr))` for card grids; named two-column layouts for dashboards

### Geometry

The design is deliberately angular — virtually no border-radius on cards, buttons, or panels. Exceptions:

| Element | Radius |
|---|---|
| Summary tier cards (Decoder) | `6px` |
| Legend swatches | `3px` |
| Progress dots, decorative circles | `50%` |
| Everything else | `0` |

### Shadows

Shadows are warm-tinted, not neutral gray:

- **Card hover:** `0 4px 12px rgba(42,31,24,0.1)` to `rgba(42,31,24,0.12)`
- **Sticky tray (Builder):** `0 -6px 18px rgba(42,31,24,0.08)`
- **Default state:** no shadow — cards rely on border alone

### Components

- **Buttons:** `var(--char-1)` (purple) bg, white text, weight `700`, uppercase, `letter-spacing: 0.12em`–`0.15em`. Hover: `var(--char-2)` (red) bg, `translateY(-2px)`. Active: `translateY(0)`. Disabled: `opacity: 0.4`, `cursor: not-allowed`. Ghost variant (Builder): transparent bg, `2px solid var(--text)`.
- **Cards:** `var(--bg-card)` bg, `2px solid var(--border)`, no radius. Left accent: `border-left: 6px solid var(--border)`. Interactive hover: `translateY(-2px)` + shadow + border-color change. States: `.correct` (green border/bg), `.incorrect` (red), `.current` (dark border, deeper bg), `.pending` (purple), `.disabled` (`opacity: 0.35`).
- **Tabs (Builder):** `display: flex; gap: 4px; border-bottom: 2px solid var(--border)`. Active: `border-bottom: 3px solid var(--text)`. Badge inside tab: `var(--char-1)` bg, white text.
- **Bar charts:** label–track–value grid row. Track: `var(--bg-deep)` or `var(--bg-surface)`, no radius. Fill: colored with characteristic hex. Animation: `transition: width 0.6s`–`0.7s` (CSS) or JS-staggered `setTimeout` at `40ms`–`80ms` per bar.
- **Progress dots (Decoder):** `28px` square, `2px solid var(--border)`, filled with characteristic color on completion.
- **Chips (Builder):** `0.68rem`, weight `700`, `padding: 2px 7px`, `1.5px solid` border. Color-coded: `.up` (green), `.down` (red), `.warn` (brown, dashed).
- **Feedback boxes:** `border-left: 5px solid` (green for correct, amber for hint), matching light background, `padding: 1.25rem 1.5rem`.

### Animations

- **Screen transitions:** `opacity 0.4s ease` (Decoder), `opacity 0.15s ease` (Lab)
- **Question transitions (Decoder):** slide-left exit (`translateX(-16px)`), slide-right enter (`translateX(16px)`), `0.25s ease`, timed with `setTimeout(280)`
- **Card/button hover:** `translateY(-2px)`, `0.15s ease`
- **Feedback reveals:** `opacity 0` + `translateY(8px)` to visible, `0.3s ease`
- **Bar fills:** width from 0, staggered by index or via CSS transition
- **Causal chain steps (Lab):** `max-height` + `opacity` + `transform`, `0.4s ease`, revealed sequentially by click

### Responsive

- **Decoder `@media (max-width: 600px)`:** grids collapse to single column, evolving exercise goes vertical
- **Lab `@media (max-width: 800px)`:** investigate layout to single column, bar labels narrow, summary cards shrink
- **Builder `@media (max-width: 860px)`:** board to single column, result grids stack; `(max-width: 520px)`: dash-bars to single column

### Print

`@media print`: hide interactive controls (buttons, navigation), force white background, remove shadows. Use `print-color-adjust: exact` on colored elements (bar fills, dots, status tags, lessons) to preserve color.

### Naming Conventions

- Hyphenated compound names: `bar-row`, `bar-fill`, `char-grid`, `char-tile`
- Component prefixes: `ev-` (evolving), `char-` (characteristic), `bar-` (bar chart), `pred-` (prediction), `tl-` (timeline), `vote-comp-` (vote comparison)
- State classes: `.active`, `.visible`, `.filled`, `.current`, `.selected`, `.correct`, `.incorrect`, `.disabled`, `.exiting`, `.entering`, `.expanded`, `.used`, `.pending`, `.blocked`
- Layout suffixes: `-grid`, `-layout`, `-wrap`, `-panel`, `-section`
- Visual marker suffixes: `-dot`, `-pip`, `-swatch`, `-chip`, `-badge`
- Utility classes: `.quiet` (muted), `.alert` (error), `.neg` (red), `.pos` (green), `.lede` (intro paragraph), `.eyebrow` (small uppercase label)
- Data attributes for JS: `data-action`, `data-val`, `data-ci`, `data-status`, `data-bar`, `data-target`, `data-lever`, `data-opt`, `data-scenario`
