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
