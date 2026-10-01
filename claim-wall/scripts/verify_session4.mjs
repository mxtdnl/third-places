// Browser checks for the claim-wall viewer (index.html) against the Session 4
// done-when criteria in claim-wall-spec.md: an override survives the export and
// re-import round trip, and loading a malformed file fails cleanly.
// It writes only to a temporary directory (exports, mutated files); it never
// edits files in the repo.
//
// Usage, from claim-wall/:
//   node scripts/verify_session4.mjs [--keep <dir>]
// --keep writes the exports and fixtures to <dir> instead of a temp dir.
// Needs Playwright with Chromium (set PLAYWRIGHT_MODULE if `playwright` is not
// resolvable), python3 with openpyxl, jsonschema and rfc3339-validator
// (pip install openpyxl jsonschema rfc3339-validator), and optionally
// LibreOffice (soffice) for an extra open-the-.xlsx check.
//
// Sections
//   1. Override: form validation, saving, visible marks, student view, reload
//   2. Export: JSON (schema, validator, analyst codes unchanged) and .xlsx
//      (scripts/check_xlsx_export.py; LibreOffice conversion if installed)
//   3. Round trip: load the exported JSON in a fresh browser, check the
//      overrides and marks, re-export, compare; revert; reset
//   4. Malformed files: each rejected with a message, viewer unchanged
//   5. Schema parity: the in-browser validator against python jsonschema on
//      targeted and random mutations of S1
//   6. Layout and accessibility of the new controls at 360 and 1280 px
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(process.env.PLAYWRIGHT_MODULE || '/opt/node-tools/node_modules/playwright'); }

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const S1 = JSON.parse(readFileSync(path.join(root, 'analysis/S1.json'), 'utf8'));
const URL0 = pathToFileURL(path.join(root, 'index.html')).href;
const keepIdx = process.argv.indexOf('--keep');
const OUT = keepIdx > -1 ? path.resolve(process.argv[keepIdx + 1]) : mkdtempSync(path.join(os.tmpdir(), 'claimwall-s4-'));
mkdirSync(OUT, { recursive: true });

let checks = 0, failures = 0;
const failList = [];
const sections = {};
let section = '';
function setSection(name) { section = name; sections[name] = sections[name] || { checks: 0, failures: 0 }; }
function ok(cond, msg) {
  checks++;
  sections[section] = sections[section] || { checks: 0, failures: 0 };
  sections[section].checks++;
  if (!cond) { failures++; sections[section].failures++; failList.push(`[${section}] ${msg}`); }
  return cond;
}
const clone = (v) => JSON.parse(JSON.stringify(v));
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const B = Object.fromEntries(S1.entries.map((e) => [e.entry_id, e]));
const IDX = Object.fromEntries(S1.entries.map((e, i) => [e.entry_id, i]));

const REASON = 'The analyst read this card as stating the step explicitly, but in class we agreed the card names an outcome and a cause without saying how the one produces the other, so the score should be lower for now.';
const SHORT = 'Too short to count.';
const NAME = 'Test Instructor';

function py(args, input) {
  const r = spawnSync('python3', args, { cwd: root, input, encoding: 'utf8' });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

// ── Shared page helpers ────────────────────────────────────────────────────
async function newPage(browser, vp = { width: 1280, height: 800 }) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, acceptDownloads: true });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') page.errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (err) => page.errors.push('pageerror: ' + err.message));
  await page.goto(URL0);
  return { ctx, page };
}
async function openEntry(page, id) {
  const card = page.locator(`.wcard[data-entry="${id}"]`);
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await page.waitForSelector('dialog#detail[open] #detail-title');
}
async function closeDialog(page) {
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => { const d = document.getElementById('detail'); return !d.open && d.innerHTML === ''; });
}
async function overrideCount(page) {
  return Number((await page.textContent('#tab-overrides')).match(/\((\d+)\)/)[1]);
}
async function startOverride(page, block) {
  await page.locator(`#detail [data-ov-open="${block}"]`).click();
  await page.waitForSelector('#detail form[data-edit-form]');
}
async function fillReason(page, text) {
  await page.fill('#ed-reason', text);
  await page.fill('#ed-by', NAME);
}
async function save(page) {
  await page.locator('#detail form[data-edit-form] button[type="submit"]').click();
}
async function download(page, selector, name) {
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click(selector)]);
  const file = path.join(OUT, name);
  await dl.saveAs(file);
  return { file, suggested: dl.suggestedFilename() };
}
async function loadViaPicker(page, file) {
  const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.click('[data-action="load"]')]);
  await chooser.setFiles(file);
}
async function viewState(page) {
  return page.evaluate(() => ({
    options: [...document.querySelectorAll('#snap-select option')].map((o) => ({ v: o.value, t: o.textContent, sel: o.selected })),
    cards: document.querySelectorAll('.wcard').length,
    error: (document.getElementById('data-error').textContent || '').trim(),
    status: (document.getElementById('data-status').textContent || '').trim(),
    errorRole: document.getElementById('data-error').getAttribute('role'),
    meta: document.getElementById('hdr-meta').textContent
  }));
}

