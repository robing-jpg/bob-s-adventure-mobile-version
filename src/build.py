#!/usr/bin/env python3
"""Build the single-file deliverable.

    python3 src/build.py            ->  dist/container-journey_v0.3.html

Reads src/engine.html, src/content/global.json and src/content/step01.json … step11.json,
checks that every [TO VERIFY:vNN] flag exists in the verification list and that every
[[term]] exists in the glossary, then injects the merged JSON at /*__CONTENT__*/.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT.parent / "dist" / "container-journey_v0.3.html"

def main():
    content = json.loads((ROOT / "content" / "global.json").read_text(encoding="utf-8"))
    steps = []
    for n in range(1, 12):
        p = ROOT / "content" / f"step{n:02d}.json"
        if not p.exists():
            sys.exit(f"Missing {p.name}")
        steps.append(json.loads(p.read_text(encoding="utf-8")))
    content["steps"] = steps
    raw = json.dumps(content, ensure_ascii=False)

    # Quality checks
    vids = {v["id"] for v in content["verification"]}
    flags = set(re.findall(r"\[TO VERIFY:(v\d+)\]", raw))
    missing_v = sorted(flags - vids)
    terms = set(re.findall(r"\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]", raw))
    missing_t = sorted(terms - set(content["glossary"]))
    if missing_v or missing_t:
        print("Missing verification ids:", missing_v)
        print("Missing glossary terms:", missing_t)
        sys.exit(1)

    html = (ROOT / "engine.html").read_text(encoding="utf-8")
    html = html.replace("/*__CONTENT__*/", raw.replace("</", "<\\/"))
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print(f"OK {OUT} ({OUT.stat().st_size // 1024} KB) · {len(flags)} flags used / {len(vids)} listed · {len(terms)} terms")

if __name__ == "__main__":
    main()
