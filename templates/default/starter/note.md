📋 RENCANA ADAPTASI TEMPLATE SIAKAD KE PROJECT BARU
Informasi yang Saya Kumpulkan
Arsitektur template yang bisa dipakai ulang:

Fitur	File	Bisa Reuse?
Login	Code.js, JavascriptLogin.html, Login.html	✅ Ya, polanya standar
Dashboard	dashboard.js, JavascriptDashboard.html, dashboardView.html	✅ Ya, tinggal ganti data
CRUD	[Entity].js, JavascriptCrud.html, [Entity]View.html	✅ Ya, pola generik
Laporan	laporan[Entity].js, JavascriptLaporan.html, laporan[Entity]View.html	✅ Ya, pola read-only
Helper	_helper.js, JavascriptHelper.html, JavascriptCore.html	✅ Ya, utility murni
✅ Langkah 1: Setup Google Sheets Baru
Buat spreadsheet baru dengan struktur sheet Anda sendiri. Misalnya jika Anda ingin project Inventaris Barang:

Sheet	Header
Users	username, password
Barang	ID, Nama Barang, Kategori, Stok, Harga
Kategori	ID, Nama Kategori, Kode
Peminjaman	ID, Barang ID, Peminjam, Tanggal, Status
Laporan	(bisa di-generate otomatis dari join data)
⚠️ Catatan: Sheet Users dengan header username,password WAJIB ada karena dipakai untuk login.

✅ Langkah 2: Buat Server-Side Baru
Buat file .js baru untuk setiap entitas. Copy pola dari file yang sudah ada:

Contoh: Barang.js (copy pola dari Jurusan.js atau Siswa.js)


function getBarang() {
  var sheet = getSheet('Barang');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data;
}

function createBarang(obj) {
  try {
    if (!obj || !String(obj.nama || '').trim()) {
      return { success: false, message: 'Nama barang tidak boleh kosong.' };
    }
    var sheet = ensureSheet('Barang', ['ID', 'Nama Barang', 'Kategori', 'Stok', 'Harga']);
    var id = generateId('BRG');
    sheet.appendRow([id, obj.nama, obj.kategori, obj.stok, obj.harga]);
    return { success: true, message: 'Data berhasil ditambahkan!' };
  } catch (error) {
    return { success: false, message: 'Gagal: ' + error.message };
  }
}

// ...updateBarang, deleteBarang, getOptionsKategori() dst
✅ Langkah 3: Buat View HTML Baru
Buat file views/modules/BarangView.html:


<div id="modulBarang" class="hidden fade-in">
  <div class="bg-white p-6 rounded-xl shadow-sm border mb-6" id="formBarang"></div>
  <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-slate-50 border-b">
        <tr>
          <th class="py-3 px-4">ID</th>
          <th class="py-3 px-4">Nama Barang</th>
          <th class="py-3 px-4">Kategori</th>
          <th class="py-3 px-4">Stok</th>
          <th class="py-3 px-4">Harga</th>
          <th class="py-3 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody id="tabelBarang" class="divide-y divide-slate-100"></tbody>
    </table>
  </div>
✅ Langkah 4: Daftarkan di Index.html
Buka views/layout/Index.html, tambahkan include:


<?!= include('BarangView'); ?>
✅ Langkah 5: Tambahkan crudConfig di JavascriptCrud.html

barang: {
  formWrapperId: 'formBarang',
  tableId: 'tabelBarang',
  titleFormId: 'titleFormBarang',
  form: {
    id:       { el: 'barang_id', type: 'hidden' },
    nama:     { el: 'barang_nama', type: 'text', placeholder: 'Nama Barang' },
    kategori: { el: 'barang_kategori', type: 'dropdown', options: ['-- Memuat Kategori --'] },
    stok:     { el: 'barang_stok', type: 'number', placeholder: 'Jumlah Stok' },
    harga:    { el: 'barang_harga', type: 'number', placeholder: 'Harga Satuan' }
  },
  btnSaveId: 'btnSimpanBarang',
  btnCancelId: 'btnBatalBarang',
  loader: ['getBarang'],
  create: 'createBarang',
  update: 'updateBarang',
  delete: 'deleteBarang',
  tableColumns: [
    { label: 'ID', key: 0 },
    { label: 'Nama Barang', key: 1 },
    { label: 'Kategori', key: 2 },
    { label: 'Stok', key: 3 },
    { label: 'Harga', key: 4 }
  ]
}
Tambahkan wrapper function di bagian bawah JavascriptCrud.html:


