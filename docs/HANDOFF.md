# Bob's Adventure — Mobile · handoff v0.1-mobile

Read this file first. Origin: [robing-jpg/bob-s-adventure](https://github.com/robing-jpg/bob-s-adventure) (desktop), copied from `main` @ `fe184b2` (**v0.5**, 20 Nov 2026) + the results endpoint of `ed8fa73` without git history. The origin repo is never modified from this project. For everything not listed here (product decisions, v0.5 features, results set-up), the desktop HANDOFF of v0.5 applies; `docs/RESULTS_SETUP.md` and `docs/apps-script.gs` are unchanged copies.

## State (20 Nov 2026, v0.1-mobile)
- Live: https://bob-s-adventure-mobile-version.vercel.app (Vercel, preset "Other", no build command; every push to `main` redeploys).
- Build: `python3 src/build.py` → `dist/container-journey_v0.3.html` → copy to `index.html`, commit, push to `main` of `robing-jpg/bob-s-adventure-mobile-version` (check `git remote -v` first).
- Target: landscape phones 640×360, 740×360, 844×390, 915×412. Portrait (≤ 1024 px wide) shows "Turn your phone" with Bob.
- Title "Bob's Adventure — Mobile" (`CONFIG.appTitle` + `<title>`), `CONFIG.platform = "mobile"`.

## Where the mobile changes live
- **CSS:** one block `[1b] MOBILE` at the end of the styles in `src/engine.html`. It overrides the shared desktop rules.
- **JS:** lines tagged `MOBILE` in `src/engine.html` — hotspot filter and Level 1 cap (`essAll`, `essentials`, `isEss`, `mobileHs`), `placeHs` (no overlap, clear of narration and fact), narration "…" clamp, dossier 2 bullets, compact meter, results `version`, nickname keyboard, one-surface observer, rotate screen.
- **Content:** same files, keys and ids as desktop. Mobile-only text edits are listed below; everything else is identical to v0.5, so desktop content fixes can be copied as is (re-apply the shortenings only if a desktop fix touches the same text).

## Mobile rules (feedback of 20 Nov)
| Rule | How |
|---|---|
| Same font and size for every answer, no clue before the click | `text-size-adjust:100%` (Android font boosting / iOS landscape inflation enlarged the longest answer); `.opt` 16 px, one grid (`grid-auto-rows:1fr`), glossary links not bold in answers; `.right` only after answering; order shuffled; v0.5 already balanced lengths (0 of 87 sets above 20 %) |
| Scene ≥ 60 % of the height | top bar 44 px + action bar 52 px → stage 73 % at 360 px high |
| Narration ≤ 2 lines, fold/unfold | 2-line clamp; "–/▸" folds or unfolds; "…" appears only if the text is longer |
| One surface at a time | `body.surface` hides narration and fact while a sheet, document, transfer moment or popover is open |
| Sheets ≤ 50 % of the height | `max-height:50dvh`, internal scroll, compact sticky header |
| Text ≥ 14 px, answers 16 px, targets ≥ 44 px | checked by the test script on every scene (exceptions: inline glossary terms and TO VERIFY chips, journey dots with an enlarged tap area) |
| Safe areas | `viewport-fit=cover` + `env(safe-area-inset-*)` on top bar, action bar, sheets, documents, hotspots, transfer Skip |
| Documents | paper on the left, explanation + check on the right: nothing covers the paper |
| Transfer moment | ≈ 3 s on mobile (token 0.35–1.35 s, title 1.45 s, button 1.9 s), white Skip button 44 px, definition line visible |
| Cost & CO₂ | two compact pills in the top bar (`€ 1.2k`, `CO₂ 0.4t`), tap → detail sheet |
| Nickname | 16 px field (no iOS zoom), `enterkeyhint="done"`, no auto-capitalise; scrolled to the centre on focus and on keyboard resize |
| Results | record `version = "mobile"` (+ `build: "v0.1-mobile"`), same Google Sheet as desktop (column `app_version`), CSV has a `version` column |

## What was removed or shortened (feedback 3 and 4)
- **Hotspots not rendered on mobile** (engine filter; still in the JSON): every hotspot that is not essential at the current level, unless it opens a document or a choice. Per step (levels where hidden):
  1 Shipper / forwarder (L2–3), Booking desk, Freight rate, Empty depot (L2–3), Empty handler, PTI & set point, EIR, Detention clock (L1) · 2 Shipper, Truck & driver (L2–3), The goods, Load centre (L2–3), Lashing check (L1), DG labels, Door markings, Weighbridge · 3 Port deadline (L2–3), Export terminal, Sea bridge, Road limits, Genset, Pre-advice (L1) · 4 Customs broker, EU customs (ICS2) · 5 Clocks switch (L2–3), Yard crane (RTG), Reefer plug · 6 Quay crane (L2–3), Vessel, Lashing (L1), Reefer plugged · 7 Cape route (L2–3), Weather & lashing, Transit time · 8 Discharge (L2–3), Demurrage clock (L2–3), Customs risk check, Plugged again · 9 No original? (L2–3) · 10 Gate-out (L2–3), Detention clock (L2–3) · 11 Damage & claims (L2–3), Return depot, Wash & PTI, Detention stops.
  To bring one back, add the level to its `essential` list.
- **Level 1 essentials ≤ 2:** step 2 "Lashing check" is now essential at L2–L3 only (JSON). Step 7: engine cap keeps the route/container-specific ones first, so a reefer on the transshipment route opens "Transshipment hub" + "Reefer monitoring" ("Suez / Cape" is not shown in that one case).
- **Narration** (50 texts): Level 1 = one short sentence, Levels 2–3 = max two (incl. 5 Level 3 incidents). Removed details were secondary ("Heavy boxes low…", "A lifting machine puts me on the truck", "It's like showing my ticket…") or already in an essential hotspot.
- **Striking facts** (26 texts): one line each; all figures and TO VERIFY flags kept.
- **Step file (dossier):** 2 bullets per tab on screen (engine; the JSON keeps all bullets).
- **Glossary:** 14 definitions rewritten as one sentence (same information).
- **Not removed:** learning objectives, documents, questions, final quiz, every `[TO VERIFY]` (90 ids, 600 occurrences — same as v0.5).

## Open items
1. Expert validation of all TO VERIFY items (v01–v93), especially cost / CO₂ (v78–v93).
2. `CONFIG.resultsEndpoint` = the same Apps Script web app as desktop (copied from desktop commit `ed8fa73`). Mobile rows have `app_version = mobile`; for a separate `version` column, add it to `docs/apps-script.gs` in the desktop repo. Agree the GDPR retention rule.
3. Real-device check (iOS Safari, Android Chrome): keyboard over the nickname field, safe areas, font boosting. Tests here are headless Chrome with mobile emulation.
4. Accessibility audit with a screen reader.

## Testing
Headless Playwright (`is_mobile`, `has_touch`), scripts not in the repo. Full 11-step journeys + quiz + summary + CSV, with checks on every scene (stage ≥ 60 %, narration ≤ 2 lines, sheet ≤ 50 %, narration hidden behind surfaces, hotspot overlaps, text < 14 px, targets < 44 px, equal answer buttons at 16 px), JS errors and portrait rotate screen:
- L1 reefer HCM→SIN→LEH (FOB fixed) @ 640×360 · L2 reefer GYE→ANR CIF @ 740×360 · L2 20' HCM→SIN→LEH CPT @ 844×390 · L1 40' HC SHA→LEH @ 915×412.
- Every beat of all 11 steps also scanned for hotspot overlaps (5 combinations incl. L3 flat rack and L2 tank).

## Rules to keep
- English content; neutral fictional brands; rebrand only via `CONFIG` in `src/engine.html`.
- Never invent figures: mark with `[TO VERIFY:vNN]` and add the item to `verification` in `global.json`. Keep every existing flag.
- Answer options: length spread ≤ 20 %, right answer not systematically the longest.
- When asked for a change, edit files and show only the modified parts.
- End every answer with an approximate token usage line (input / output / models).
