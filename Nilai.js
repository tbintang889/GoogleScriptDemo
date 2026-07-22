// File: Nilai.js

/**
 * Mengambil seluruh data Nilai ter-JOIN dengan data Siswa dan Guru
 */
function getNilai() {
  var sheetNilai = getSheet('Nilai');
  if (!sheetNilai) return [];
  var dataNilai = sheetNilai.getDataRange().getValues();
  if (dataNilai.length > 0) dataNilai.shift();

  var sheetSiswa = getSheet('Siswa');
  var dataSiswa = sheetSiswa ? sheetSiswa.getDataRange().getValues() : [];
  if (dataSiswa.length > 0) dataSiswa.shift();
  var siswaMap = {};
  dataSiswa.forEach(function(row) {
    siswaMap[String(row[0] || '').toString()] = {
      nama: row[1],
      kelas: row[2],
      jurusan: row[3]
    };
  });

  var sheetGuru = getSheet('Guru');
  var dataGuru = sheetGuru ? sheetGuru.getDataRange().getValues() : [];
  if (dataGuru.length > 0) dataGuru.shift();
  var guruMap = {};
  dataGuru.forEach(function(row) {
    guruMap[String(row[0] || '').toString()] = {
      nama: row[1],
      mapel: row[2]
    };
  });

  return dataNilai.map(function(row) {
    var id = row[0];
    var siswaId = String(row[1] || '').toString();
    var guruId = String(row[2] || '').toString();
    var nilai = row[3];
    var predikat = row[4] || hitungPredikat(nilai);

    var infoSiswa = siswaMap[siswaId] || { nama: 'Siswa Tidak Ditemukan', kelas: '-', jurusan: '-' };
    var infoGuru = guruMap[guruId] || { nama: 'Guru Tidak Ditemukan', mapel: '-' };

    return [
      id,
      siswaId,
      infoSiswa.nama + ' (' + infoSiswa.kelas + ' ' + infoSiswa.jurusan + ')',
      guruId,
      infoGuru.nama + ' - ' + infoGuru.mapel,
      nilai,
      predikat
    ];
  });
}

/**
 * Menghitung predikat berdasarkan angka nilai
 */
function hitungPredikat(nilai) {
  var n = Number(nilai);
  if (n >= 88) return 'A (Sangat Baik)';
  if (n >= 78) return 'B (Baik)';
  if (n >= 68) return 'C (Cukup)';
  return 'D (Perlu Bimbingan)';
}

/**
 * Mengambil daftar opsi Siswa dan Guru untuk ditaruh di Dropdown Form
 */
function getOptionsSiswaDanGuru() {
  var sheetSiswa = getSheet('Siswa');
  var dataSiswa = sheetSiswa ? sheetSiswa.getDataRange().getValues() : [];
  if (dataSiswa.length > 0) dataSiswa.shift();
  var listSiswa = dataSiswa.map(function(r) {
    return { id: r[0], nama: r[1] + ' (' + r[2] + ' ' + r[3] + ')' };
  });

  var sheetGuru = getSheet('Guru');
  var dataGuru = sheetGuru ? sheetGuru.getDataRange().getValues() : [];
  if (dataGuru.length > 0) dataGuru.shift();
  var listGuru = dataGuru.map(function(r) {
    return { id: r[0], nama: r[1] + ' - ' + r[2] };
  });

  return { siswa: listSiswa, guru: listGuru };
}

/**
 * Menambahkan data nilai baru
 */
function createNilai(obj) {
  try {
    if (!obj || !obj.siswa_id || !obj.guru_id) {
      return { success: false, message: 'Siswa dan guru harus dipilih.' };
    }
    var nilaiNumber = Number(obj.nilai);
    if (isNaN(nilaiNumber)) {
      return { success: false, message: 'Nilai harus berupa angka.' };
    }
    var sheet = ensureSheet('Nilai', ['ID', 'Siswa ID', 'Guru ID', 'Nilai', 'Predikat']);
    var id = generateId('N');
    var predikat = obj.predikat || hitungPredikat(nilaiNumber);
    sheet.appendRow([id, String(obj.siswa_id || '').trim(), String(obj.guru_id || '').trim(), nilaiNumber, predikat]);
    return { success: true, message: 'Data Nilai berhasil ditambahkan!' };
  } catch (error) {
    return { success: false, message: 'Gagal menambah nilai: ' + error.message };
  }
}

/**
 * Perbarui data nilai
 */
function updateNilai(obj) {
  try {
    if (!obj || !String(obj.id || '').trim()) {
      return { success: false, message: 'ID nilai tidak valid.' };
    }
    var sheet = ensureSheet('Nilai', ['ID', 'Siswa ID', 'Guru ID', 'Nilai', 'Predikat']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(obj.id || '').toString()) {
        var rowIndex = i + 1;
        var nilaiNumber = Number(obj.nilai);
        var predikat = obj.predikat || hitungPredikat(nilaiNumber);
        sheet.getRange(rowIndex, 2).setValue(String(obj.siswa_id || '').trim());
        sheet.getRange(rowIndex, 3).setValue(String(obj.guru_id || '').trim());
        sheet.getRange(rowIndex, 4).setValue(nilaiNumber);
        sheet.getRange(rowIndex, 5).setValue(predikat);
        return { success: true, message: 'Data Nilai berhasil diperbarui!' };
      }
    }
    return { success: false, message: 'Data Nilai tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal memperbarui nilai: ' + error.message };
  }
}

/**
 * Hapus data nilai
 */
function deleteNilai(id) {
  try {
    var sheet = ensureSheet('Nilai', ['ID', 'Siswa ID', 'Guru ID', 'Nilai', 'Predikat']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(id || '').toString()) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Data Nilai berhasil dihapus!' };
      }
    }
    return { success: false, message: 'Data Nilai tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus nilai: ' + error.message };
  }
}
