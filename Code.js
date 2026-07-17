// ==========================================
// KONFIGURASI
// ==========================================
var SPREADSHEET_ID = "1m9322irDvlHy_YtC7fy_R9ykuAttYXQLmfZYCX5ws2Q"; // Ganti dengan ID Anda

function getSheet(sheetName) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
}

function generateId(prefix) {
  return prefix + "-" + new Date().getTime();
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
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}

// ==========================================
// AUTENTIKASI
// ==========================================
function checkLogin(username, password) {
  try {
    var sheet = getSheet("Users");
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == username && data[i][1] == password) {
        return { success: true, message: "Login berhasil!" };
      }
    }
    return { success: false, message: "Username atau Password salah." };
  } catch (error) {
    return { success: false, message: "Error Server: " + error.message };
  }
}