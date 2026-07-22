// File: Mapel.js

/**
 * Mengambil seluruh data Mata Pelajaran dari sheet Mapel
 */
function getMapel() {
  var sheet = getSheet('Mapel');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data;
}

/**
 * Menambahkan data Mata Pelajaran baru
 */
function createMapel(obj) {
  try {
    if (!obj || !String(obj.nama || '').trim()) {
      return { success: false, message: 'Nama mata pelajaran tidak boleh kosong.' };
    }
    var sheet = ensureSheet('Mapel', ['ID', 'Nama Mapel', 'Kode Mapel']);
    var id = generateId('M');
    sheet.appendRow([id, String(obj.nama || '').trim(), String(obj.kode || '').trim()]);
    return { success: true, message: 'Data Mata Pelajaran berhasil ditambahkan!' };
  } catch (error) {
    return { success: false, message: 'Gagal menambah mapel: ' + error.message };
  }
}

/**
 * Perbarui data Mata Pelajaran
 */
function updateMapel(obj) {
  try {
    if (!obj || !String(obj.id || '').trim()) {
      return { success: false, message: 'ID mapel tidak valid.' };
    }
    var sheet = ensureSheet('Mapel', ['ID', 'Nama Mapel', 'Kode Mapel']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(obj.id || '').toString()) {
        var rowIndex = i + 1;
        sheet.getRange(rowIndex, 2).setValue(String(obj.nama || '').trim());
        sheet.getRange(rowIndex, 3).setValue(String(obj.kode || '').trim());
        return { success: true, message: 'Data Mata Pelajaran berhasil diperbarui!' };
      }
    }
    return { success: false, message: 'Data Mata Pelajaran tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal memperbarui mapel: ' + error.message };
  }
}

/**
 * Hapus data Mata Pelajaran
 */
function deleteMapel(id) {
  try {
    var sheet = ensureSheet('Mapel', ['ID', 'Nama Mapel', 'Kode Mapel']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(id || '').toString()) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Data Mata Pelajaran berhasil dihapus!' };
      }
    }
    return { success: false, message: 'Data Mata Pelajaran tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus mapel: ' + error.message };
  }
}

/**
 * Helper untuk mengambil opsi nama mapel (digunakan di dropdown Form Guru)
 */
function getOptionsMapel() {
  var sheet = getSheet('Mapel');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data.map(function(r) {
    return { id: r[0], nama: r[1], kode: r[2] };
  });
}