function loadDataBarang() { loadData('barang'); }
function simpanBarang() { simpanData('barang'); }
function editBarang() { editData('barang'); }
function resetFormBarang() { resetForm('barang'); }
function hapusBarang() { hapusData('barang'); }
renderForm('barang');
✅ Langkah 6: Daftarkan Menu di JavascriptCore.html

barang: {
  title: 'Manajemen Data Barang Inventaris',
  loader: () => typeof loadDataBarang === 'function' && loadDataBarang()
}
✅ Langkah 7: Tambahkan Sidebar di Aside.html

<button onclick="pindahMenu('barang')" id="menuBarangBtn" class="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800">📦 Data Barang</button>
✅ Langkah 8: Daftarkan Path di Code.js

'BarangView': 'views/modules/BarangView',
✅ Langkah 9: Sesuaikan Dashboard
Edit dashboard.js → ganti fungsi-fungsi analitik sesuai data Anda (misal bukan "SiswaPerJurusan" tapi "BarangPerKategori").

Edit dashboardView.html → ganti KPI cards dan chart sesuai data Anda.

Edit JavascriptDashboard.html → ganti fungsi render chart sesuai data baru.

✅ Langkah 10: Sesuaikan Laporan
Edit laporanNilai.js → rename & sesuaikan query laporan dengan data Anda.

Edit laporanNilaiView.html → rename & sesuaikan kolom tabel.

Edit JavascriptLaporan.html → rename & sesuaikan filter.

📊 Ringkasan Checklist
Langkah	File	Yang Diubah
1	Google Sheets	Buat spreadsheet baru dengan struktur sheet Anda
2	[Entitas].js	Buat file server baru (copy pola dari yang ada)
3	views/modules/[Entitas]View.html	Buat view baru dengan kolom sesuai data
4	views/layout/Index.html	Tambahkan include
5	views/scripts/modules/crud/JavascriptCrud.html	Tambah crudConfig & wrapper functions
6	views/scripts/core/JavascriptCore.html	Tambah entry di menuRegistry
7	views/layout/Aside.html	Tambah tombol sidebar
8	Code.js → resolveTemplatePath()	Tambah mapping path
9	dashboard.js, dashboardView.html, JavascriptDashboard.html	Sesuaikan chart & KPI
10	laporan[Entitas].js, view, JavascriptLaporan.html	Sesuaikan laporan
11	Push & Deploy	clasp push → deploy web app baru
Apakah Anda ingin saya langsung membuatkan panduan langkah demi langkah yang detail untuk tipe project spesifik yang Anda tuju? Atau mungkin Anda ingin saya buatkan script generator yang mengotomatiskan pembuatan file-file ini berdasarkan konfigurasi yang Anda berikan?


Task Completed
📋 Langkah-langkah Copy Project SIAKAD ke Project Baru (Sheet Beda, Tapi Tetap Ada Dashboard, CRUD, Laporan & Login)
Berdasarkan analisis menyeluruh terhadap kode project SIAKAD, berikut adalah langkah-langkah detail untuk mengadaptasi template ini ke project baru dengan struktur sheet yang berbeda:

🗺️ Peta File yang Harus Diubah
Project SIAKAD memiliki 8 titik koneksi yang harus diubah per entitas + 4 modul umum:


┌─────────────────────────────────────────────────────────────┐
│                    FILE YANG PERLU DIUBAH                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Code.js          → entry point, konfigurasi, path map   │
│  2. [Entitas].js     → SERVER: CRUD per entitas             │
│  3. [Entitas]View.html → VIEW: form & tabel HTML            │
│  4. JavascriptCrud.html → CLIENT: crudConfig & wrapper fn   │
│  5. JavascriptCore.html  → CLIENT: menuRegistry navigasi    │
│  6. Aside.html       → SIDEBAR: tombol navigasi             │
│  7. Index.html       → LAYOUT: include view module          │
│  8. dashboard.js     → SERVER: analitik dashboard           │
│  9. dashboardView.html → VIEW: dashboard HTML               │
│ 10. JavascriptDashboard.html → CLIENT: chart & KPI logic    │
│ 11. laporan*.js      → SERVER: laporan read-only            │
│ 12. laporan*View.html → VIEW: laporan HTML                  │
│ 13. JavascriptLaporan.html → CLIENT: filter laporan logic   │
│ 14. Google Sheets    → DATABASE: buat sheet baru             │
└─────────────────────────────────────────────────────────────┘
✅ LANGKAH 1: Buat Google Sheets Baru
Buat spreadsheet baru dengan struktur data ANDA. Sheet Users WAJIB ada karena untuk login.