// Contrast (WCAG AA) and 44px targets for visible text and controls; the
// same method as scripts/verify_viewer.mjs, extended to form controls (a
// radio or checkbox is measured by its label, which is its target).
async function contrastAndTargets(page, label) {
  // Move the pointer off any control and let colour transitions finish, so
  // hover styles and mid-transition colours are not measured.
  await page.mouse.move(0, 0);
  await page.waitForTimeout(250);
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
      if (el.closest('.sr-only') || ['SCRIPT', 'STYLE', 'OPTION'].includes(el.tagName)) continue;
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
      if (op < 1) continue;
      if (ratio < need - 0.005) bad.push({ text: el.textContent.trim().slice(0, 40), cls: el.className, ratio: ratio.toFixed(2), need });
    }
    const small = [];
    for (let el of scope.querySelectorAll('button, a[href], summary, [role="tab"], select, input, textarea')) {
      if (el.type === 'file' || el.hidden) continue;
      if (el.type === 'radio' || el.type === 'checkbox') el = el.closest('label');
      if (!el || !visible(el) || el.disabled) continue;
      const r = el.getBoundingClientRect();
      if (r.height < 44 - 0.5 || r.width < 44 - 0.5) small.push({ text: (el.textContent || el.id).trim().slice(0, 30), tag: el.tagName, cls: el.className, w: Math.round(r.width), h: Math.round(r.height) });
    }
    return { n, bad, small };
  });
  ok(res.bad.length === 0, `${label}: ${res.bad.length} contrast failures of ${res.n} text elements, e.g. ${JSON.stringify(res.bad.slice(0, 4))}`);
  ok(res.small.length === 0, `${label}: ${res.small.length} controls under 44px, e.g. ${JSON.stringify(res.small.slice(0, 4))}`);
}
async function noOverflow(page, label) {
  const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  ok(o.sw <= o.cw, `${label}: horizontal scroll (${o.sw} > ${o.cw})`);
}

// ── 1–3. Override, export, round trip ──────────────────────────────────────
const MECH_FROM = B['S1-003'].strength.mechanism.score;
const MECH_TO = MECH_FROM === 0 ? 1 : 0;
const NEW_IMPL = 'If longer working hours crowd out visits, one would expect people whose weekly hours rose to report fewer third-place visits than people whose hours did not.';
const NEW_CHAR = { name: 'Accessibility and Accommodation', relation: 'barrier', rationale: { quotes: ['crowded spaces'], text: 'Crowding is read as a barrier to reaching a place one can drop into easily.' } };

