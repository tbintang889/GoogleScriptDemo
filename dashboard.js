// File: dashboard.js

/**
 * Main Orchestrator: Menggabungkan seluruh data statistik untuk Dashboard
 */
function getDashboardSummary() {
  var raw = getDashboardRawData();

  return {
    kpi: calculateKpiStats(raw),
    siswaPerJurusan: calculateSiswaPerJurusan(raw.dataSiswa),
    mapelStats: calculateMapelStats(raw.dataNilai, raw.guruMap),
    guruStats: calculateGuruStats(raw.dataNilai, raw.guruMap),
    distribusiPredikat: calculateDistribusiPredikat(raw.dataNilai),
    top5Siswa: calculateTop5Siswa(raw.dataNilai, raw.siswaMap),
    recentNilai: calculateRecentNilai(raw.dataNilai, raw.siswaMap, raw.guruMap, 5)
  };
}

/**
 * 1. Helper Data Provider: Membaca & Memetakan Data Mentah dari Sheet
 */
function getDashboardRawData() {
  // Siswa
  var sheetSiswa = getSheet("Siswa");
  var dataSiswa = sheetSiswa ? sheetSiswa.getDataRange().getValues() : [];
  if (dataSiswa.length > 0) dataSiswa.shift();
  var siswaMap = {};
  dataSiswa.forEach(function(row) {
    var id = row[0].toString();
    siswaMap[id] = { nama: row[1], kelas: row[2], jurusan: row[3] || "Lainnya" };
  });

  // Guru
  var sheetGuru = getSheet("Guru");
  var dataGuru = sheetGuru ? sheetGuru.getDataRange().getValues() : [];
  if (dataGuru.length > 0) dataGuru.shift();
  var guruMap = {};
  dataGuru.forEach(function(row) {
    var id = row[0].toString();
    guruMap[id] = { nama: row[1], mapel: row[2] };
  });

  // Mapel
  var sheetMapel = getSheet("Mapel");
  var dataMapel = sheetMapel ? sheetMapel.getDataRange().getValues() : [];
  if (dataMapel.length > 0) dataMapel.shift();

  // Nilai
  var sheetNilai = getSheet("Nilai");
  var dataNilai = sheetNilai ? sheetNilai.getDataRange().getValues() : [];
  if (dataNilai.length > 0) dataNilai.shift();

  return {
    dataSiswa: dataSiswa,
    siswaMap: siswaMap,
    dataGuru: dataGuru,
    guruMap: guruMap,
    dataMapel: dataMapel,
    dataNilai: dataNilai
  };
}

/**
 * 2. Modul Analitis: Menghitung Kartu KPI Utama
 */
function calculateKpiStats(raw) {
  var totalSiswa = raw.dataSiswa.length;
  var totalGuru = raw.dataGuru.length;
  var totalMapel = raw.dataMapel.length;
  var totalPenilaian = raw.dataNilai.length;

  var sumNilai = 0;
  raw.dataNilai.forEach(function(row) {
    sumNilai += Number(row[3]) || 0;
  });

  var avgNilaiSekolah = totalPenilaian > 0 ? (sumNilai / totalPenilaian).toFixed(1) : 0;

  return {
    totalSiswa: totalSiswa,
    totalGuru: totalGuru,
    totalMapel: totalMapel,
    totalPenilaian: totalPenilaian,
    avgNilaiSekolah: Number(avgNilaiSekolah)
  };
}

/**
 * 3. Modul Analitis: Mengelompokkan Siswa Berdasarkan Jurusan
 */
function calculateSiswaPerJurusan(dataSiswa) {
  var result = {};
  dataSiswa.forEach(function(row) {
    var jurusan = row[3] || "Lainnya";
    result[jurusan] = (result[jurusan] || 0) + 1;
  });
  return result;
}

/**
 * 4. Modul Analitis: Rata-Rata Nilai per Mata Pelajaran
 */