Contoh untuk Project "Inventaris Barang":

Sheet Name	Header (baris 1)
Users	username, password
Barang	ID, Nama Barang, Kategori, Stok, Harga
Kategori	ID, Nama Kategori, Kode Kategori
Peminjaman	ID, Barang ID, Peminjam, Tanggal Pinjam, Tanggal Kembali, Status
Contoh untuk Project "Manajemen Keuangan":

Sheet Name	Header
Users	username, password
Transaksi	ID, Tanggal, Kategori, Deskripsi, Jumlah, Tipe (Masuk/Keluar)
Kategori	ID, Nama Kategori, Tipe
Anggaran	ID, Bulan, Tahun, Jumlah Anggaran
✅ LANGKAH 2: Setup Konfigurasi di Code.js
Edit hanya resolveTemplatePath() untuk menambahkan mapping view baru ANDA:

Di Code.js, cari fungsi resolveTemplatePath(), tambahkan mapping baru:


'BarangView': 'views/modules/BarangView',
'KategoriView': 'views/modules/KategoriView',
⚠️ Jangan hapus mapping yang lama jika Anda masih butuh. Tapi jika project baru total, Anda bisa ganti semua mapping.

✅ LANGKAH 3: Buat File Server-Side Baru
Buat file .js baru untuk setiap entitas copy pola dari file yang sudah ada:

Pola dari Jurusan.js (entitas sederhana - 3 kolom):


getJurusan()    → getBarang()
createJurusan() → createBarang()
updateJurusan() → updateBarang()
deleteJurusan() → deleteBarang()
getOptionsJurusan() → getOptionsKategori()
Template pola server yang bisa Anda copy-paste:


// File: [Entitas].js
// Copy dari Jurusan.js atau Siswa.js

function get[Entitas]() {
  var sheet = getSheet('[NamaSheet]');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data;
}

function create[Entitas](obj) {
  try {
    if (!obj || !String(obj.nama || '').trim()) {
      return { success: false, message: 'Nama tidak boleh kosong.' };
    }
    var sheet = ensureSheet('[NamaSheet]', ['ID', 'Kolom2', 'Kolom3', ...]);
    var id = generateId('[PREFIX]');
    sheet.appendRow([id, obj.kolom2, obj.kolom3, ...]);
    return { success: true, message: 'Data berhasil ditambahkan!' };
  } catch (error) {
    return { success: false, message: 'Gagal: ' + error.message };
  }
}

// ... update[Entitas](), delete[Entitas](), getOptions[Entitas]() pattern sama
File server yang perlu dibuat:

Project Baru	Buat File
Nama project Anda	[Entitas1].js, [Entitas2].js, dll
Dashboard	dashboard.js (copy dari yang lama, sesuaikan query)
Laporan	laporan[xxx].js (copy dari laporanNilai.js, sesuaikan)
✅ LANGKAH 4: Buat View HTML Baru
Buat file di views/modules/ untuk setiap entitas:

Template views/modules/[Entitas]View.html:


<!-- ========================================== -->
<!-- MODUL: [ENTITAS]                           -->
<!-- ========================================== -->
<div id="modul[Entitas]" class="hidden fade-in">
  <!-- Form -->
  <div class="bg-white p-6 rounded-xl shadow-sm border mb-6" id="form[Entitas]"></div>
  <!-- Tabel -->
  <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-slate-50 border-b">
        <tr>
          <th class="py-3 px-4">ID</th>
          <th class="py-3 px-4">Kolom 1</th>
          <th class="py-3 px-4">Kolom 2</th>
          <th class="py-3 px-4">Kolom 3</th>
          <th class="py-3 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody id="tabel[Entitas]" class="divide-y divide-slate-100"></tbody>
    </table>
  </div>
