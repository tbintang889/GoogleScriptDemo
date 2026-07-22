let rawLaporanData = [];

function loadDataLaporanNilai() {
  const tbody = document.getElementById('tabelLaporanNilai');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="6" class="py-6 text-center text-slate-500">Memuat data laporan...</td></tr>';
  }

  gasRun('getLaporanNilai', {}, res => {
    if (!res) return;
    rawLaporanData = res.data || [];
    populateFilterLaporanOptions(res.filterOptions);
    renderLaporanTable(rawLaporanData);
  });
}

function populateFilterLaporanOptions(opts) {
  if (!opts) return;

  const selMapel = document.getElementById('filterLaporanMapel');
  const selGuru = document.getElementById('filterLaporanGuru');
  const selSiswa = document.getElementById('filterLaporanSiswa');

  if (selMapel) {
    let mapelHtml = '<option value="">-- Semua Mata Pelajaran --</option>';
    (opts.mapel || []).forEach(item => {
      mapelHtml += `<option value="${item}">${item}</option>`;
    });
    selMapel.innerHTML = mapelHtml;
  }

  if (selGuru) {
    let guruHtml = '<option value="">-- Semua Guru --</option>';
    (opts.guru || []).forEach(item => {
      guruHtml += `<option value="${item.id}">${item.nama}</option>`;
    });
    selGuru.innerHTML = guruHtml;
  }

  if (selSiswa) {
    let siswaHtml = '<option value="">-- Semua Siswa --</option>';
    (opts.siswa || []).forEach(item => {
      siswaHtml += `<option value="${item.id}">${item.nama}</option>`;
    });
    selSiswa.innerHTML = siswaHtml;
  }
}

function renderLaporanTable(dataList) {
  const tbody = document.getElementById('tabelLaporanNilai');
  if (!tbody) return;

  tbody.innerHTML = '';

  const total = (dataList || []).length;
  const statTotal = document.getElementById('statTotalPenilaian');
  const statAvg = document.getElementById('statRataRata');
  const statMax = document.getElementById('statTertinggi');
  const statMin = document.getElementById('statTerendah');

  if (statTotal) statTotal.innerText = total;

  if (total === 0) {
    if (statAvg) statAvg.innerText = '0';
    if (statMax) statMax.innerText = '0';
    if (statMin) statMin.innerText = '0';
    tbody.innerHTML = '<tr><td colspan="6" class="py-6 text-center text-slate-500">Data laporan tidak ditemukan.</td></tr>';
    return;
  }

  let sum = 0;
  let max = Number(dataList[0].nilai || 0);
  let min = Number(dataList[0].nilai || 0);

  dataList.forEach((item, index) => {
    const val = Number(item.nilai || 0);
    sum += val;
    if (val > max) max = val;
    if (val < min) min = val;

    let badgeColor = 'bg-slate-100 text-slate-700';
    if (item.predikat?.startsWith('A')) badgeColor = 'bg-emerald-100 text-emerald-700 font-semibold';
    else if (item.predikat?.startsWith('B')) badgeColor = 'bg-blue-100 text-blue-700 font-semibold';
    else if (item.predikat?.startsWith('C')) badgeColor = 'bg-amber-100 text-amber-700 font-semibold';
    else if (item.predikat?.startsWith('D')) badgeColor = 'bg-red-100 text-red-700 font-semibold';

    tbody.innerHTML += `
      <tr class="hover:bg-slate-50 border-b">
        <td class="py-3 px-4 text-center font-medium text-slate-500">${index + 1}</td>
        <td class="py-3 px-4 font-medium text-slate-800">${item.namaSiswa}</td>
        <td class="py-3 px-4 text-slate-700"><span class="bg-slate-100 px-2 py-1 rounded text-xs">${item.mapel}</span></td>
        <td class="py-3 px-4 text-slate-700">${item.namaGuru}</td>
        <td class="py-3 px-4 text-center font-bold text-slate-800">${item.nilai}</td>
        <td class="py-3 px-4 text-center"><span class="px-2.5 py-1 rounded-full text-xs ${badgeColor}">${item.predikat}</span></td>
      </tr>`;
  });

  if (statAvg) statAvg.innerText = (sum / total).toFixed(1);
  if (statMax) statMax.innerText = max;
  if (statMin) statMin.innerText = min;
}

function applyFilterLaporan() {
  const selectedMapel = document.getElementById('filterLaporanMapel').value;
  const selectedGuru = document.getElementById('filterLaporanGuru').value;
  const selectedSiswa = document.getElementById('filterLaporanSiswa').value;

  const filtered = (rawLaporanData || []).filter(item => {
    const matchMapel = selectedMapel === '' || item.mapel === selectedMapel;
    const matchGuru = selectedGuru === '' || item.guruId === selectedGuru;
    const matchSiswa = selectedSiswa === '' || item.siswaId === selectedSiswa;
    return matchMapel && matchGuru && matchSiswa;
  });

  renderLaporanTable(filtered);
}

function resetFilterLaporan() {
  const selMapel = document.getElementById('filterLaporanMapel');
  const selGuru = document.getElementById('filterLaporanGuru');
  const selSiswa = document.getElementById('filterLaporanSiswa');
  if (selMapel) selMapel.value = '';
  if (selGuru) selGuru.value = '';
  if (selSiswa) selSiswa.value = '';
  renderLaporanTable(rawLaporanData);
}
