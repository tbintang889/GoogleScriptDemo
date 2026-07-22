// ==========================================
// KONFIGURASI
// ==========================================
var SPREADSHEET_ID = "";

function getSpreadsheetId() {
  var configuredId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (configuredId) {
    SPREADSHEET_ID = configuredId;
  }
  return SPREADSHEET_ID;
}

function setupConfig() {
  PropertiesService.getScriptProperties().setProperties({
    SPREADSHEET_ID: 'ISI_ID_DISINI',
    APP_NAME: 'SIAKAD'
  });
  return { success: true, message: 'Konfigurasi tersimpan. Ganti nilai SPREADSHEET_ID dengan ID spreadsheet Anda.' };
}

function getConfiguredSpreadsheet() {
  var spreadsheetId = getSpreadsheetId();
  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID belum dikonfigurasi. Jalankan setupConfig() sekali dan isi ID spreadsheet Anda.');
  }
  return SpreadsheetApp.openById(spreadsheetId);
}

function getSheet(sheetName) {
  var spreadsheet = getConfiguredSpreadsheet();
  return spreadsheet.getSheetByName(sheetName);
}

function ensureSheet(sheetName, headers) {
  var sheet = getSheet(sheetName);
  if (!sheet) {
    sheet = getConfiguredSpreadsheet().insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
    }
  }
  return sheet;
}

function generateId(prefix) {
  return prefix + "-" + new Date().getTime();
}

function hashPassword(password) {
  var normalizedPassword = String(password || '').trim();
  if (!normalizedPassword) return '';
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, normalizedPassword);
  return bytes.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

function isPasswordValid(storedPassword, providedPassword) {
  var normalizedStored = String(storedPassword || '').trim();
  var normalizedProvided = String(providedPassword || '').trim();
  if (!normalizedStored || !normalizedProvided) return false;
  if (normalizedStored.length === 64) {
    return normalizedStored === hashPassword(normalizedProvided);
  }
  return normalizedStored === normalizedProvided;
}

function buildResult(success, message) {
  return { success: success, message: message };
}

// ==========================================
// ENTRY POINT WEB APP
// ==========================================
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Aplikasi Sederhana')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename)
    .evaluate()
    .getContent();
}

// ==========================================
// AUTENTIKASI
// ==========================================
function checkLogin(username, password) {
  try {
    if (typeof username === 'object' && username !== null && password === undefined) {
      var creds = username;
      username = creds.username;
      password = creds.password;
    }

    var sheet = ensureSheet('Users', ['username', 'password']);
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').trim() === String(username || '').trim()) {
        if (isPasswordValid(data[i][1], password)) {
          return buildResult(true, 'Login berhasil!');
        }
      }
    }
    return buildResult(false, 'Username atau Password salah.');
  } catch (error) {
    return buildResult(false, 'Error Server: ' + error.message);
  }
}