async function overrideFlow(browser) {
  setSection('override');
  const { ctx, page } = await newPage(browser);
  ok(await overrideCount(page) === 0, 'starts with 0 overrides');

  // 1a. Mechanism score on S1-003: validation, then save.
  await openEntry(page, 'S1-003');
  await startOverride(page, 'mechanism');
  ok(await page.evaluate(() => !!document.activeElement.closest('form[data-edit-form]')), 'focus moves into the override form');
  await page.locator(`#detail input[name="ed-score"][value="${MECH_TO}"]`).check();
  await page.fill('#ed-reason', '   ');
  await page.fill('#ed-by', NAME);
  ok(!(await page.$('#ed-reason-count')), 'no word count is shown for the reason');
  await save(page);
  let err = await page.textContent('#detail [data-form-errors]');
  ok(/Reason: required/.test(err), `empty reason rejected: ${norm(err)}`);
  ok(await page.evaluate(() => document.activeElement.hasAttribute('data-form-errors')), 'focus moves to the form errors');
  ok(await overrideCount(page) === 0, 'nothing saved after an empty reason');
  // A short reason is accepted; here only the bad quote is reported.
  await page.fill('#ed-r-q', 'not words from this card');
  await page.fill('#ed-reason', SHORT);
  await save(page);
  err = await page.textContent('#detail [data-form-errors]');
  ok(/is not in the card text exactly as written/.test(err), `quote check: ${norm(err)}`);
  ok(!/Reason/.test(err), `a ${SHORT.split(' ').length}-word reason is not rejected: ${norm(err)}`);
  await fillReason(page, REASON);
  ok(await overrideCount(page) === 0, 'nothing saved after a bad quote');
  await page.fill('#ed-r-q', B['S1-003'].strength.mechanism.rationale.quotes.join('\n'));
  await save(page);
  ok(!(await page.$('#detail form[data-edit-form]')), 'form closes after a valid save');
  ok(await page.evaluate(() => document.activeElement.getAttribute('data-ov-open')) === 'mechanism', 'focus returns to the Edit override button');
  ok(await overrideCount(page) === 1, 'one override after saving the mechanism score');

  // Marks in the detail.
  const det = await page.evaluate(() => {
    const b = document.querySelector('#detail .code-block[data-crit="mechanism"]');
    return {
      isOv: b.classList.contains('is-ov'),
      badge: b.querySelector('.score-badge').textContent,
      badgeOv: b.querySelector('.score-badge').classList.contains('ov'),
      mark: b.querySelector('.ov-mark') && b.querySelector('.ov-mark').textContent,
      orig: b.querySelector('.ov-box [data-role="original"]').textContent,
      over: b.querySelector('.ov-box [data-role="override"]').textContent,
      reason: b.querySelector('.ov-box .ov-why').textContent,
      buttons: [...b.querySelectorAll('.ov-controls button')].map((x) => x.textContent)
    };
  });
  ok(det.isOv && det.badgeOv && det.mark === 'Overridden', `detail marks the mechanism block: ${JSON.stringify(det)}`);
  ok(det.badge.startsWith(String(MECH_TO)), `detail shows the override score ${MECH_TO}: ${det.badge}`);
  ok(norm(det.orig) === `${MECH_FROM} / 2` && norm(det.over) === `${MECH_TO} / 2`, `original and override shown side by side: ${det.orig} | ${det.over}`);
  ok(det.reason.includes(REASON) && det.reason.includes(NAME), 'reason and name shown');
  ok(det.buttons.some((t) => t.startsWith('Edit override')) && det.buttons.some((t) => t.startsWith('Revert to analyst code')), `controls: ${det.buttons}`);
  // Escape inside a form cancels the form, not the dialog.
  await startOverride(page, 'scope');
  await page.keyboard.press('Escape');
  ok(await page.$eval('dialog#detail', (d) => d.open) && !(await page.$('#detail form[data-edit-form]')), 'Escape in a form cancels the form and keeps the dialog open');
  await closeDialog(page);

  // 1b. Oldenburg mapping on S1-001: none -> engaged with one characteristic.
  await openEntry(page, 'S1-001');
  await startOverride(page, 'oldenburg');
  await page.locator('#detail input[name="ed-eng"][value="engaged"]').check();
  await fillReason(page, REASON);
  await save(page);
  err = await page.textContent('#detail [data-form-errors]');
  ok(/Characteristics: add at least one/.test(err), `engaged with no characteristic rejected: ${norm(err)}`);
  await page.click('#detail [data-ed="add-ch"]');
  ok(await page.evaluate(() => document.activeElement.id) === 'ed-ch-name-0', 'focus moves to the added characteristic');
  await page.selectOption('#ed-ch-name-0', NEW_CHAR.name);
  await page.selectOption('#ed-ch-rel-0', NEW_CHAR.relation);
  await page.fill('#ed-ch-0-q', NEW_CHAR.rationale.quotes.join('\n'));
  await page.fill('#ed-ch-0-t', NEW_CHAR.rationale.text);
  ok(await page.inputValue('#ed-reason') === REASON, 'reason kept when a row is added');
  await save(page);
  ok(!(await page.$('#detail form[data-edit-form]')), 'Oldenburg override saved');
  ok(await overrideCount(page) === 2, 'two overrides');
  await closeDialog(page);

  // 1c. Testable implication on S1-014 (a field student view shows).
  await openEntry(page, 'S1-014');
  await startOverride(page, 'testability');
  await page.fill('#ed-impl', NEW_IMPL);
  await fillReason(page, REASON);
  await save(page);
  ok(await overrideCount(page) === 3, 'three overrides');
  const impl = await page.evaluate(() => ({ text: document.querySelector('#detail [data-part="implication"] .implication').textContent, mark: !!document.querySelector('#detail [data-part="implication"] h3 .ov-mark') }));
  ok(impl.text === NEW_IMPL && impl.mark, `implication section shows the override and its mark: ${JSON.stringify(impl)}`);
  // Saving with nothing changed is refused.
  await startOverride(page, 'scope');
  await fillReason(page, REASON);
  await save(page);
  err = await page.textContent('#detail [data-form-errors]');
  ok(/Nothing changed/.test(err), `no-change save refused: ${norm(err)}`);
  await page.click('#detail [data-ov-cancel]');
  await closeDialog(page);

  // Marks in the grid, coverage, synthesis and Overrides tab.
  const grid = await page.evaluate(() => {
    const c3 = document.querySelector('.wcard[data-entry="S1-003"]');
    const ss = c3.querySelector('.ss[data-crit="mechanism"]');
    const c1 = document.querySelector('.wcard[data-entry="S1-001"]');
    return {
      ssOv: ss.classList.contains('ov'), ssScore: ss.dataset.score, ssOrig: ss.dataset.orig,
      chips3: [...c3.querySelectorAll('.wcard-flags .chip')].map((x) => x.textContent),
      chars1: c1.querySelector('.wcard-chars') && c1.querySelector('.wcard-chars').textContent,
      otherOv: [...document.querySelectorAll('.ss.ov')].length
    };
  });
  ok(grid.ssOv && grid.ssScore === String(MECH_TO) && grid.ssOrig === String(MECH_FROM), `grid score cell marked: ${JSON.stringify(grid)}`);
  ok(grid.otherOv === 1, `exactly one overridden score cell on the grid (${grid.otherOv})`);
  ok(grid.chips3.includes('Overridden: 1 field'), `S1-003 override chip: ${grid.chips3}`);
  if (MECH_FROM >= 1 && MECH_TO === 0) ok(grid.chips3.some((t) => t.startsWith('Gate now failed')), `S1-003 gate chip: ${grid.chips3}`);
  ok(grid.chars1 && grid.chars1.includes(NEW_CHAR.name), `S1-001 card shows the added characteristic: ${grid.chars1}`);
  await page.click('#tab-coverage');
  const cov = await page.evaluate((name) => {
    const td = document.querySelector(`#cov-table tr[data-char="${name}"] td[data-claim="1"]`);
    const b = td && td.querySelector('.eref[data-entry="S1-001"]');
    return { found: !!b, star: !!(b && b.querySelector('.ovm')), label: b && b.getAttribute('aria-label') };
  }, NEW_CHAR.name);
  ok(cov.found && cov.star && /has instructor overrides/.test(cov.label), `coverage shows the override, marked: ${JSON.stringify(cov)}`);
  await page.click('#tab-synthesis');
  const syn = await page.evaluate(() => [...document.querySelectorAll('.syn [data-part="stale"]')].map((n) => n.closest('.syn').dataset.claim + ':' + [...n.querySelectorAll('.eref')].map((b) => b.dataset.entry).join(',')));
  ok(syn.some((s) => s.startsWith('1:') && s.includes('S1-003') && s.includes('S1-001')), `claim 1 synthesis notes its overrides: ${syn}`);
  ok(syn.some((s) => s.startsWith('2:') && s.includes('S1-014')), `claim 2 synthesis notes S1-014: ${syn}`);
  await page.click('#tab-overrides');
  const tab = await page.evaluate(() => [...document.querySelectorAll('#ov-table tbody tr')].map((r) => r.dataset.pointer));
  ok(tab.length === 3 && tab.includes(`/entries/${IDX['S1-003']}/strength/mechanism/score`) && tab.includes(`/entries/${IDX['S1-001']}/oldenburg`) && tab.includes(`/entries/${IDX['S1-014']}/strength/testability/testable_implication`), `Overrides tab rows: ${tab}`);
  await noOverflow(page, 'overrides tab 1280');
  await contrastAndTargets(page, 'overrides tab 1280');

  // Student view: reconciled values, "Revised by instructor", no originals or reasons.
  await page.click('#view-toggle');
  const st = await page.evaluate(() => ({
    tabs: [...document.querySelectorAll('[role=tab]')].map((t) => t.dataset.tab),
    rev: [...document.querySelectorAll('.wcard')].filter((c) => c.querySelector('.chip.rev')).map((c) => c.dataset.entry),
    ovMarks: document.querySelectorAll('.ov-mark:not(.rev), .chip.ov, .ss').length,
    actions: document.getElementById('data-actions').hidden,
    text: document.getElementById('app').textContent
  }));
  ok(JSON.stringify(st.tabs) === '["grid","coverage"]', `student tabs ${st.tabs}`);
  ok(JSON.stringify(st.rev.sort()) === '["S1-001","S1-014"]', `student view marks exactly the entries with student-visible overrides: ${st.rev}`);
  ok(st.ovMarks === 0, `student view has no instructor override marks or scores (${st.ovMarks})`);
  ok(st.actions === true, 'student view hides load, export and reset');
  ok(!norm(st.text).includes(norm(REASON)), 'student view grid does not show the reason');
  await openEntry(page, 'S1-014');
  const sd = await page.evaluate(() => ({ text: document.getElementById('detail').textContent, box: !!document.querySelector('#detail .ov-box, #detail .ov-controls'), rev: !!document.querySelector('#detail [data-part="implication"] .ov-mark.rev') }));
  ok(sd.text.includes(NEW_IMPL) && sd.rev && !sd.box, 'student detail shows the revised implication, marked, without override controls');
  ok(!sd.text.includes(B['S1-014'].strength.testability.testable_implication), 'student detail does not show the original implication');
  ok(!norm(sd.text).includes(norm(REASON)) && !sd.text.includes(NAME), 'student detail shows no reason or name');
  await closeDialog(page);
  await page.click('#view-toggle');

  // Reload: overrides persist in this browser.
  await page.reload();
  ok(await overrideCount(page) === 3, 'overrides survive a page reload (localStorage)');
  ok(page.errors.length === 0, `no console errors: ${page.errors.slice(0, 3)}`);

  // ── 2. Export ──
  setSection('export');
  const j = await download(page, '[data-action="export-json"]', 'export-1.json');
  ok(/^claim-wall-S1-with-overrides-\d{4}-\d{2}-\d{2}\.json$/.test(j.suggested), `JSON file name ${j.suggested}`);
  const exp = JSON.parse(readFileSync(j.file, 'utf8'));
  const { overrides, ...rest } = exp;
  const { overrides: s1ov, ...s1rest } = S1;
  ok(JSON.stringify(rest) === JSON.stringify(s1rest), 'exported JSON keeps every analyst code unchanged (identical to S1.json apart from overrides)');
  ok(overrides.length === 3, `exported JSON has 3 overrides (${overrides.length})`);
  const byPtr = Object.fromEntries(overrides.map((o) => [o.pointer, o]));
  const pMech = `/entries/${IDX['S1-003']}/strength/mechanism/score`, pOld = `/entries/${IDX['S1-001']}/oldenburg`, pImpl = `/entries/${IDX['S1-014']}/strength/testability/testable_implication`;
  ok(byPtr[pMech] && byPtr[pMech].original_value === MECH_FROM && byPtr[pMech].override_value === MECH_TO, `mechanism override record: ${JSON.stringify(byPtr[pMech])}`);
  ok(byPtr[pOld] && JSON.stringify(byPtr[pOld].original_value) === JSON.stringify(B['S1-001'].oldenburg), 'Oldenburg override keeps the analyst original');
  ok(byPtr[pOld] && JSON.stringify(byPtr[pOld].override_value) === JSON.stringify({ engagement: 'engaged', characteristics: [NEW_CHAR], vocabulary_flags: [] }), `Oldenburg override value: ${JSON.stringify(byPtr[pOld] && byPtr[pOld].override_value)}`);
  ok(byPtr[pImpl] && byPtr[pImpl].original_value === B['S1-014'].strength.testability.testable_implication && byPtr[pImpl].override_value === NEW_IMPL, 'implication override record');
  ok(overrides.every((o) => o.reason === REASON && o.by === NAME && o.target.kind === 'entry'), 'reason, name and target on every override');
  let r = py(['-c', `
import json, sys
from jsonschema import Draft202012Validator, FormatChecker
v = Draft202012Validator(json.load(open('analysis/schema.json')), format_checker=FormatChecker())
errs = list(v.iter_errors(json.load(open(sys.argv[1]))))
print(len(errs)); [print(e.message) for e in errs[:5]]`, j.file]);
  ok(r.code === 0 && r.out.trim().split('\n')[0] === '0', `python jsonschema accepts the exported JSON: ${r.out}`);
  r = py(['scripts/validate_analysis.py', j.file]);
  const vsum = (r.out.match(/(\d+) error\(s\), (\d+) warning\(s\)/) || []);
  ok(r.code === 0 && vsum[1] === '0' && vsum[2] === '1' && /3 override\(s\) present/.test(r.out), `validate_analysis.py on the export: ${vsum[0]} (expected 0 errors, 1 warning that overrides are present)`);

  const x = await download(page, '[data-action="export-xlsx"]', 'export-1.xlsx');
  ok(/\.xlsx$/.test(x.suggested), `xlsx file name ${x.suggested}`);
  r = py(['scripts/check_xlsx_export.py', x.file, j.file]);
  ok(r.code === 0, `check_xlsx_export.py: ${r.out.trim().split('\n').slice(-3).join(' / ')}`);
  sections.export.xlsxSummary = r.out.trim().split('\n').pop();
  // LibreOffice check, only where Calc can open a reference workbook made by openpyxl.
  const ref = path.join(OUT, 'reference.xlsx');
  py(['-c', `import openpyxl; wb = openpyxl.Workbook(); wb.active['A1'] = 'x'; wb.save(${JSON.stringify(ref)})`]);
  const refOk = spawnSync('which', ['soffice']).status === 0
    && spawnSync('soffice', ['--headless', '--convert-to', 'csv', '--outdir', path.join(OUT, 'lo-ref'), ref], { encoding: 'utf8', timeout: 120000 }).status === 0
    && existsSync(path.join(OUT, 'lo-ref', 'reference.csv'));
  sections.export.libreoffice = refOk ? 'opened' : 'skipped (LibreOffice Calc not available)';
  if (refOk) {
    const lo = path.join(OUT, 'lo');
    mkdirSync(lo, { recursive: true });
    const conv = spawnSync('soffice', ['--headless', '--convert-to', 'csv', '--outdir', lo, x.file], { encoding: 'utf8', timeout: 120000 });
    const csv = path.join(lo, 'export-1.csv');
    ok(conv.status === 0 && existsSync(csv) && readFileSync(csv, 'utf8').startsWith('Entry_ID,'), `LibreOffice opens the .xlsx and converts its first sheet: ${((conv.stdout || '') + (conv.stderr || '')).slice(0, 300)}`);
  }
  ok(page.errors.length === 0, `no console errors during export: ${page.errors.slice(0, 3)}`);
  await ctx.close();
  return { jsonFile: j.file, exported: exp };
}

