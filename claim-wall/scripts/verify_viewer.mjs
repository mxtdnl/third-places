// Browser checks for the claim-wall viewer (index.html) against the Session 3
// done-when criteria in claim-wall-spec.md. Read-only: it never edits files.
//
// Usage, from claim-wall/:
//   node scripts/verify_viewer.mjs [--shots <dir>]
// Needs Playwright with a Chromium build. If `playwright` is not resolvable
// from here, set PLAYWRIGHT_MODULE to its path (e.g. a global node_modules).
//
// What it checks, at every width in WIDTHS and in both instructor and student view:
//   - no console errors, warnings or page errors; no horizontal page scroll
//   - grid: every entry in its claim x lens cell, card text verbatim,
//     sub-scores and flags equal to the JSON (instructor) or absent (student)
//   - Oldenburg coverage: every characteristic x claim cell equals the JSON
//   - entry detail for every entry: card text, caveat, all codes with quoted
//     rationales, testable implication, Bodo scope question
//   - claim synthesis panels equal to the JSON (instructor), absent (student)
//   - student view hides scores and synthesis and nothing else listed in spec 5
//   - text contrast (WCAG AA) and touch-target size of every visible control
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(process.env.PLAYWRIGHT_MODULE || '/opt/node-tools/node_modules/playwright'); }

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const DATA = JSON.parse(readFileSync(path.join(root, 'analysis/S1.json'), 'utf8'));
const URL0 = pathToFileURL(path.join(root, 'index.html')).href;
const shotsIdx = process.argv.indexOf('--shots');
const SHOTS = shotsIdx > -1 ? process.argv[shotsIdx + 1] : null;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const WIDTHS = [
  { name: 'mobile-360', width: 360, height: 740, isMobile: true, hasTouch: true },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 }
];
const CRITS = ['claim_fit', 'mechanism', 'explains_change', 'lens_fit', 'testability', 'scope'];

let failures = 0;
let checks = 0;
const failList = [];
function ok(cond, msg) {
  checks++;
  if (!cond) { failures++; failList.push(msg); }
}

// Strings that only the instructor view may show.
const instructorOnly = [];
for (const e of DATA.entries) {
  for (const c of CRITS) instructorOnly.push(['strength rationale ' + e.entry_id + ' ' + c, e.strength[c].rationale.text]);
  const nae = e.strength.claim_fit.not_an_explanation;
  if (nae) instructorOnly.push(['nae rationale ' + e.entry_id, nae.rationale.text]);
  if (e.analyst_note) instructorOnly.push(['analyst note ' + e.entry_id, e.analyst_note]);
  if (e.strength.testability.testable_implication === null) instructorOnly.push(['null-implication note ' + e.entry_id, e.strength.testability.implication_note]);
}
for (const c of DATA.claim_synthesis) {
  for (const k of [...c.candidates, ...c.imported_candidates]) instructorOnly.push(['why ' + k.entry_id, k.why]);
  for (const k of c.clusters) instructorOnly.push(['cluster ' + k.cluster_id, k.shared_element]);
  for (const k of c.convergence) instructorOnly.push(['convergence', k.shared_mechanism]);
  for (const k of c.tensions) instructorOnly.push(['tension', k.description]);
  if (c.gaps.notes) instructorOnly.push(['gaps notes ' + c.claim_no, c.gaps.notes]);
}
if (DATA.snapshot_gaps.notes) instructorOnly.push(['snapshot gaps notes', DATA.snapshot_gaps.notes]);

// Guard: a student-visible string must not coincide with an instructor-only one.
const studentVisible = new Set();
for (const e of DATA.entries) {
  const o = e.oldenburg;
  o.characteristics.forEach((c) => studentVisible.add(c.rationale.text));
  if (o.none_rationale) studentVisible.add(o.none_rationale.text);
  o.vocabulary_flags.forEach((f) => studentVisible.add(f.rationale.text));
}
const instructorOnlyChecked = instructorOnly.filter(([, t]) => !studentVisible.has(t));

