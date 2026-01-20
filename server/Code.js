/**
 * Main Entry Point for Google Apps Script Web App
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Bạn cần điền ID spreadsheet của bạn vào đây

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'checkLogin') {
    return handleCheckLogin(e);
  } else if (action === 'getVocab') {
    return handleGetVocab(e);
  } else if (action === 'getGrammar') {
    return handleGetGrammar(e);
  } else if (action === 'getStats') {
    return handleGetStats(e);
  } else if (action === 'getAdminData') {
    return handleGetAdminData(e);
  } else if (action === 'getUserSubmissions') {
    return handleGetUserSubmissions(e);
  }

  return createJSONOutput({ success: false, message: 'Invalid action' });
}

function doPost(e) {
  try {
    // Parse body parameters
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;

    if (action === 'saveVocabulary') {
      return handleSaveVocabulary(contents);
    } else if (action === 'adminAction') {
      return handleAdminActions(contents);
    } else if (action === 'saveSubmission') {
      return handleSaveSubmission(contents);
    }

    return createJSONOutput({ success: false, message: 'Invalid action' });
  } catch (err) {
    return createJSONOutput({ success: false, message: 'Error: ' + err.toString() });
  }
}

function createJSONOutput(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Helper để lấy Sheet theo tên, nếu chưa có thì tạo mới
function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}
