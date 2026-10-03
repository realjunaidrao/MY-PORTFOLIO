const SHEET_NAME = 'Sheet1';
const HEADERS = ['Timestamp', 'Name', 'Mobile', 'Gmail', 'Suggestion'];

function doGet() {
    return jsonResponse({ ok: true, message: 'Feedback endpoint is ready.' });
}

function doPost(e) {
    const parameters = e && e.parameter ? e.parameter : {};
    const name = String(parameters.name || '').trim();
    const mobile = String(parameters.mobile || '').trim();
    const email = String(parameters.gmail || '').trim();
    const suggestion = String(parameters.suggestion || '').trim();

    if (!name || !mobile || !email || !suggestion) {
        return jsonResponse({ ok: false, message: 'All form fields are required.' });
    }

    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000);

        const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        if (!spreadsheet) {
            throw new Error('Bind this script to the target spreadsheet before deployment.');
        }

        const sheet = spreadsheet.getSheetByName(SHEET_NAME);
        if (!sheet) {
            throw new Error('Sheet tab "' + SHEET_NAME + '" was not found.');
        }
        if (sheet.getLastRow() === 0) {
            sheet.appendRow(HEADERS);
        }

        sheet.appendRow([
            new Date(),
            safeCell(name),
            safeCell(mobile),
            safeCell(email),
            safeCell(suggestion)
        ]);

        return jsonResponse({ ok: true, message: 'Feedback saved.' });
    } catch (error) {
        return jsonResponse({ ok: false, message: error.message });
    } finally {
        if (lock.hasLock()) {
            lock.releaseLock();
        }
    }
}

function safeCell(value) {
    return /^[=+@-]/.test(value) ? "'" + value : value;
}

function jsonResponse(value) {
    return ContentService
        .createTextOutput(JSON.stringify(value))
        .setMimeType(ContentService.MimeType.JSON);
}