#!/usr/bin/env python3
"""Embed an analysis JSON file and the analysis schema into the viewer (claim-wall/index.html).

Usage, from claim-wall/:
    python3 scripts/embed_analysis.py                 # embeds analysis/S1.json
    python3 scripts/embed_analysis.py analysis/S1.json

Rewrites the contents of two blocks in index.html:
    <script type="application/json" id="embedded-analysis">  <- the analysis JSON
    <script type="application/json" id="embedded-schema">    <- analysis/schema.json
and checks that each embedded text parses back equal to its source file. The
viewer validates loaded files against the embedded schema, so re-run this
after any change to analysis/schema.json as well. JSON is embedded verbatim
except that "</" is written as "<\\/" (a valid JSON escape) so a block cannot
close the script element early. Standard library only.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
VIEWER = ROOT / "index.html"
SCHEMA = ROOT / "analysis" / "schema.json"


def block(block_id):
    return re.compile(
        r'(<script type="application/json" id="' + block_id + r'">\n)(.*?)(\n</script>)',
        re.S,
    )


def embed(html, block_id, src):
    raw = src.read_text(encoding="utf-8")
    json.loads(raw)
    payload = raw.strip().replace("</", "<\\/")
    if "<!--" in payload:
        raise SystemExit(f"error: {src.name} contains '<!--', which is unsafe inside a script element")
    pat = block(block_id)
    found = pat.findall(html)
    if len(found) != 1:
        raise SystemExit(f"error: expected one {block_id} block in {VIEWER.name}, found {len(found)}")
    return pat.sub(lambda m: m.group(1) + payload + m.group(3), html)


def check(block_id, src):
    embedded = block(block_id).search(VIEWER.read_text(encoding="utf-8")).group(2)
    if json.loads(embedded) != json.loads(src.read_text(encoding="utf-8")):
        raise SystemExit(f"error: embedded {block_id} does not parse back equal to {src.name}")


def main() -> int:
    src = ROOT / (sys.argv[1] if len(sys.argv) > 1 else "analysis/S1.json")
    data = json.loads(src.read_text(encoding="utf-8"))
    html = VIEWER.read_text(encoding="utf-8")
    html = embed(html, "embedded-analysis", src)
    html = embed(html, "embedded-schema", SCHEMA)
    VIEWER.write_text(html, encoding="utf-8")
    check("embedded-analysis", src)
    check("embedded-schema", SCHEMA)
    print(f"embedded {src.relative_to(ROOT)} ({data['snapshot']['snapshot_id']}, {len(data['entries'])} entries) "
          f"and {SCHEMA.relative_to(ROOT)} into {VIEWER.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