</div>
Aturan penamaan WAJIB konsisten:

id wrapper: modul[Entitas] → modulBarang
id form: form[Entitas] → formBarang
id tbody: tabel[Entitas] → tabelBarang
✅ LANGKAH 5: Daftarkan View di Index.html
Buka views/layout/Index.html, cari bagian <div class="flex-1 p-8 overflow-y-auto">, tambahkan include:


<?!= include('[Entitas]View'); ?>
Contoh:


<?!= include('BarangView'); ?>
<?!= include('KategoriView'); ?>
✅ LANGKAH 6: Tambahkan Config di JavascriptCrud.html
Buka views/scripts/modules/crud/JavascriptCrud.html:

A. Di dalam objek crudConfig, tambahkan entitas baru ANDA:


[entitas]: {  // contoh: barang
  formWrapperId: 'form[Entitas]',     // formBarang
  tableId: 'tabel[Entitas]',          // tabelBarang
  titleFormId: 'titleForm[Entitas]',  // titleFormBarang
  form: {
    id:   { el: '[entitas]_id', type: 'hidden' },          // barang_id
    nama: { el: '[entitas]_nama', type: 'text', placeholder: 'Nama...' },
    // ... tambah field sesuai data Anda
    // type bisa: 'hidden', 'text', 'number', 'radio', 'dropdown'
  },
  btnSaveId: 'btnSimpan[Entitas]',     // btnSimpanBarang
  btnCancelId: 'btnBatal[Entitas]',    // btnBatalBarang
  loader: ['get[Entitas]'],            // getBarang
  create: 'create[Entitas]',           // createBarang
  update: 'update[Entitas]',           // updateBarang
  delete: 'delete[Entitas]',           // deleteBarang
  tableColumns: [
    { label: 'ID', key: 0 },
    { label: 'Nama', key: 1 },
    { label: 'Kolom Lain', key: 2 },
    // key = index kolom di array hasil get[Entitas]()
  ]
}
B. Di bagian bawah file, tambahkan wrapper functions:


// ==========================================
// [ENTITAS] WRAPPER
// ==========================================
function loadData[Entitas]() { loadData('[entitas]'); }
function simpan[Entitas]() { simpanData('[entitas]'); }
function edit[Entitas]() { editData('[entitas]'); }
function resetForm[Entitas]() { resetForm('[entitas]'); }
function hapus[Entitas]() { hapusData('[entitas]'); }
renderForm('[entitas]');
Jika ada dropdown dinamis (misal dropdown Kategori di form Barang), tambahkan juga:


function loadDataBarang() {
  populateBarangKategoriDropdown();  // isi dropdown dulu
  loadData('barang');                // lalu render tabel
}
function populateBarangKategoriDropdown() {
  google.script.run.withSuccessHandler(list => {
    const el = document.getElementById('barang_kategori');
    let html = '<option value="">-- Pilih Kategori --</option>';
    list.forEach(item => { html += `<option value="${item.nama}">${item.nama}</option>`; });
    el.innerHTML = html;
  }).getOptionsKategori();
}
✅ LANGKAH 7: Daftarkan Menu di JavascriptCore.html
Buka views/scripts/core/JavascriptCore.html, tambahkan di dalam menuRegistry:


[entitas]: {  // contoh: barang
  title: 'Judul Menu Anda',
  loader: () => typeof loadData[Entitas] === 'function' && loadData[Entitas]()
}
Contoh:


barang: {
  title: 'Manajemen Data Barang Inventaris',
  loader: () => typeof loadDataBarang === 'function' && loadDataBarang()
},
kategori: {
  title: 'Manajemen Kategori Barang',
  loader: () => typeof loadDataKategori === 'function' && loadDataKategori()
}
✅ LANGKAH 8: Tambahkan Tombol Sidebar di Aside.html
Buka views/layout/Aside.html, tambahkan di dalam <nav>:


<button onclick="pindahMenu('[entitas]')" id="menu[Entitas]Btn" class="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800">📦 [Nama Tampilan]</button>
Contoh:


<button onclick="pindahMenu('barang')" id="menuBarangBtn" class="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800">📦 Data Barang</button>
<button onclick="pindahMenu('kategori')" id="menuKategoriBtn" class="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800">🏷️ Kategori</button>
✅ LANGKAH 9: Sesuaikan Dashboard
A. Edit dashboard.js:

