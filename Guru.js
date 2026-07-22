// File: Guru.js

function getGuru() {
  var sheet = getSheet('Guru');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data;
}

function createGuru(obj) {
  try {
    if (!obj || !String(obj.nama || '').trim()) {
      return { success: false, message: 'Nama guru tidak boleh kosong.' };
    }
    var sheet = ensureSheet('Guru', ['ID', 'Nama', 'Mapel', 'No HP']);
    var id = generateId('G');
    sheet.appendRow([id, String(obj.nama || '').trim(), String(obj.mapel || '').trim(), String(obj.nohp || '').trim()]);
    return { success: true, message: 'Data Guru berhasil ditambahkan!' };
  } catch (error) {
    return { success: false, message: 'Gagal menambah guru: ' + error.message };
  }
}

function updateGuru(obj) {
  try {
    if (!obj || !String(obj.id || '').trim()) {
      return { success: false, message: 'ID guru tidak valid.' };
    }
    var sheet = ensureSheet('Guru', ['ID', 'Nama', 'Mapel', 'No HP']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(obj.id || '').toString()) {
        var rowIndex = i + 1;
        sheet.getRange(rowIndex, 2).setValue(String(obj.nama || '').trim());
        sheet.getRange(rowIndex, 3).setValue(String(obj.mapel || '').trim());
        sheet.getRange(rowIndex, 4).setValue(String(obj.nohp || '').trim());
        return { success: true, message: 'Data Guru berhasil diperbarui!' };
      }
    }
    return { success: false, message: 'Guru tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal memperbarui guru: ' + error.message };
  }
}

function deleteGuru(id) {
  try {
    var sheet = ensureSheet('Guru', ['ID', 'Nama', 'Mapel', 'No HP']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(id || '').toString()) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Data Guru berhasil dihapus!' };
      }
    }
    return { success: false, message: 'Guru tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus guru: ' + error.message };
  }
}