const norm = (s) => s.replace(/\s+/g, ' ').trim();

async function contrastAndTargets(page, label) {
  const res = await page.evaluate(() => {
    function parse(c) {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return [0, 0, 0, 0];
      const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
    }
    function blend(top, bottom) {
      const a = top[3];
      return [top[0] * a + bottom[0] * (1 - a), top[1] * a + bottom[1] * (1 - a), top[2] * a + bottom[2] * (1 - a), 1];
    }
    function bgOf(el) {
      const layers = [];
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
      }
      let acc = [255, 255, 255, 1];
      for (let i = layers.length - 1; i >= 0; i--) acc = blend(layers[i], acc);
      return acc;
    }
    function lum(c) {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    }
    function visible(el) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.clip === 'rect(0px, 0px, 0px, 0px)') return false;
      for (let n = el; n; n = n.parentElement) { if (getComputedStyle(n).display === 'none') return false; }
      return true;
    }
    const scope = document.querySelector('dialog[open]') || document.body;
    const bad = [];
    let n = 0;
    for (const el of scope.querySelectorAll('*')) {
      if (el.closest('.sr-only') || ['SCRIPT', 'STYLE'].includes(el.tagName)) continue;
      const hasText = [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
      if (!hasText || !visible(el)) continue;
      const cs = getComputedStyle(el);
      let fg = parse(cs.color);
      const bg = bgOf(el);
      if (fg[3] < 1) fg = blend(fg, bg);
      let op = 1;
      for (let x = el; x; x = x.parentElement) op *= Number(getComputedStyle(x).opacity);
      const L1 = lum(fg), L2 = lum(bg);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const size = parseFloat(cs.fontSize), weight = Number(cs.fontWeight) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      n++;
      if (op < 1) continue; // disabled controls (opacity 0.4) are exempt under WCAG 1.4.3
      if (ratio < need - 0.005) bad.push({ text: el.textContent.trim().slice(0, 40), cls: el.className, ratio: ratio.toFixed(2), need });
    }
    const small = [];
    for (const el of scope.querySelectorAll('button, a[href], summary, [role="tab"]')) {
      if (!visible(el) || el.disabled) continue;
      const r = el.getBoundingClientRect();
      if (r.height < 44 - 0.5 || r.width < 44 - 0.5) small.push({ text: el.textContent.trim().slice(0, 30), cls: el.className, w: Math.round(r.width), h: Math.round(r.height) });
    }
    return { n, bad, small };
  });
  const uniq = (arr) => [...new Map(arr.map((b) => [b.cls + '|' + (b.ratio || b.h), b])).values()];
  ok(res.bad.length === 0, `${label}: ${res.bad.length} contrast failures of ${res.n} text elements, e.g. ${JSON.stringify(uniq(res.bad).slice(0, 5))}`);
  ok(res.small.length === 0, `${label}: ${res.small.length} controls under 44px, e.g. ${JSON.stringify(uniq(res.small).slice(0, 5))}`);
}

// Escape closes the dialog; its close handler (which clears the content and
// returns focus) runs asynchronously, so wait for it before going on.
async function closeDialog(page) {
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => { const d = document.getElementById('detail'); return !d.open && d.innerHTML === ''; });
}

async function noOverflow(page, label) {
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  ok(o.sw <= o.cw, `${label}: horizontal overflow (scrollWidth ${o.sw} > clientWidth ${o.cw})`);
}

