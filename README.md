# Bob's Adventure — Mobile

The **landscape-phone version** of *Bob's Adventure — A Container Journey*, an interactive onboarding game for new joiners at an ocean carrier. **Bob**, a shipping container, tells his own journey from an empty depot to the consignee's door — and back — in 11 steps. At each step, the player decides what happens next.

- Desktop version (source of truth for content): [robing-jpg/bob-s-adventure](https://github.com/robing-jpg/bob-s-adventure). This repo is based on its **v0.5**.
- This repo: mobile layout only, tuned for landscape phones (640×360, 740×360, 844×390, 915×412). In portrait, a "Turn your phone" screen with Bob is shown.

**Play:** https://bob-s-adventure-mobile-version.vercel.app on a phone in landscape, or open `index.html` (works offline).

## What's inside
- **3 levels** — Newcomer, Intermediate, Expert
- **7 container types** — 20' and 40' dry, 40' high cube, reefer, open top, flat rack, tank (dangerous goods)
- **3 routes** — Shanghai → Le Havre (direct), Ho Chi Minh City → Singapore → Le Havre (transshipment), Guayaquil/Posorja → Antwerp-Bruges (reefer)
- **11 Incoterms 2020** — risk ▲ and cost ● transfer points; full-screen transfer moment (≈ 3 s on mobile, Skip button)
- "What happens next?" questions, documents to check (Levels 2–3), final quiz, summary with points to work on and CSV download
- € and CO₂ counters in the top bar (indicative), nickname, results sent to the same Google Sheet as desktop with `version = mobile`

## Mobile rules (see `docs/HANDOFF.md`)
Scene ≥ 60 % of the height · narration ≤ 2 lines with fold/unfold · one surface at a time · sheets ≤ 50 % of the height · text ≥ 14 px, answers 16 px, touch targets ≥ 44 px · safe areas · only essential hotspots (plus documents and choices) · Level 1: max 2 essentials per step, Incoterm fixed (FOB).

## Project structure
Same files, keys and ids as the desktop repo, so content fixes can be carried over in either direction.
```
index.html              the built game (single self-contained file)
src/engine.html         engine + CONFIG; mobile overrides = "[1b] MOBILE" CSS block + JS lines tagged MOBILE
src/content/global.json menu texts, Bob's intro, containers, routes, Incoterms, glossary, verification list, final quiz, footprint
src/content/stepNN.json one file per step, all 3 levels
src/build.py            merges engine + content → dist/container-journey_v0.3.html
docs/                   HANDOFF (start here), RESULTS_SETUP + apps-script.gs (Google Sheet results)
vercel.json             static hosting (no build command)
```

## Editing
1. Change texts in `src/content/*.json` (no code needed). Mini-syntax: `[[term]]` glossary link, `[TO VERIFY:vNN]` verification flag, `**bold**`, `{pol}` / `{cargo}` / `{incoterm}` … placeholders.
2. Rebrand in the `CONFIG` block of `src/engine.html` (company name, logo text, colours, game title, Bob's name, results endpoint, Level 1 Incoterm).
3. Rebuild: `python3 src/build.py`, then copy `dist/container-journey_v0.3.html` to `index.html`.

The build checks that every `[TO VERIFY]` id exists in the verification list and every `[[term]]` exists in the glossary.

## Carrying fixes between the two repos
- **Content** (`src/content/*.json`): same structure. Mobile-only text changes (shorter narration, one-line facts, one-sentence glossary, one Level 1 essential) are listed in `docs/HANDOFF.md`; any other content fix can be copied as is.
- **Engine** (`src/engine.html`): desktop logic fixes can be copied over; keep the `[1b] MOBILE` CSS block and the lines tagged `MOBILE`.

## Before production use
All companies, vessels, references and figures are fictional or illustrative. Every item flagged **TO VERIFY** (list in the game: ☰ → Verification list) must be validated by a qualified colleague. Set `showVerifyMarkers: false` in `CONFIG` once validated.

Built entirely with Claude (Anthropic) for an AI course project.
