# Results tracking — Google Sheet set-up (about 10 minutes)

The game sends one record per finished journey (after the final quiz) to a Google Apps Script web app,
which writes it into a Google Sheet the team can open. Without this, results stay on the learner's device
and can be downloaded with **Download my results (CSV)** on the summary screen.

## What is recorded (GDPR)
Nickname (2–20 characters, no full name, no e-mail: an `@` is refused), date, level, container, route,
Incoterm, first-try score, documents score, final-quiz score, and for every scored question whether it was right
at the first try. The player sees this explanation under the nickname field. Nothing else is collected.
Decide who may open the sheet, how long rows are kept, and who handles correction/deletion requests.

## Steps
1. Create a Google Sheet (e.g. "Bob's Adventure — results") in a shared drive the trainers can access.
2. In the sheet: **Extensions → Apps Script**. Delete the sample code and paste `docs/apps-script.gs`. Save.
3. Optional secret: **Project settings → Script properties → Add** `TOKEN` = a random string.
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (the game is a static site and cannot sign in; with a TOKEN, other posts are ignored)
   - Deploy, authorise, copy the **Web app URL** (ends with `/exec`).
5. In `src/engine.html`, `CONFIG`:
   ```js
   resultsEndpoint: "https://script.google.com/macros/s/…/exec",
   resultsToken: "the same TOKEN as step 3 (or empty)",
   ```
6. `python3 src/build.py`, copy `dist/container-journey_v0.3.html` to `index.html`, commit, push (Vercel redeploys).
7. Test: open the `/exec` URL in a browser (it answers "…endpoint is running"), then finish one journey: a row appears
   in **Results** and one row per question in **Answers**.

## Reading the results
- **Results**: one line per journey — filter by nickname or date.
- **Answers**: one line per question — *Insert → Pivot table*: rows = nickname, columns = question, values = COUNTA of
  `correct_first_try` filtered on "no" → each person's points to work on; or rows = question to see the hardest ones.

## Notes
- The browser cannot read Apps Script's reply (opaque `no-cors` request); a record is marked "sent" when the network
  call succeeds. Unsent records are retried the next time the game opens, and duplicates are ignored by the script.
- A token in a public web page is not a real secret: it only filters out casual junk. For stronger control, use
  your company's LMS (SCORM / xAPI) instead — see the proposals in the v0.5 notes.
- After changing the script, use **Deploy → Manage deployments → Edit → New version**; the URL stays the same.