async function roundTrip(browser, jsonFile, exported) {
  setSection('round trip');
  const { ctx, page } = await newPage(browser);
  ok(await overrideCount(page) === 0, 'fresh browser starts with no overrides');
  await loadViaPicker(page, jsonFile);
  await page.waitForFunction(() => document.querySelectorAll('#snap-select option').length === 2);
  let vs = await viewState(page);
  const selected = vs.options.find((o) => o.sel);
  ok(selected && selected.t === 'S1 · export-1.json · 3 overrides', `loaded file selected: ${JSON.stringify(vs.options)}`);
  ok(/Loaded export-1\.json: snapshot S1, 39 entries, 3 overrides/.test(vs.status) && !vs.error, `load message: ${vs.status} ${vs.error}`);
  ok(/Source: export-1\.json/.test(vs.meta) && /3 instructor overrides/.test(vs.meta), `header names the source: ${norm(vs.meta)}`);
  ok(await overrideCount(page) === 3, 'three overrides after re-import');
  const g = await page.evaluate(() => { const s = document.querySelector('.wcard[data-entry="S1-003"] .ss[data-crit="mechanism"]'); return { ov: s.classList.contains('ov'), score: s.dataset.score, orig: s.dataset.orig }; });
  ok(g.ov && g.score === String(MECH_TO) && g.orig === String(MECH_FROM), `re-imported mechanism override is marked on the grid: ${JSON.stringify(g)}`);
  await openEntry(page, 'S1-003');
  const det = await page.evaluate(() => { const b = document.querySelector('#detail .code-block[data-crit="mechanism"]'); return { orig: b.querySelector('[data-role="original"]').textContent, over: b.querySelector('[data-role="override"]').textContent, why: b.querySelector('.ov-why').textContent }; });
  ok(norm(det.orig) === `${MECH_FROM} / 2` && norm(det.over) === `${MECH_TO} / 2` && det.why.includes(REASON) && det.why.includes(NAME), `re-imported override shows original, value and reason: ${JSON.stringify(det)}`);
  await closeDialog(page);
  await openEntry(page, 'S1-001');
  const oc = await page.evaluate(() => [...document.querySelectorAll('#detail [data-part="oldenburg"] > .code-block .name')].map((n) => n.textContent));
  ok(JSON.stringify(oc) === JSON.stringify([NEW_CHAR.name]), `re-imported Oldenburg override applied: ${oc}`);
  await closeDialog(page);

  // Re-export: identical to the first export.
  const j2 = await download(page, '[data-action="export-json"]', 'export-2.json');
  const t1 = readFileSync(jsonFile, 'utf8'), t2 = readFileSync(j2.file, 'utf8');
  ok(t1 === t2, 'export → re-import → export gives a byte-identical JSON file');
  ok(JSON.stringify(JSON.parse(t2)) === JSON.stringify(exported), 're-exported document equals the first export');

  // Switching snapshots and back keeps both.
  await page.selectOption('#snap-select', 'embedded');
  ok(await overrideCount(page) === 0 && (await page.$$('.ss.ov')).length === 0, 'built-in snapshot has no overrides');
  const fileKey = (await viewState(page)).options.find((o) => o.t.includes('export-1.json')).v;
  await page.selectOption('#snap-select', fileKey);
  ok(await overrideCount(page) === 3, 'switching back restores the file snapshot with its overrides');

  // Revert one block, export, check.
  await openEntry(page, 'S1-014');
  await page.click('#detail [data-ov-revert-arm="testability"]');
  ok(await page.evaluate(() => document.activeElement.getAttribute('data-ov-revert')) === 'testability', 'revert asks for confirmation (focus on Confirm)');
  await page.click('#detail [data-ov-revert="testability"]');
  ok(await overrideCount(page) === 2, 'revert removes the override');
  ok(await page.$eval('#detail [data-part="implication"] .implication', (n) => n.textContent) === B['S1-014'].strength.testability.testable_implication, 'reverted field shows the analyst value again');
  await closeDialog(page);
  const j3 = await download(page, '[data-action="export-json"]', 'export-3.json');
  ok(JSON.parse(readFileSync(j3.file, 'utf8')).overrides.length === 2, 'export after revert has 2 overrides');

  // Reset with confirmation.
  await page.click('[data-action="reset"]');
  ok(await page.evaluate(() => document.activeElement.dataset.action) === 'reset-confirm', 'reset asks for confirmation');
  await contrastAndTargets(page, 'reset confirm 1280');
  await page.click('[data-action="reset-confirm"]');
  vs = await viewState(page);
  const stored = await page.evaluate(() => localStorage.getItem('claim-wall-viewer:v1'));
  ok(vs.options.length === 1 && vs.options[0].v === 'embedded' && await overrideCount(page) === 0 && stored === null, `reset clears overrides, loaded files and storage: ${JSON.stringify(vs.options)} stored=${stored && stored.length}`);
  ok(page.errors.length === 0, `no console errors: ${page.errors.slice(0, 3)}`);
  await ctx.close();
}

