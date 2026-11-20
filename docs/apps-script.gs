/**
 * Bob's Adventure — results collector (Google Apps Script, bound to a Google Sheet).
 * Paste this whole file into Extensions → Apps Script of the team's Google Sheet, then deploy it
 * as a web app (see docs/RESULTS_SETUP.md). The game POSTs one JSON record per finished journey.
 *
 * It writes two tabs:
 *   Results  — one row per finished journey (nickname, date, level, choices, scores, points to work on)
 *   Answers  — one row per scored question (right / wrong at the first try): filter or pivot by nickname
 *              to get each person's "points to work on".
 *
 * Optional shared secret: set a Script property TOKEN (Project settings → Script properties) and the
 * same value in CONFIG.resultsToken in src/engine.html. Records with a wrong token are ignored.
 */
const RESULTS_HEADERS = ['received_at', 'date', 'nickname', 'level', 'container', 'route', 'incoterm',
  'first_try', 'first_try_pct', 'documents', 'final_quiz', 'points_to_work_on', 'record_id', 'app_version'];
const ANSWERS_HEADERS = ['received_at', 'date', 'nickname', 'level', 'route', 'incoterm', 'question_id', 'question', 'correct_first_try', 'record_id'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const rec = JSON.parse(e.postData.contents);
    const token = PropertiesService.getScriptProperties().getProperty('TOKEN');
    if (token && rec.token !== token) return text_('ignored: bad token');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const results = sheet_(ss, 'Results', RESULTS_HEADERS), answers = sheet_(ss, 'Answers', ANSWERS_HEADERS);
    // ignore duplicates (the game retries unsent records)
    const ids = results.getRange(2, 13, Math.max(results.getLastRow() - 1, 1), 1).getValues().flat();
    if (ids.indexOf(rec.id) !== -1) return text_('duplicate');
    const now = new Date(), nick = clean_(rec.nickname).slice(0, 20);
    results.appendRow([now, rec.date, nick, rec.level, clean_(rec.container), clean_(rec.route), clean_(rec.incoterm),
      rec.firstTry, rec.firstTryPct, rec.documents, rec.quiz, clean_(rec.toReview).slice(0, 5000), rec.id, clean_(rec.version)]);
    const rows = (rec.questions || []).map(q => [now, rec.date, nick, rec.level, clean_(rec.route), clean_(rec.incoterm),
      clean_(q.id), clean_(q.label).slice(0, 500), q.ok ? 'yes' : 'no', rec.id]);
    if (rows.length) answers.getRange(answers.getLastRow() + 1, 1, rows.length, ANSWERS_HEADERS.length).setValues(rows);
    return text_('ok');
  } catch (err) {
    return text_('error: ' + err);
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to check that the deployment works.
function doGet() { return text_("Bob's Adventure results endpoint is running."); }

function sheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); }
  if (sh.getLastRow() === 0) { sh.appendRow(headers); sh.setFrozenRows(1); sh.getRange(1, 1, 1, headers.length).setFontWeight('bold'); }
  return sh;
}
// Neutralise spreadsheet formulas sent as text (e.g. "=HYPERLINK(...)") and trim.
function clean_(v) { v = String(v == null ? '' : v).trim(); return /^[=+\-@]/.test(v) ? "'" + v : v; }
function text_(s) { return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT); }
