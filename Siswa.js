// File: Siswa.js

function getSiswa() {
  var sheet = getSheet('Siswa');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data;
}

function createSiswa(obj) {
  try {
    if (!obj || !String(obj.nama || '').trim()) {
      return { success: false, message: 'Nama siswa tidak boleh kosong.' };
    }
    var sheet = ensureSheet('Siswa', ['ID', 'Nama', 'Kelas', 'Jurusan']);
    var id = generateId('S');
    sheet.appendRow([id, String(obj.nama || '').trim(), String(obj.kelas || '').trim(), String(obj.jurusan || '').trim()]);
    return { success: true, message: 'Data Siswa berhasil ditambahkan!' };
  } catch (error) {
    return { success: false, message: 'Gagal menambah siswa: ' + error.message };
  }
}

function updateSiswa(obj) {
  try {
    if (!obj || !String(obj.id || '').trim()) {
      return { success: false, message: 'ID siswa tidak valid.' };
    }
    var sheet = ensureSheet('Siswa', ['ID', 'Nama', 'Kelas', 'Jurusan']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(obj.id || '').toString()) {
        var rowIndex = i + 1;
        sheet.getRange(rowIndex, 2).setValue(String(obj.nama || '').trim());
        sheet.getRange(rowIndex, 3).setValue(String(obj.kelas || '').trim());
        sheet.getRange(rowIndex, 4).setValue(String(obj.jurusan || '').trim());
        return { success: true, message: 'Data Siswa berhasil diperbarui!' };
      }
    }
    return { success: false, message: 'Siswa tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal memperbarui siswa: ' + error.message };
  }
}

function deleteSiswa(id) {
  try {
    var sheet = ensureSheet('Siswa', ['ID', 'Nama', 'Kelas', 'Jurusan']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(id || '').toString()) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Data Siswa berhasil dihapus!' };
      }
    }
    return { success: false, message: 'Siswa tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus siswa: ' + error.message };
  }
}