// ── 4. Malformed files ─────────────────────────────────────────────────────
function malformedCases(exported) {
  const C = [];
  const add = (name, file, content, expect) => C.push({ name, file, content, expect });
  const mut = (fn) => { const d = clone(S1); fn(d); return JSON.stringify(d); };
  const mutE = (fn) => { const d = clone(exported); fn(d); return JSON.stringify(d); };
  add('truncated JSON', 'truncated.json', JSON.stringify(S1).slice(0, 5000), /not valid JSON/);
  add('empty file', 'empty.json', '', /not valid JSON/);
  add('not an object', 'array.json', '[]', /must be object/);
  add('wrong file type', 'S1.txt', JSON.stringify(S1), /Only analysis JSON files/);
  add('score out of range', 'score3.json', mut((d) => { d.entries[4].strength.mechanism.score = 3; }), /Entry S1-005 › strength › mechanism › score: must be one of 0, 1, 2/);
  add('missing required field', 'missing.json', mut((d) => { delete d.entries[0].strength; }), /Entry S1-001: is missing required field "strength"/);
  add('unknown root field', 'extra.json', mut((d) => { d.total_score = 10; }), /field the schema does not allow: "total_score"/);
  add('implication with testability 0 (if/then)', 'ifthen.json', mut((d) => { const t = d.entries.find((e) => e.strength.testability.score === 2).strength.testability; t.score = 0; }), /testable_implication: must be null/);
  add('bad entry ID', 'badid.json', mut((d) => { d.entries[2].entry_id = 'S1-3'; }), /does not match the required pattern/);
  add('wrong characteristic name', 'charname.json', mut((d) => { const e = d.entries.find((x) => x.oldenburg.characteristics.length); e.oldenburg.characteristics[0].name = 'The Leveller'; }), /must be one of "Neutral Ground"/);
  add('three claims', 'claims.json', mut((d) => { d.claim_synthesis.pop(); }), /claim_synthesis: must have at least 4 items/);
  add('quote not on the card', 'quote.json', mut((d) => { d.entries[0].strength.scope.rationale.quotes = ['words the student never wrote']; }), /quote "words the student never wrote" is not in the card text/);
  add('entry_count mismatch', 'count.json', mut((d) => { d.snapshot.entry_count = 40; }), /entry_count: is 40 but the file has 39 entries/);
  add('duplicate entry', 'dup.json', mut((d) => { d.entries[1] = clone(d.entries[0]); d.entries[1].entry_id = 'S1-001'; }), /duplicates entry S1-001/);
  add('override with a tampered original', 'ov-orig.json', mutE((d) => { d.overrides[0].original_value = 'not the analyst value'; }), /original_value: does not equal the analyst's value/);
  add('override pointing outside entry codes', 'ov-ptr.json', mutE((d) => { d.overrides[0].pointer = '/snapshot/analyst'; d.overrides[0].original_value = S1.snapshot.analyst; }), /is not an overridable code/);
  add('override value breaks the schema', 'ov-val.json', mutE((d) => { const o = d.overrides.find((x) => x.pointer.endsWith('/mechanism/score')); o.override_value = 5; }), /must be one of 0, 1, 2; found 5 \(after applying the overrides\)/);
  add('override target mismatch', 'ov-target.json', mutE((d) => { d.overrides[0].target.entry_id = 'S1-039'; }), /target › entry_id: is S1-039 but the pointer leads to/);
  add('override without a reason', 'ov-reason.json', mutE((d) => { d.overrides[0].reason = ''; }), /reason: must not be empty/);
  return C;
}

async function malformedFlow(browser, exported, jsonFile) {
  setSection('malformed');
  const { ctx, page } = await newPage(browser);
  // Start from a loaded file so "unchanged" means the current slot stays put.
  await page.setInputFiles('#file-input', jsonFile);
  await page.waitForFunction(() => document.querySelectorAll('#snap-select option').length === 2);
  const before = await viewState(page);
  const cases = malformedCases(exported);
  mkdirSync(path.join(OUT, 'malformed'), { recursive: true });
  sections.malformed.cases = [];
  for (const c of cases) {
    const file = path.join(OUT, 'malformed', c.file);
    writeFileSync(file, c.content);
    await page.setInputFiles('#file-input', file);
    await page.waitForFunction(() => document.getElementById('data-error').textContent.trim().length > 0);
    const vs = await viewState(page);
    const good = ok(vs.error.startsWith('Could not load ' + c.file), `${c.name}: error heading: ${vs.error.slice(0, 120)}`)
      & ok(c.expect.test(vs.error), `${c.name}: message should match ${c.expect}; got: ${vs.error.slice(0, 400)}`)
      & ok(/Nothing was changed: the viewer still shows S1 · export-1\.json · 3 overrides\./.test(vs.error), `${c.name}: says nothing changed`)
      & ok(vs.errorRole === 'alert', `${c.name}: error region is role=alert`)
      & ok(JSON.stringify(vs.options) === JSON.stringify(before.options) && vs.cards === 39 && await overrideCount(page) === 3, `${c.name}: viewer unchanged`);
    sections.malformed.cases.push({ name: c.name, pass: !!good, message: vs.error.replace(/^Could not load [^:]+: ?/, '').replace(/Nothing was changed.*$/, '').slice(0, 160) });
    // Clear the message so the next wait sees a fresh one.
    await page.evaluate(() => { document.getElementById('data-error').innerHTML = ''; });
  }
  // One error box layout check at 1280 (with the last message showing).
  await page.setInputFiles('#file-input', path.join(OUT, 'malformed', 'score3.json'));
  await page.waitForFunction(() => document.getElementById('data-error').textContent.trim().length > 0);
  await contrastAndTargets(page, 'load error 1280');
  ok(page.errors.length === 0, `no console or page errors while rejecting files: ${page.errors.slice(0, 3)}`);
  await ctx.close();
}

// ── 5. Schema parity with python jsonschema ───────────────────────────────
function mutations() {
  const out = [];
  let seed = 20261001;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const paths = [];
  (function walk(v, p) {
    paths.push(p);
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, [...p, i]));
    else if (v && typeof v === 'object') Object.keys(v).forEach((k) => walk(v[k], [...p, k]));
  })(S1, []);
  const leafValues = [null, 0, 1, 2, 3, -1, 1.5, true, '', 'x', 'S1-001', 'S9', '2026-13-01', '2026-10-01', '2026-10-01T10:00:00Z', 'not-a-date', [], {}, ['a'], 'Psychology', 'Undeterminable', 'erodes', 'Neutral Ground', 'neutral ground', 'Why?', 'No question', '[bracket]'];
  const get = (d, p) => p.reduce((a, k) => a[k], d);
  for (let i = 0; i < 400; i++) {
    const d = clone(S1);
    const p = pick(paths.filter((x) => x.length));
    const parent = get(d, p.slice(0, -1)), key = p[p.length - 1];
    const kind = rnd();
    if (kind < 0.6) parent[key] = clone(pick(leafValues));
    else if (kind < 0.8 && !Array.isArray(parent)) delete parent[key];
    else if (kind < 0.9 && !Array.isArray(parent)) parent['extra_' + i] = 1;
    else if (Array.isArray(parent)) parent.push(clone(parent[key]));
    else parent[key] = clone(pick(leafValues));
    out.push({ name: 'random ' + i + ' ' + p.join('/'), doc: d });
  }
  out.push({ name: 'S1 as is', doc: clone(S1) });
  return out;
}