async function checkGrid(page, student, label) {
  const cards = await page.$$eval('.wcard', (els) => els.map((el) => {
    const cell = el.closest('.wall-cell');
    return {
      id: el.dataset.entry,
      claim: Number(cell.dataset.claim),
      lens: cell.dataset.lens,
      text: el.querySelector('.wcard-text').textContent,
      uncertain: !!el.querySelector('.chip.uncertain'),
      chars: [...el.querySelectorAll('.wcard-chars > span:not(.sr-only)')].map((s) => s.textContent),
      scores: Object.fromEntries([...el.querySelectorAll('.ss')].map((s) => [s.dataset.crit, Number(s.dataset.score)])),
      hasScores: !!el.querySelector('.scores'),
      flags: [...el.querySelectorAll('.wcard-flags .chip')].map((c) => c.textContent)
    };
  }));
  ok(cards.length === DATA.entries.length, `${label}: grid shows ${cards.length} cards, expected ${DATA.entries.length}`);
  const candidates = new Set(DATA.claim_synthesis.flatMap((c) => c.candidates.map((k) => k.entry_id)));
  for (const e of DATA.entries) {
    const c = cards.find((x) => x.id === e.entry_id);
    if (!c) { ok(false, `${label}: ${e.entry_id} missing from grid`); continue; }
    ok(c.claim === e.claim_no && c.lens === e.discipline, `${label}: ${e.entry_id} in cell ${c.claim}/${c.lens}, expected ${e.claim_no}/${e.discipline}`);
    ok(c.text === e.card_text, `${label}: ${e.entry_id} card text differs from JSON`);
    ok(c.uncertain === (e.transcription_confidence === 'Uncertain'), `${label}: ${e.entry_id} uncertain marker wrong`);
    const expChars = e.oldenburg.characteristics.map((x) => x.name + ' (' + x.relation + ')');
    ok(JSON.stringify(c.chars) === JSON.stringify(expChars), `${label}: ${e.entry_id} characteristic chips ${JSON.stringify(c.chars)} != ${JSON.stringify(expChars)}`);
    if (student) {
      ok(!c.hasScores && c.flags.length === 0, `${label}: ${e.entry_id} shows scores or flags in student view`);
    } else {
      for (const k of CRITS) ok(c.scores[k] === e.strength[k].score, `${label}: ${e.entry_id} ${k} shows ${c.scores[k]}, JSON ${e.strength[k].score}`);
      const st = e.strength;
      const exp = [];
      if (candidates.has(e.entry_id)) exp.push('Candidate');
      if (st.claim_fit.misfiled_to != null) exp.push('Better fits claim ' + st.claim_fit.misfiled_to);
      if (st.claim_fit.not_an_explanation) exp.push('Not an explanation');
      if (st.lens_fit.actual_lens.primary !== e.discipline) exp.push('Coded lens: ' + st.lens_fit.actual_lens.primary);
      ok(exp.length === c.flags.length && exp.every((x, i) => c.flags[i].startsWith(x)), `${label}: ${e.entry_id} flags ${JSON.stringify(c.flags)} != ${JSON.stringify(exp)}`);
    }
  }
  // Claim rows carry the board text verbatim.
  const rows = await page.$$eval('.wall-rowhead .claim-text', (els) => els.map((e) => e.textContent));
  ok(JSON.stringify(rows) === JSON.stringify(DATA.claim_synthesis.map((c) => c.claim_text)), `${label}: claim row texts differ from JSON`);
  const synLinks = await page.$$('[data-goto-synthesis]');
  ok(student ? synLinks.length === 0 : synLinks.length === 4, `${label}: ${synLinks.length} synthesis links in grid`);
}

