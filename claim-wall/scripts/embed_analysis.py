#!/usr/bin/env python3
"""Embed an analysis JSON file into the viewer (claim-wall/index.html).

Usage, from claim-wall/:
    python3 scripts/embed_analysis.py                 # embeds analysis/S1.json
    python3 scripts/embed_analysis.py analysis/S1.json

Rewrites the contents of <script type="application/json" id="embedded-analysis">
in index.html and checks that the embedded text parses back equal to the source
file. The JSON is embedded verbatim except that "</" is written as "<\\/" (a
valid JSON escape) so the block cannot close the script element early.
Standard library only.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
VIEWER = ROOT / "index.html"
BLOCK = re.compile(
    r'(<script type="application/json" id="embedded-analysis">\n)(.*?)(\n</script>)',
    re.S,
)


def main() -> int:
    src = ROOT / (sys.argv[1] if len(sys.argv) > 1 else "analysis/S1.json")
    raw = src.read_text(encoding="utf-8")
    data = json.loads(raw)
    payload = raw.strip().replace("</", "<\\/")
    if "<!--" in payload:
        print("error: source contains '<!--', which is unsafe inside a script element", file=sys.stderr)
        return 1

    html = VIEWER.read_text(encoding="utf-8")
    matches = BLOCK.findall(html)
    if len(matches) != 1:
        print(f"error: expected one embedded-analysis block in {VIEWER.name}, found {len(matches)}", file=sys.stderr)
        return 1
    html = BLOCK.sub(lambda m: m.group(1) + payload + m.group(3), html)
    VIEWER.write_text(html, encoding="utf-8")

    embedded = BLOCK.search(VIEWER.read_text(encoding="utf-8")).group(2)
    if json.loads(embedded) != data:
        print("error: embedded JSON does not parse back equal to the source", file=sys.stderr)
        return 1
    print(f"embedded {src.relative_to(ROOT)} ({data['snapshot']['snapshot_id']}, {len(data['entries'])} entries) into {VIEWER.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