Ganti fungsi getDashboardSummary() → sesuaikan query data sesuai struktur sheet baru
Ganti calculateKpiStats() → ganti logic KPI dengan data Anda
Ganti calculateSiswaPerJurusan() → jadi analitik sesuai entitas Anda
Hapus yang tidak perlu, tambah fungsi baru sesuai kebutuhan
B. Edit views/modules/dashboardView.html:

Ganti KPI cards dengan metrik yang relevan
Ganti judul chart
C. Edit views/scripts/modules/dashboard/JavascriptDashboard.html:

Ganti fungsi render chart sesuai data dari server
✅ LANGKAH 10: Sesuaikan Laporan (Jika Ada)
A. Buat/Edit laporan[Entitas].js (copy dari laporanNilai.js):

Ganti query JOIN sesuai sheet Anda
Sesuaikan struktur filterOptions
B. Buat/Edit views/modules/laporan[Entitas]View.html:

Ganti kolom tabel
Ganti statistik cards
C. Edit views/scripts/modules/laporan/JavascriptLaporan.html:

Ganti fungsi filter dan render sesuai data baru
Jangan lupa tambahkan wrapper functions
✅ LANGKAH 11: Push & Deploy

# 1. Push ke Apps Script
clasp push

# 2. Buka editor untuk deploy
clasp open

# 3. Di editor Apps Script:
#    - Jalankan fungsi setupConfig() sekali
#    - Isi SPREADSHEET_ID dengan ID spreadsheet baru Anda
#    - Deploy → New deployment → Web app
📊 CHECKLIST LENGKAP
#	Langkah	File	Status
1	Buat Google Sheets baru dengan struktur sendiri	Google Sheets	❌
2	Setup SPREADSHEET_ID di PropertiesService	Code.js → setupConfig()	❌
3	Tambah mapping path view baru	Code.js → resolveTemplatePath()	❌
4	Buat file server CRUD per entitas	[Entitas1].js, [Entitas2].js	❌
5	Buat file server dashboard (copy & sesuaikan)	dashboard.js	❌
6	Buat file server laporan (copy & sesuaikan)	laporan[xxx].js	❌
7	Buat view HTML per entitas	views/modules/[Entitas]View.html	❌
8	Buat view dashboard (edit)	views/modules/dashboardView.html	❌
9	Buat view laporan (edit)	views/modules/laporan[xxx]View.html	❌
10	Daftarkan include view di Index	views/layout/Index.html	❌
11	Tambah crudConfig + wrapper functions	views/scripts/modules/crud/JavascriptCrud.html	❌
12	Tambah dashboard client logic	views/scripts/modules/dashboard/JavascriptDashboard.html	❌
13	Tambah laporan client logic	views/scripts/modules/laporan/JavascriptLaporan.html	❌
14	Daftarkan menu di menuRegistry	views/scripts/core/JavascriptCore.html	❌
15	Tambah tombol sidebar	views/layout/Aside.html	❌
16	Push & Deploy	Terminal + Apps Script Editor	❌
💡 PRINSIP UTAMA
Setiap entitas baru = 8 file yang harus disentuh:

[Entitas].js (server)
[Entitas]View.html (view)
Index.html (include)
JavascriptCrud.html (config + wrapper)
JavascriptCore.html (menu registry)
Aside.html (sidebar button)
Code.js → resolveTemplatePath() (path mapping)
Google Sheets (buat sheet baru)
Dan untuk modul umum ada 6 file lagi:

dashboard.js (server dashboard)
dashboardView.html (view dashboard)
JavascriptDashboard.html (client dashboard)
laporan[xxx].js (server laporan)
laporan[xxx]View.html (view laporan)
JavascriptLaporan.html (client laporan)
Apakah Anda ingin saya langsung mengimplementasikan langkah-langkah ini untuk membuat project baru? Jika iya, beri tahu saya:

Nama project (apa yang ingin Anda buat?)
Struktur sheet (nama-nama sheet dan kolomnya)
Entitas CRUD apa saja yang diperlukan
Metrik dashboard apa yang ingin ditampilkan
Laporan seperti apa yang dibutuhkan