async function checkCoverage(page, student, label) {
  const cells = await page.$$eval('#cov-table tbody tr', (rows) => rows.map((r) => ({
    name: r.dataset.char,
    cells: [...r.querySelectorAll('td')].map((td) => ({
      claim: Number(td.dataset.claim),
      items: [...td.querySelectorAll('.eref')].map((b) => b.dataset.entry + ':' + b.querySelector('.rel').textContent.toLowerCase())
    }))
  })));
  const names = ['Neutral Ground', 'The Leveler', 'Conversation is the Main Activity', 'Accessibility and Accommodation', 'The Regulars', 'A Low Profile', 'The Mood is Playful', 'A Home Away from Home'];
  ok(JSON.stringify(cells.map((c) => c.name)) === JSON.stringify(names), `${label}: coverage rows ${JSON.stringify(cells.map((c) => c.name))}`);
  for (const row of cells) {
    for (const cell of row.cells) {
      const exp = [];
      for (const e of DATA.entries) {
        if (e.claim_no !== cell.claim) continue;
        for (const c of e.oldenburg.characteristics) if (c.name === row.name) exp.push(e.entry_id + ':' + c.relation);
      }
      ok(JSON.stringify(exp) === JSON.stringify(cell.items), `${label}: coverage ${row.name} x claim ${cell.claim}: ${JSON.stringify(cell.items)} != ${JSON.stringify(exp)}`);
    }
  }
  const foot = await page.$$eval('#cov-table tfoot td', (t) => t.map((x) => x.textContent));
  const expFoot = [1, 2, 3, 4].map((n) => {
    const all = DATA.entries.filter((e) => e.claim_no === n);
    return all.filter((e) => e.oldenburg.engagement === 'engaged').length + ' of ' + all.length;
  });
  ok(JSON.stringify(foot) === JSON.stringify(expFoot), `${label}: coverage totals ${JSON.stringify(foot)} != ${JSON.stringify(expFoot)}`);
  const vocabRows = await page.$$('#vocab-table tbody tr');
  const nFlags = DATA.entries.reduce((a, e) => a + e.oldenburg.vocabulary_flags.length, 0);
  ok(vocabRows.length === nFlags, `${label}: ${vocabRows.length} vocabulary rows, expected ${nFlags}`);
  const gaps = await page.$('#snapshot-gaps');
  ok(student ? !gaps : !!gaps, `${label}: snapshot gaps panel ${gaps ? 'present' : 'absent'}`);
}

async function checkSynthesis(page, label) {
  const panels = await page.$$eval('.syn', (els) => els.map((s) => ({
    claim: Number(s.dataset.claim),
    text: s.textContent,
    sec: Object.fromEntries([...s.querySelectorAll('.syn-sec')].map((x) => [x.dataset.sec, [...x.querySelectorAll('.syn-item-head .eref, .syn-item > .refs .eref')].map((b) => b.dataset.entry)])),
    clusters: [...s.querySelectorAll('[data-cluster]')].map((x) => x.dataset.cluster),
    nItems: Object.fromEntries([...s.querySelectorAll('.syn-sec')].map((x) => [x.dataset.sec, x.querySelectorAll('.syn-item').length]))
  })));
  ok(panels.length === 4, `${label}: ${panels.length} synthesis panels`);
  for (const c of DATA.claim_synthesis) {
    const p = panels.find((x) => x.claim === c.claim_no);
    if (!p) { ok(false, `${label}: no panel for claim ${c.claim_no}`); continue; }
    const t = norm(p.text);
    ok(t.includes(norm(c.claim_text)), `${label}: claim ${c.claim_no} text missing`);
    ok(JSON.stringify(p.sec.candidates || []) === JSON.stringify(c.candidates.map((k) => k.entry_id)), `${label}: claim ${c.claim_no} candidates ${JSON.stringify(p.sec.candidates)}`);
    ok(JSON.stringify(p.sec.imported || []) === JSON.stringify(c.imported_candidates.map((k) => k.entry_id)), `${label}: claim ${c.claim_no} imported ${JSON.stringify(p.sec.imported)}`);
    ok(JSON.stringify(p.sec.misses || []) === JSON.stringify(c.nearest_misses.map((k) => k.entry_id)), `${label}: claim ${c.claim_no} misses ${JSON.stringify(p.sec.misses)}`);
    ok(JSON.stringify(p.clusters) === JSON.stringify(c.clusters.map((k) => k.cluster_id)), `${label}: claim ${c.claim_no} clusters ${JSON.stringify(p.clusters)}`);
    ok((p.nItems.convergence || 0) === c.convergence.length, `${label}: claim ${c.claim_no} convergence count`);
    ok((p.nItems.tensions || 0) === c.tensions.length, `${label}: claim ${c.claim_no} tension count`);
    const texts = [...c.candidates, ...c.imported_candidates].map((k) => k.why)
      .concat(c.clusters.map((k) => k.shared_element), c.clusters.flatMap((k) => k.quotes.map((q) => q.quote)))
      .concat(c.convergence.map((k) => k.shared_mechanism), c.tensions.map((k) => k.description))
      .concat(c.gaps.characteristics_unengaged, c.gaps.lenses_without_mechanism, c.gaps.notes ? [c.gaps.notes] : []);
    for (const s of texts) ok(t.includes(norm(s)), `${label}: claim ${c.claim_no} synthesis text missing: ${s.slice(0, 60)}`);
  }
}

