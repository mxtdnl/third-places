/* ============================================================================
   Quattro Mondi - test harness. Node built-ins only, no dependencies.

     node tests/run.mjs              the standard run
     node tests/run.mjs --full       1000 seeds for the cartel expected value

   It reads ../mondi.html, pulls out <script id="model"> and evaluates it in a
   vm context, so the tests always run against the shipped file.
   ========================================================================== */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, '..', 'mondi.html');
const html = readFileSync(file, 'utf8');

const match = html.match(/<script id="model">([\s\S]*?)<\/script>/);
if (!match) { console.error('could not find <script id="model"> in mondi.html'); process.exit(1); }

const context = vm.createContext({ console });
vm.runInContext(match[1] + '\n;globalThis.__QM = QM;', context, { filename: 'mondi.html#model' });
const QM = context.__QM;

const full = process.argv.includes('--full');
let passed = 0, failed = 0;

function report(name, ok, detail) {
  if (ok) { passed++; console.log('  pass  ' + name + (detail ? '  [' + detail + ']' : '')); }
  else { failed++; console.log('  FAIL  ' + name + '  ' + detail); }
}

function check(name, fn) {
  try { report(name, true, fn() || ''); }
  catch (e) { report(name, false, e.message); }
}

console.log('\nquattro mondi - model suite (shared with ?test=1)\n');
const suite = QM.selfTest({ evSeeds: full ? 1000 : 250, baseSeeds: full ? 200 : 60 });
suite.results.forEach(r => report(r.name, r.ok, r.detail));

console.log('\nfile level checks\n');

check('the model script contains no DOM access', () => {
  const banned = ['document.', 'window.', 'localStorage', 'navigator.'];
  const hit = banned.filter(b => match[1].includes(b));
  if (hit.length) throw new Error('model touches ' + hit.join(', '));
  return 'pure';
});

check('mondi.html has no external resource references', () => {
  const refs = html.match(/(?:src|href)\s*=\s*["'](https?:)?\/\//gi) || [];
  const urls = html.match(/https?:\/\/[^\s"'<>)]+/g) || [];
  if (refs.length) throw new Error('external resource: ' + refs.join(', '));
  if (urls.length) throw new Error('absolute url in the page: ' + urls.join(', '));
  return 'nothing is fetched';
});

check('mondi.html makes no network calls', () => {
  const banned = [/\bfetch\s*\(/, /XMLHttpRequest/, /importScripts/, /new\s+WebSocket/, /EventSource/];
  const hit = banned.filter(r => r.test(html));
  if (hit.length) throw new Error('found ' + hit.map(String).join(', '));
  return 'offline by construction';
});

check('every localStorage access is wrapped in try/catch', () => {
  const ui = html.slice(html.indexOf('</script>', html.indexOf('<script id="model">')));
  const uses = (ui.match(/localStorage\./g) || []).length;
  const guarded = (ui.match(/try\s*\{[^}]*localStorage\.[^}]*\}\s*catch/g) || []).length;
  if (uses !== guarded) throw new Error(uses + ' uses but ' + guarded + ' guarded');
  return uses + ' guarded accesses';
});

check('the page declares utf-8 before any content', () => {
  if (!/^<!DOCTYPE html>\s*<html[^>]*>\s*<head>\s*<meta charset="utf-8">/.test(html)) {
    throw new Error('meta charset is missing or too late');
  }
  return 'declared first';
});

check('javascript strings use straight quotes only', () => {
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  const bad = scripts.match(/[‘’“”]/g);
  if (bad) throw new Error(bad.length + ' curly quotes in script');
  return 'clean';
});

check('the model is one seedable object with the documented exports', () => {
  const want = ['tc', 'mc', 'atc', 'worlds', 'scoreRound', 'runGame', 'bots', 'mulberry32', 'replay', 'selfTest'];
  const missing = want.filter(k => QM[k] === undefined);
  if (missing.length) throw new Error('missing ' + missing.join(', '));
  ['quadrato', 'cerchio', 'triangolo', 'uno'].forEach(w => {
    ['init', 'prepare', 'optimum', 'step', 'passive'].forEach(fn => {
      if (typeof QM.worlds[w][fn] !== 'function') throw new Error(w + '.' + fn + ' is missing');
    });
  });
  return want.length + ' exports present';
});

check('a replayed log reproduces the score byte for byte', () => {
  const g = QM.runGame(20250923, QM.bots.shark(20250923));
  const payload = {
    v: 1, seed: 20250923,
    dec: g.log.map(e => ({ r: e.r, w: e.w, d: e.d })),
    diag: [0, 0, 1, 1, 2, 2, 3, 3], lens: 2
  };
  const a = QM.replay(payload);
  const b = QM.replay(JSON.parse(JSON.stringify(payload)));
  if (a.code !== b.code) throw new Error('codes differ');
  if (Math.abs(a.decision - g.decision) > 1e-9) throw new Error('decision score drifted');
  return a.code;
});

console.log('\n' + passed + ' passed, ' + failed + ' failed\n');
process.exit(failed ? 1 : 0);