function calculateMapelStats(dataNilai, guruMap) {
  var group = {};
  dataNilai.forEach(function(row) {
    var guruId = row[2].toString();
    var nilai = Number(row[3]) || 0;
    var infoGuru = guruMap[guruId] || { mapel: "Umum" };
    var mapelNama = infoGuru.mapel || "Umum";

    if (!group[mapelNama]) group[mapelNama] = { total: 0, count: 0 };
    group[mapelNama].total += nilai;
    group[mapelNama].count += 1;
  });

  var stats = [];
  for (var m in group) {
    var avg = (group[m].total / group[m].count).toFixed(1);
    stats.push({ mapel: m, avg: Number(avg), count: group[m].count });
  }
  return stats;
}

/**
 * 5. Modul Analitis: Aktivitas Input Nilai per Guru
 */
function calculateGuruStats(dataNilai, guruMap) {
  var group = {};
  dataNilai.forEach(function(row) {
    var guruId = row[2].toString();
    var infoGuru = guruMap[guruId] || { nama: "Guru " + guruId };
    group[infoGuru.nama] = (group[infoGuru.nama] || 0) + 1;
  });

  var stats = [];
  for (var g in group) {
    stats.push({ nama: g, totalInput: group[g] });
  }
  return stats;
}

/**
 * 6. Modul Analitis: Distribusi Predikat (A, B, C, D)
 */
function calculateDistribusiPredikat(dataNilai) {
  var dist = { A: 0, B: 0, C: 0, D: 0 };
  dataNilai.forEach(function(row) {
    var nilai = Number(row[3]) || 0;
    var predikat = row[4] || hitungPredikat(nilai);
    if (predikat.startsWith('A')) dist.A++;
    else if (predikat.startsWith('B')) dist.B++;
    else if (predikat.startsWith('C')) dist.C++;
    else if (predikat.startsWith('D')) dist.D++;
  });
  return dist;
}

/**
 * 7. Modul Analitis: Top 5 Siswa Berprestasi (Leaderboard)
 */
function calculateTop5Siswa(dataNilai, siswaMap) {
  var group = {};
  dataNilai.forEach(function(row) {
    var siswaId = row[1].toString();
    var nilai = Number(row[3]) || 0;
    var info = siswaMap[siswaId] || { nama: "Siswa " + siswaId, kelas: "-", jurusan: "-" };

    if (!group[siswaId]) {
      group[siswaId] = {
        nama: info.nama,
        kelasInfo: info.kelas + " " + info.jurusan,
        total: 0,
        count: 0
      };
    }
    group[siswaId].total += nilai;
    group[siswaId].count += 1;
  });

  var list = [];
  for (var sId in group) {
    var item = group[sId];
    var avg = (item.total / item.count).toFixed(1);
    list.push({
      nama: item.nama,
      kelasInfo: item.kelasInfo,
      avg: Number(avg),
      totalMapel: item.count
    });
  }

  list.sort(function(a, b) { return b.avg - a.avg; });
  return list.slice(0, 5);
}

/**
 * 8. Modul Analitis: Penilaian Terbaru
 */
function calculateRecentNilai(dataNilai, siswaMap, guruMap, limit) {
  var countLimit = limit || 5;
  return dataNilai.slice(-countLimit).reverse().map(function(row) {
    var idNilai = row[0];
    var siswaId = row[1].toString();
    var guruId  = row[2].toString();
    var nilai   = Number(row[3]) || 0;
    var predikat = row[4] || hitungPredikat(nilai);

    var infoSiswa = siswaMap[siswaId] || { nama: "Siswa " + siswaId };
    var infoGuru  = guruMap[guruId] || { nama: "Guru " + guruId, mapel: "-" };

    return {
      id: idNilai,
      namaSiswa: infoSiswa.nama,
      mapel: infoGuru.mapel,
      nilai: nilai,
      predikat: predikat
    };
  });
}