async function checkDetail(page, e, student, label) {
  const d = await page.$eval('dialog#detail', (dl) => ({
    open: dl.open,
    text: dl.textContent,
    face: dl.querySelector('.card-face').textContent,
    caveat: dl.querySelector('[data-part="caveat"]') ? dl.querySelector('[data-part="caveat"]').textContent : null,
    strength: !!dl.querySelector('[data-part="strength"]'),
    badges: Object.fromEntries([...dl.querySelectorAll('[data-crit]')].map((b) => [b.dataset.crit, b.querySelector('.score-badge') ? Number(b.querySelector('.score-badge').firstChild.textContent) : null])),
    analystNote: !!dl.querySelector('[data-part="analyst-note"]'),
    quotes: [...dl.querySelectorAll('.q')].map((q) => q.textContent),
    focus: document.activeElement && document.activeElement.hasAttribute('data-close')
  }));
  const L = `${label} ${e.entry_id}`;
  ok(d.open, `${L}: dialog not open`);
  ok(d.focus, `${L}: focus not moved to Close`);
  ok(d.face === e.card_text, `${L}: card text differs`);
  ok(e.transcription_caveat ? d.caveat && norm(d.caveat).includes(norm(e.transcription_caveat)) : d.caveat === null, `${L}: caveat display wrong`);
  const t = norm(d.text);
  const has = (s, what) => ok(t.includes(norm(s)), `${L}: missing ${what}: ${String(s).slice(0, 60)}`);
  const o = e.oldenburg;
  o.characteristics.forEach((c) => { has(c.name, 'characteristic'); has(c.rationale.text, 'characteristic rationale'); c.rationale.quotes.forEach((q) => ok(d.quotes.includes(q), `${L}: quote missing ${q}`)); });
  if (o.none_rationale) { has(o.none_rationale.text, 'none rationale'); o.none_rationale.quotes.forEach((q) => ok(d.quotes.includes(q), `${L}: quote missing ${q}`)); }
  o.vocabulary_flags.forEach((f) => { has(f.term_as_written, 'vocab term'); has(f.rationale.text, 'vocab rationale'); });
  const st = e.strength;
  if (st.testability.testable_implication) has(st.testability.testable_implication, 'testable implication');
  has(st.scope.bodo_question, 'Bodo question');
  if (student) {
    ok(!d.strength && Object.keys(d.badges).length === 0, `${L}: strength section shown in student view`);
    ok(!d.analystNote, `${L}: analyst note shown in student view`);
    for (const [what, s] of instructorOnlyChecked) if (s && t.includes(norm(s))) ok(false, `${L}: student view shows ${what}`);
  } else {
    ok(d.strength, `${L}: strength section missing`);
    for (const k of CRITS) {
      ok(d.badges[k] === st[k].score, `${L}: ${k} badge ${d.badges[k]} != ${st[k].score}`);
      has(st[k].rationale.text, k + ' rationale');
      st[k].rationale.quotes.forEach((q) => ok(d.quotes.includes(q), `${L}: ${k} quote missing ${q}`));
    }
    if (st.claim_fit.misfiled_to != null) has('Better fits: Claim ' + st.claim_fit.misfiled_to, 'misfiled_to');
    if (st.claim_fit.not_an_explanation) has(st.claim_fit.not_an_explanation.rationale.text, 'not_an_explanation rationale');
    has('Coded lens: ' + st.lens_fit.actual_lens.primary, 'actual lens');
    st.lens_fit.actual_lens.secondary.forEach((s) => has(s, 'secondary lens'));
    if (st.scope.stated_scope) has(st.scope.stated_scope, 'stated scope');
    if (st.testability.implication_note) has(st.testability.implication_note, 'implication note');
    ok(e.analyst_note ? d.analystNote : !d.analystNote, `${L}: analyst note display wrong`);
    if (e.analyst_note) has(e.analyst_note, 'analyst note');
  }
}

