// File: laporanNilai.js

/**
 * Mengambil data laporan nilai hasil JOIN antara sheet Nilai, Siswa, dan Guru
 * Beserta daftar filter unik untuk Mapel, Guru, dan Siswa
 */
function getLaporanNilai() {
  var sheetNilai = getSheet("Nilai");
  if (!sheetNilai) return { data: [], filterOptions: { siswa: [], guru: [], mapel: [] } };
  var dataNilai = sheetNilai.getDataRange().getValues();
  if (dataNilai.length > 0) dataNilai.shift(); // Hapus baris header

  // 1. Ambil & Mapping Data Siswa
  var sheetSiswa = getSheet("Siswa");
  var dataSiswa = sheetSiswa ? sheetSiswa.getDataRange().getValues() : [];
  if (dataSiswa.length > 0) dataSiswa.shift();
  var siswaMap = {};
  var listSiswa = [];
  dataSiswa.forEach(function(row) {
    var id = row[0].toString();
    var namaSiswa = row[1] + " (" + row[2] + " " + row[3] + ")";
    siswaMap[id] = namaSiswa;
    listSiswa.push({ id: id, nama: namaSiswa });
  });

  // 2. Ambil & Mapping Data Guru
  var sheetGuru = getSheet("Guru");
  var dataGuru = sheetGuru ? sheetGuru.getDataRange().getValues() : [];
  if (dataGuru.length > 0) dataGuru.shift();
  var guruMap = {};
  var listGuru = [];
  dataGuru.forEach(function(row) {
    var id = row[0].toString();
    var namaGuru = row[1];
    var mapel = row[2];
    guruMap[id] = { nama: namaGuru, mapel: mapel };
    listGuru.push({ id: id, nama: namaGuru });
  });

  // 3. Ambil Data Mapel dari Sheet Mapel untuk Filter
  var sheetMapel = getSheet("Mapel");
  var dataMapel = sheetMapel ? sheetMapel.getDataRange().getValues() : [];
  if (dataMapel.length > 0) dataMapel.shift();
  
  var setMapel = {};
  dataMapel.forEach(function(row) {
    var namaMapel = row[1];
    if (namaMapel && namaMapel.toString().trim() !== "") {
      setMapel[namaMapel.toString().trim()] = true;
    }
  });

  // Jika Sheet Mapel kosong, fallback mengambil mapel dari data Guru
  if (Object.keys(setMapel).length === 0) {
    dataGuru.forEach(function(row) {
      if (row[2] && row[2].toString().trim() !== "") {
        setMapel[row[2].toString().trim()] = true;
      }
    });
  }

  var listMapel = Object.keys(setMapel).sort();

  // 3. Gabungkan Data (In-Memory JOIN)
  var reportData = dataNilai.map(function(row, idx) {
    var idNilai  = row[0];
    var siswaId  = row[1].toString();
    var guruId   = row[2].toString();
    var nilai    = Number(row[3]) || 0;
    var predikat = row[4] || hitungPredikat(nilai);

    var namaSiswa = siswaMap[siswaId] || "Siswa Tidak Ditemukan";
    var infoGuru  = guruMap[guruId] || { nama: "Guru Tidak Ditemukan", mapel: "-" };

    return {
      no: idx + 1,
      idNilai: idNilai,
      siswaId: siswaId,
      namaSiswa: namaSiswa,
      guruId: guruId,
      namaGuru: infoGuru.nama,
      mapel: infoGuru.mapel,
      nilai: nilai,
      predikat: predikat
    };
  });

  return {
    data: reportData,
    filterOptions: {
      siswa: listSiswa,
      guru: listGuru,
      mapel: listMapel
    }
  };
}
