// File: Siswa.gs
// Pastikan tidak ada fungsi getSpreadsheet() di sini, kita pakai getSheet() dari Code.gs

function getSiswa() {
  var sheet = getSheet("Siswa");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift(); // Hapus baris header
  return data;
}

function createSiswa(obj) {
  var sheet = getSheet("Siswa");
  var id = generateId("S");
  sheet.appendRow([id, obj.nama, obj.kelas, obj.jurusan]);
  return "Data Siswa berhasil ditambahkan!";
}

function updateSiswa(obj) {
  var sheet = getSheet("Siswa");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === obj.id.toString()) {
      var rowIndex = i + 1; 
      sheet.getRange(rowIndex, 2).setValue(obj.nama);   
      sheet.getRange(rowIndex, 3).setValue(obj.kelas);  
      sheet.getRange(rowIndex, 4).setValue(obj.jurusan); 
      return "Data Siswa berhasil diperbarui!";
    }
  }
  return "Siswa tidak ditemukan.";
}

function deleteSiswa(id) {
  var sheet = getSheet("Siswa");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === id.toString()) {
      sheet.deleteRow(i + 1);
      return "Data Siswa berhasil dihapus!";
    }
  }
  return "Siswa tidak ditemukan.";
}