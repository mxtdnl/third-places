/* ============================================================================
   Signal Tower - test harness. Node built-ins only, no dependencies.

     node tests/signal-tower.mjs          50 seeds per policy (the standard run)
     node tests/signal-tower.mjs --full   200 seeds per policy

   It reads ../signal-tower.html, pulls out <script id="model"> and evaluates
   it in a vm context, so the tests always run against the shipped file. The
   model suite is the same one the page runs at ?test=1.
   ========================================================================== */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'signal-tower.html'), 'utf8');
const match = html.match(/<script id="model">([\s\S]*?)<\/script>/);
if (!match) { console.error('could not find <script id="model"> in signal-tower.html'); process.exit(1); }

const context = vm.createContext({ console });
vm.runInContext(match[1] + '\n;globalThis.__ST = ST;', context, { filename: 'signal-tower.html#model' });
const ST = context.__ST;

const full = process.argv.includes('--full');
let passed = 0, failed = 0;
function report(name, ok, detail) {
  if (ok) { passed++; console.log('  pass  ' + name + (detail ? '  [' + detail + ']' : '')); }
  else { failed++; console.log('  FAIL  ' + name + '  ' + detail); }
}
function check(name, fn) { try { report(name, true, fn() || ''); } catch (e) { report(name, false, e.message); } }

console.log('\nsignal tower - model suite (shared with ?test=1)\n');
const suite = ST.selfTest({ seeds: full ? 200 : 50 });
suite.results.forEach(r => report(r.name, r.ok, r.detail));

console.log('\nfile level checks\n');
check('the model script contains no DOM access', () => {
  const hit = ['document.', 'window.', 'localStorage', 'navigator.'].filter(b => match[1].includes(b));
  if (hit.length) throw new Error('model touches ' + hit.join(', '));
  return 'pure';
});
check('no external resources or absolute urls', () => {
  const urls = html.match(/https?:\/\/[^\s"'<>)]+/g) || [];
  if (urls.length) throw new Error(urls.join(', '));
  return 'nothing is fetched';
});
check('no network calls', () => {
  const hit = [/\bfetch\s*\(/, /XMLHttpRequest/, /importScripts/, /new\s+WebSocket/, /EventSource/].filter(r => r.test(html));
  if (hit.length) throw new Error(hit.map(String).join(', '));
  return 'offline by construction';
});
check('every localStorage access is wrapped in try/catch', () => {
  const ui = html.slice(html.indexOf('<script id="ui">'));
  const uses = (ui.match(/localStorage\./g) || []).length;
  const guarded = (ui.match(/try\s*\{[^}]*localStorage\.[^}]*\}\s*catch/g) || []).length;
  if (uses !== guarded) throw new Error(uses + ' uses but ' + guarded + ' guarded');
  return uses + ' guarded accesses';
});
check('the page declares utf-8 before any content', () => {
  if (!/^<!DOCTYPE html>\s*<html[^>]*>\s*<head>\s*<meta charset="utf-8">/.test(html)) throw new Error('meta charset missing or late');
  return 'declared first';
});
check('javascript uses straight quotes only', () => {
  const js = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  const bad = js.match(/[‘’“”]/g);
  if (bad) throw new Error(bad.length + ' curly quotes in script');
  return 'clean';
});
check('the palette in CSS matches CONFIG.palette', () => {
  const map = { ochre: 'ochre', purple: 'purple', brown: 'brown', red: 'red', redText: 'red-text', paper: 'paper', card: 'card', ink: 'ink' };
  Object.entries(map).forEach(([k, v]) => {
    const m = html.match(new RegExp('--' + v + ':\\s*(#[0-9A-Fa-f]{6})'));
    if (!m || m[1].toUpperCase() !== ST.CONFIG.palette[k].toUpperCase()) throw new Error('--' + v + ' does not match');
  });
  return 'in step';
});
check('a stable reference season (guards against silent model drift)', () => {
  const r = ST.playSeason('reference', 'speaking', ST.dashFor('speaking', 'expert'), ST.BOTS.expert);
  return 'final C ' + r.state.C.toFixed(3) + ', events ' + r.events.join(',');
});

console.log('\n' + passed + ' passed, ' + failed + ' failed\n');
process.exit(failed ? 1 : 0);