async function parity(browser) {
  setSection('schema parity');
  const { ctx, page } = await newPage(browser);
  const muts = mutations();
  const dir = path.join(OUT, 'parity');
  mkdirSync(dir, { recursive: true });
  muts.forEach((m, i) => writeFileSync(path.join(dir, String(i).padStart(4, '0') + '.json'), JSON.stringify(m.doc)));
  const r = py(['-c', `
import json, os, sys
from jsonschema import Draft202012Validator, FormatChecker
v = Draft202012Validator(json.load(open('analysis/schema.json')), format_checker=FormatChecker())
d = sys.argv[1]
print(json.dumps([v.is_valid(json.load(open(os.path.join(d, f)))) for f in sorted(os.listdir(d))]))`, dir]);
  const pyv = JSON.parse(r.out.trim().split('\n').pop());
  const jsv = await page.evaluate((docs) => docs.map((d) => window.ClaimWallViewer.schemaErrors(d).length === 0), muts.map((m) => m.doc));
  let same = 0;
  const diff = [];
  muts.forEach((m, i) => { if (pyv[i] === jsv[i]) same++; else diff.push(`${m.name}: python ${pyv[i]}, browser ${jsv[i]}`); });
  ok(diff.length === 0, `browser and python schema verdicts differ on ${diff.length} of ${muts.length}: ${diff.slice(0, 5).join(' | ')}`);
  ok(pyv.filter((x) => !x).length > 200, `enough mutations are invalid to be a test (${pyv.filter((x) => !x).length} invalid, ${pyv.filter((x) => x).length} valid)`);
  sections['schema parity'].summary = `${same} of ${muts.length} verdicts agree (${pyv.filter((x) => !x).length} invalid, ${pyv.filter((x) => x).length} valid per python)`;
  await ctx.close();
}

