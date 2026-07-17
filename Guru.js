// File: Guru.gs

function getGuru() {
  var sheet = getSheet("Guru");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift(); // Hapus baris header
  return data;
}

function createGuru(obj) {
  var sheet = getSheet("Guru");
  var id = generateId("G");
  sheet.appendRow([id, obj.nama, obj.mapel, obj.nohp]);
  return "Data Guru berhasil ditambahkan!";
}

function updateGuru(obj) {
  var sheet = getSheet("Guru");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === obj.id.toString()) {
      var rowIndex = i + 1; 
      sheet.getRange(rowIndex, 2).setValue(obj.nama);   
      sheet.getRange(rowIndex, 3).setValue(obj.mapel);  
      sheet.getRange(rowIndex, 4).setValue(obj.nohp); 
      return "Data Guru berhasil diperbarui!";
    }
  }
  return "Guru tidak ditemukan.";
}

function deleteGuru(id) {
  var sheet = getSheet("Guru");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === id.toString()) {
      sheet.deleteRow(i + 1);
      return "Data Guru berhasil dihapus!";
    }
  }
  return "Guru tidak ditemukan.";
}