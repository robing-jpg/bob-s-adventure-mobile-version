# Bob's Adventure — Mobile · handoff v0.1-mobile

Read this file first. Origin: [robing-jpg/bob-s-adventure](https://github.com/robing-jpg/bob-s-adventure) (desktop), copied from `main` @ `7b219e0` (v0.4.1, 18 Nov 2026) without git history. The origin repo is never modified from this project.

## State (20 Nov 2026, v0.1-mobile)
- Same game, engine and content as desktop v0.4.1; title "Bob's Adventure — Mobile" (`CONFIG.appTitle` + `<title>`).
- Build: `python3 src/build.py` → `dist/container-journey_v0.3.html` → copy to `index.html`, commit, push to `main` of `robing-jpg/bob-s-adventure-mobile-version` (check `git remote -v` first).
- Target: landscape phones 640×360, 740×360, 844×390, 915×412. Portrait shows "Turn your phone".
- **Waiting for desktop v0.5.** The mobile work (feedback 2 to 5) is applied once v0.5 is pushed to the origin repo, to avoid merging two big changes to the same files.

## Done in v0.1-mobile (feedback 1: answer font)
- Cause found: the right answer is the longest option in 79 of 87 answer sets. Android "font boosting" and iOS landscape text inflation enlarge longer text blocks, so the right answer showed up bigger.
- Fix: `text-size-adjust:100%` on `html`; all options use the same 16 px font, the same button height (`grid-auto-rows:1fr`) and centred text; glossary links inside answers are no longer bold. Before the click, no class marks the right answer (`.right` is only added after answering). Order is shuffled (questions, document checks, final quiz).
- Still to do after v0.5: rewrite options so the wrong ones are within ≈20 % of the right one's length (83 of 87 sets are over 20 % today; 32 step questions, 23 document checks, 29 quiz questions). Run `lens.py`-style check (see Testing).

## Mobile audit (20 Nov, v0.4.1 base, 640×360 → 915×412)
- Narration bubble is 87 px tall even when clamped to 1 line ("more ▾" wraps vertically); it covers ~33 % of the scene.
- Narration stays visible behind sheets and documents (not "one surface at a time").
- Question sheet is 86 % of the screen height; the 4th answer is below the fold.
- Hotspots overlap each other (step 1: "Shipper / forwarder" hidden under "Booking desk") and are 30 px tall (< 44 px).
- Text under 14 px: hotspot labels 11.5 px, kicker 11.2 px, TO VERIFY chips 9.6 px, step counter / Incoterm chip 13.6 px, menu card descriptions 12–13.8 px, document stamp and sub-header ~10.6 px.
- Touch targets under 44 px: Incoterm chip (32 px), menu links (32 px), glossary terms (20–25 px), TO VERIFY chips (16 px), intro "Skip" (40 px on 360 px-high screens).
- Document viewer: the check panel hides the lower half of the document; point ① sits on the edge.
- No `viewport-fit=cover` / `safe-area-inset` handling; bottom bar can sit under the home indicator.
- No horizontal overflow and no JS errors at the four sizes.

## Next (after v0.5)
1. Copy v0.5 from the origin repo, re-apply the feedback 1 CSS.
2. Feedback 2: scene ≥ 60 % height, narration 2 lines + fold button, one surface at a time, sheets ≤ 50 % height with internal scroll, 14/16 px minimum, 44 px targets, safe areas, rotate screen with Bob.
3. Feedback 3–4: remove non-essential hotspots, shorten narration/facts/dossier, simpler level 1 (≤ 2 essentials, no documents to analyse, fixed Incoterm). Keep JSON keys and ids; list everything removed.
4. Feedback 5: v0.5 features on mobile (risk-transfer animation ≈ 3 s + Skip, cost/CO₂ icons, nickname screen, summary + CSV, scores to the same Google Sheet with `version = mobile`).
5. Tests: 11 steps at L1 and L2, reefer + transshipment route; Vercel import (preset "Other", no build command).

## Rules to keep
- English content; neutral fictional brands; rebrand only via `CONFIG` in `src/engine.html`.
- Never invent figures: mark with `[TO VERIFY:vNN]` and add the item to `verification` in `global.json` (v01–v77 used). Keep every existing flag.
- When asked for a change, edit files and show only the modified parts.
- End every answer with an approximate token usage line (input / output / models).

## Testing
Headless Playwright with `is_mobile`, `has_touch`, landscape viewports. Scripts are not in the repo; recreate a smoke test that walks the 11 steps (open essentials, answer document checks, answer the question) and measures narration/sheet height, text < 14 px and targets < 44 px.