// ── 6. Layout and accessibility of the new controls ─────────────────────
async function layout(browser) {
  setSection('layout');
  for (const vp of [{ name: '360', width: 360, height: 740, isMobile: true, hasTouch: true }, { name: '1280', width: 1280, height: 800 }]) {
    const { ctx, page } = await newPage(browser, vp);
    await noOverflow(page, `${vp.name} grid with data bar`);
    await contrastAndTargets(page, `${vp.name} grid with data bar`);
    await page.click('[data-action="reset"]');
    await noOverflow(page, `${vp.name} reset confirm`);
    await contrastAndTargets(page, `${vp.name} reset confirm`);
    await page.click('[data-action="reset-cancel"]');
    await openEntry(page, 'S1-021');
    await startOverride(page, 'oldenburg');
    await page.click('#detail [data-ed="add-vf"]');
    await noOverflow(page, `${vp.name} Oldenburg form`);
    await contrastAndTargets(page, `${vp.name} Oldenburg form`);
    await page.click('#detail [data-ov-cancel]');
    await startOverride(page, 'claim_fit');
    await save(page);
    await contrastAndTargets(page, `${vp.name} claim fit form with errors`);
    await noOverflow(page, `${vp.name} claim fit form with errors`);
    await page.click('#detail [data-ov-cancel]');
    await startOverride(page, 'lens_fit');
    await contrastAndTargets(page, `${vp.name} lens fit form`);
    await page.locator('#detail input[name="ed-score"][value="0"]').check();
    await fillReason(page, REASON);
    await save(page);
    await contrastAndTargets(page, `${vp.name} detail with override box`);
    await noOverflow(page, `${vp.name} detail with override box`);
    await closeDialog(page);
    await page.click('#tab-overrides');
    await contrastAndTargets(page, `${vp.name} overrides tab`);
    await noOverflow(page, `${vp.name} overrides tab`);
    await page.click('#view-toggle');
    await contrastAndTargets(page, `${vp.name} student view with a revision`);
    ok(page.errors.length === 0, `${vp.name}: no console errors: ${page.errors.slice(0, 3)}`);
    await ctx.close();
  }
}

async function run() {
  const browser = await pw.chromium.launch();
  try {
    const { jsonFile, exported } = await overrideFlow(browser);
    await roundTrip(browser, jsonFile, exported);
    await malformedFlow(browser, exported, jsonFile);
    await parity(browser);
    await layout(browser);
  } catch (err) {
    failures++;
    failList.push(`[${section}] exception: ${err.stack || err}`);
  } finally {
    await browser.close();
  }
  for (const [name, s] of Object.entries(sections)) {
    console.log(`${name}: ${s.checks} checks, ${s.failures} failures${s.summary ? ' · ' + s.summary : ''}${s.xlsxSummary ? ' · xlsx: ' + s.xlsxSummary : ''}${s.libreoffice ? ' · LibreOffice: ' + s.libreoffice : ''}`);
    if (s.cases) s.cases.forEach((c) => console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}: ${c.message}`));
  }
  for (const f of failList) console.log('FAIL ' + f);
  console.log(`${checks} checks, ${failures} failures (files in ${OUT})`);
  process.exit(failures ? 1 : 0);
}
run();
