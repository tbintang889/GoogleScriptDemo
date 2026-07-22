// File: Mapel.js

/**
 * Mengambil seluruh data Mata Pelajaran dari sheet Mapel
 */
function getMapel() {
  var sheet = getSheet("Mapel");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift(); // Hapus header
  return data;
}

/**
 * Menambahkan data Mata Pelajaran baru
 */
function createMapel(obj) {
  var sheet = getSheet("Mapel");
  if (!sheet) {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    sheet = ss.insertSheet("Mapel");
    sheet.appendRow(["ID", "Nama Mapel", "Kode Mapel"]);
  }
  var id = generateId("M");
  sheet.appendRow([id, obj.nama, obj.kode]);
  return "Data Mata Pelajaran berhasil ditambahkan!";
}

/**
 * Perbarui data Mata Pelajaran
 */
function updateMapel(obj) {
  var sheet = getSheet("Mapel");
  if (!sheet) return "Sheet Mapel tidak ditemukan.";
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === obj.id.toString()) {
      var rowIndex = i + 1;
      sheet.getRange(rowIndex, 2).setValue(obj.nama);
      sheet.getRange(rowIndex, 3).setValue(obj.kode);
      return "Data Mata Pelajaran berhasil diperbarui!";
    }
  }
  return "Data Mata Pelajaran tidak ditemukan.";
}

/**
 * Hapus data Mata Pelajaran
 */
function deleteMapel(id) {
  var sheet = getSheet("Mapel");
  if (!sheet) return "Sheet Mapel tidak ditemukan.";
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === id.toString()) {
      sheet.deleteRow(i + 1);
      return "Data Mata Pelajaran berhasil dihapus!";
    }
  }
  return "Data Mata Pelajaran tidak ditemukan.";
}

/**
 * Helper untuk mengambil opsi nama mapel (digunakan di dropdown Form Guru)
 */
function getOptionsMapel() {
  var sheet = getSheet("Mapel");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data.map(function(r) {
    return { id: r[0], nama: r[1], kode: r[2] };
  });
}
