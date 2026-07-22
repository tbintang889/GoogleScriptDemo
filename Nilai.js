// File: Nilai.js

/**
 * Mengambil seluruh data Nilai ter-JOIN dengan data Siswa dan Guru
 */
function getNilai() {
  var sheetNilai = getSheet("Nilai");
  if (!sheetNilai) return [];
  var dataNilai = sheetNilai.getDataRange().getValues();
  if (dataNilai.length > 0) dataNilai.shift(); // Hapus header

  // 1. Ambil data Siswa untuk lookup
  var sheetSiswa = getSheet("Siswa");
  var dataSiswa = sheetSiswa ? sheetSiswa.getDataRange().getValues() : [];
  if (dataSiswa.length > 0) dataSiswa.shift();
  var siswaMap = {};
  dataSiswa.forEach(function(row) {
    siswaMap[row[0].toString()] = { 
      nama: row[1], 
      kelas: row[2], 
      jurusan: row[3] 
    };
  });

  // 2. Ambil data Guru untuk lookup
  var sheetGuru = getSheet("Guru");
  var dataGuru = sheetGuru ? sheetGuru.getDataRange().getValues() : [];
  if (dataGuru.length > 0) dataGuru.shift();
  var guruMap = {};
  dataGuru.forEach(function(row) {
    guruMap[row[0].toString()] = { 
      nama: row[1], 
      mapel: row[2] 
    };
  });

  // 3. Gabungkan (JOIN) Data Nilai dengan Siswa & Guru
  return dataNilai.map(function(row) {
    var id = row[0];
    var siswaId = row[1].toString();
    var guruId = row[2].toString();
    var nilai = row[3];
    var predikat = row[4] || hitungPredikat(nilai);

    var infoSiswa = siswaMap[siswaId] || { nama: "Siswa Tidak Ditemukan", kelas: "-", jurusan: "-" };
    var infoGuru = guruMap[guruId] || { nama: "Guru Tidak Ditemukan", mapel: "-" };

    return [
      id,
      siswaId,
      infoSiswa.nama + " (" + infoSiswa.kelas + " " + infoSiswa.jurusan + ")",
      guruId,
      infoGuru.nama + " - " + infoGuru.mapel,
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
  if (n >= 88) return "A (Sangat Baik)";
  if (n >= 78) return "B (Baik)";
  if (n >= 68) return "C (Cukup)";
  return "D (Perlu Bimbingan)";
}

/**
 * Mengambil daftar opsi Siswa dan Guru untuk ditaruh di Dropdown Form
 */
function getOptionsSiswaDanGuru() {
  var sheetSiswa = getSheet("Siswa");
  var dataSiswa = sheetSiswa ? sheetSiswa.getDataRange().getValues() : [];
  if (dataSiswa.length > 0) dataSiswa.shift();
  var listSiswa = dataSiswa.map(function(r) {
    return { id: r[0], nama: r[1] + " (" + r[2] + " " + r[3] + ")" };
  });

  var sheetGuru = getSheet("Guru");
  var dataGuru = sheetGuru ? sheetGuru.getDataRange().getValues() : [];
  if (dataGuru.length > 0) dataGuru.shift();
  var listGuru = dataGuru.map(function(r) {
    return { id: r[0], nama: r[1] + " - " + r[2] };
  });

  return { siswa: listSiswa, guru: listGuru };
}

/**
 * Menambahkan data nilai baru
 */
function createNilai(obj) {
  var sheet = getSheet("Nilai");
  if (!sheet) {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    sheet = ss.insertSheet("Nilai");
    sheet.appendRow(["ID", "Siswa ID", "Guru ID", "Nilai", "Predikat"]);
  }
  var id = generateId("N");
  var predikat = obj.predikat || hitungPredikat(obj.nilai);
  sheet.appendRow([id, obj.siswa_id, obj.guru_id, obj.nilai, predikat]);
  return "Data Nilai berhasil ditambahkan!";
}

/**
 * Perbarui data nilai
 */
function updateNilai(obj) {
  var sheet = getSheet("Nilai");
  if (!sheet) return "Sheet Nilai tidak ditemukan.";
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === obj.id.toString()) {
      var rowIndex = i + 1;
      var predikat = obj.predikat || hitungPredikat(obj.nilai);
      sheet.getRange(rowIndex, 2).setValue(obj.siswa_id);
      sheet.getRange(rowIndex, 3).setValue(obj.guru_id);
      sheet.getRange(rowIndex, 4).setValue(obj.nilai);
      sheet.getRange(rowIndex, 5).setValue(predikat);
      return "Data Nilai berhasil diperbarui!";
    }
  }
  return "Data Nilai tidak ditemukan.";
}

/**
 * Hapus data nilai
 */
function deleteNilai(id) {
  var sheet = getSheet("Nilai");
  if (!sheet) return "Sheet Nilai tidak ditemukan.";
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === id.toString()) {
      sheet.deleteRow(i + 1);
      return "Data Nilai berhasil dihapus!";
    }
  }
  return "Data Nilai tidak ditemukan.";
}