async function run() {
  const browser = await pw.chromium.launch();
  for (const vp of WIDTHS) {
    for (const student of [false, true]) {
      const mode = student ? 'student' : 'instructor';
      const label = `[${vp.name} ${mode}]`;
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
      page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));
      await page.goto(URL0 + (student ? '?view=student' : ''));

      const pressed = await page.getAttribute('#view-toggle', 'aria-pressed');
      ok(pressed === String(student), `${label}: toggle aria-pressed ${pressed}`);
      const tabs = await page.$$eval('[role="tab"]', (t) => t.map((x) => x.dataset.tab));
      ok(JSON.stringify(tabs) === JSON.stringify(student ? ['grid', 'coverage'] : ['grid', 'coverage', 'synthesis']), `${label}: tabs ${JSON.stringify(tabs)}`);

      await checkGrid(page, student, label + ' grid');
      await noOverflow(page, label + ' grid');
      await contrastAndTargets(page, label + ' grid');
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${vp.name}-${mode}-grid.png`), fullPage: true });

      // Entry detail: every entry at the narrowest and widest sizes, a sample elsewhere.
      const all = vp.name === 'mobile-360' || vp.name === 'desktop-1440';
      const sample = all ? DATA.entries : DATA.entries.filter((e, i) => i % 6 === 0 || e.transcription_confidence === 'Uncertain' || ['S1-003', 'S1-030'].includes(e.entry_id));
      for (const e of sample) {
        const card = page.locator(`.wcard[data-entry="${e.entry_id}"]`);
        await card.scrollIntoViewIfNeeded();
        await card.click();
        await checkDetail(page, e, student, label + ' detail');
        // One entry per claim, including an Uncertain one, for contrast and layout.
        if (['S1-003', 'S1-015', 'S1-024', 'S1-030'].includes(e.entry_id)) {
          await noOverflow(page, label + ' detail ' + e.entry_id);
          await contrastAndTargets(page, label + ' detail ' + e.entry_id);
          if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${vp.name}-${mode}-detail-${e.entry_id}.png`) });
        }
        await closeDialog(page);
        const after = await page.evaluate(() => ({ open: document.getElementById('detail').open, focus: document.activeElement && document.activeElement.dataset.entry }));
        ok(!after.open && after.focus === e.entry_id, `${label}: Escape on ${e.entry_id} left open=${after.open}, focus=${after.focus}`);
      }
      // Previous/next navigation inside the dialog.
      await page.locator('.wcard[data-entry="S1-001"]').click();
      await page.locator('[data-entry-nav="S1-002"]').click();
      ok(await page.$eval('#detail-title', (h) => h.textContent) === 'Entry S1-002', `${label}: Next did not move to S1-002`);
      await closeDialog(page);

      await page.click('#tab-coverage');
      await checkCoverage(page, student, label + ' coverage');
      await noOverflow(page, label + ' coverage');
      await contrastAndTargets(page, label + ' coverage');
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${vp.name}-${mode}-coverage.png`), fullPage: true });
      // Coverage entry buttons open the same detail.
      await page.locator('#cov-table .eref').first().click();
      ok(await page.$eval('dialog#detail', (d) => d.open), `${label}: coverage entry button did not open detail`);
      await closeDialog(page);

      if (!student) {
        await page.click('#tab-synthesis');
        await checkSynthesis(page, label + ' synthesis');
        await noOverflow(page, label + ' synthesis');
        await contrastAndTargets(page, label + ' synthesis');
        if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${vp.name}-${mode}-synthesis.png`), fullPage: true });
        await page.locator('.syn .eref').first().click();
        ok(await page.$eval('dialog#detail', (d) => d.open), `${label}: synthesis entry button did not open detail`);
        await closeDialog(page);
        // Keyboard: arrow keys move between tabs.
        await page.focus('#tab-synthesis');
        await page.keyboard.press('ArrowRight');
        ok(await page.evaluate(() => document.activeElement.id) === 'tab-grid', `${label}: ArrowRight from last tab did not wrap to grid`);
        // Grid row link jumps to the claim's synthesis panel.
        await page.locator('[data-goto-synthesis="3"]').click();
        ok(await page.evaluate(() => document.activeElement.id) === 'syn-claim-3', `${label}: grid synthesis link did not focus claim 3 panel`);
        // Toggle on: synthesis tab disappears, view falls back to grid, URL updated.
        await page.click('#view-toggle');
        const st = await page.evaluate(() => ({ tabs: [...document.querySelectorAll('[role=tab]')].map((t) => t.dataset.tab), syn: !!document.querySelector('.syn'), scores: document.querySelectorAll('.scores').length, url: location.search }));
        ok(JSON.stringify(st.tabs) === '["grid","coverage"]' && !st.syn && st.scores === 0 && st.url === '?view=student', `${label}: toggling on from synthesis gave ${JSON.stringify(st)}`);
      } else {
        // Whole-page leak check after visiting every view in student mode.
        for (const tab of ['grid', 'coverage']) {
          await page.click('#tab-' + tab);
          // Rendered text only: the embedded JSON <script> is data, not rendered.
          const t = norm(await page.evaluate(() => document.getElementById('app').textContent + ' ' + document.getElementById('detail').textContent));
          for (const [what, s] of instructorOnlyChecked) if (s && t.includes(norm(s))) ok(false, `${label} ${tab}: student view shows ${what}`);
          ok(!(await page.$('.scores, .score-badge, .syn, [data-part="strength"], #snapshot-gaps')), `${label} ${tab}: score or synthesis element present`);
        }
        // Toggle off restores instructor content.
        await page.click('#view-toggle');
        const back = await page.evaluate(() => ({ tabs: document.querySelectorAll('[role=tab]').length, url: location.search }));
        ok(back.tabs === 3 && back.url === '', `${label}: toggling off gave ${JSON.stringify(back)}`);
      }

      ok(errors.length === 0, `${label}: console/page errors: ${JSON.stringify(errors)}`);
      await ctx.close();
    }
  }
  await browser.close();
  console.log(`${checks} checks, ${failures} failures`);
  if (failures) {
    const seen = new Set();
    for (const f of failList) { if (!seen.has(f)) { seen.add(f); console.log('FAIL ' + f); } if (seen.size >= 60) break; }
    process.exit(1);
  }
  console.log(`checked ${instructorOnlyChecked.length} instructor-only strings for leaks (${instructorOnly.length - instructorOnlyChecked.length} skipped: identical to a student-visible string)`);
}

run().catch((err) => { console.error(err); [...new Set(failList)].slice(0, 40).forEach((f) => console.log('FAIL ' + f)); process.exit(2); });
