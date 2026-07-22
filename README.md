# SIAKAD - Sistem Informasi Akademik (Google Apps Script Web App)

SIAKAD adalah aplikasi web SPA berbasis Google Apps Script dan TailwindCSS yang digunakan untuk mengelola data akademik sekolah, termasuk data siswa, guru, mata pelajaran, nilai, laporan, dan dashboard analitik. Aplikasi ini terintegrasi langsung dengan Google Sheets sebagai sumber data utama.

---

## 📌 Ringkasan Perbaikan Terbaru

Versi saat ini telah diperbaiki untuk menjadi lebih aman, lebih rapi, dan lebih siap dijadikan template untuk proyek GAS berikutnya:

- Konfigurasi spreadsheet kini tidak lagi hardcoded di kode, melainkan disimpan melalui PropertiesService.
- CRUD server-side kini mengembalikan respons objek `{ success, message }` yang konsisten.
- Validasi sisi server ditambahkan untuk mencegah input kosong atau tidak valid.
- Login menggunakan pencocokan aman terhadap password yang disimpan dengan hash SHA-256.
- UI memberikan feedback yang lebih jelas saat simpan, edit, dan hapus data.
- Frontend kini dipisah ke modul modular (`JavascriptHelper.html`, `JavascriptCore.html`, `JavascriptLogin.html`, `JavascriptCrud.html`, `JavascriptNilai.html`, `JavascriptLaporan.html`, `JavascriptDashboard.html`) untuk memudahkan maintenance dan reuse.

---

## 📋 Daftar Isi
1. [Prasyarat Sistem](#-prasyarat-sistem)
2. [Arsitektur Proyek & Struktur File](#-arsitektur-proyek--struktur-file)
3. [Cara Pakai & Instalasi](#-cara-pakai--instalasi)
   - [Langkah 1: Setup Google Sheets](#langkah-1-setup-google-sheets-database)
   - [Langkah 2: Konfigurasi Aplikasi](#langkah-2-konfigurasi-aplikasi)
   - [Langkah 3: Push ke Apps Script](#langkah-3-push-ke-apps-script)
   - [Langkah 4: Deploy Web App](#langkah-4-deploy-web-app)
4. [🔄 Alur Sistem](#-alur-sistem)
5. [🛠️ Panduan Clasp](#%EF%B8%8F-panduan-clasp-command-line-apps-script-projects)
6. [🚀 Panduan Git](#-panduan-git)

---

## 💻 Prasyarat Sistem
Pastikan Anda telah memasang:
- [Node.js](https://nodejs.org/) (minimal versi 16)
- [Git](https://git-scm.com/)
- Akun Google untuk Google Sheets dan Apps Script

---

## 📁 Arsitektur Proyek & Struktur File

### Server-Side Scripts (`.js`)
| File | Fungsi |
|---|---|
| `Code.js` | Entry point, `doGet()`, `include()`, autentikasi, konfigurasi via `PropertiesService`, helper `getSheet()` dan `generateId()` |
| `Siswa.js` | CRUD data siswa |
| `Guru.js` | CRUD data guru |
| `Mapel.js` | CRUD data mata pelajaran |
| `Nilai.js` | CRUD nilai dan JOIN data siswa/guru |
| `laporanNilai.js` | Laporan rekapitulasi nilai |
| `dashboard.js` | Analitik dashboard |

### Client-Side Views (`.html`)
Struktur view kini dikelompokkan ke folder agar lebih rapi dan siap dipakai sebagai starter template:
- `views/layout/` → layout utama, head, sidebar, login wrapper
- `views/auth/` → form login
- `views/modules/` → view untuk dashboard, siswa, guru, mapel, nilai, laporan
- `views/scripts/` → orchestrator, helper, core, dan modul fitur

| File | Keterangan |
|---|---|
| `views/layout/Index.html` | Layout utama |
| `views/layout/Head.html` | CDN TailwindCSS, Chart.js, dan font |
| `views/auth/Login.html` | Form login |
| `views/layout/Aside.html` | Sidebar navigasi |
| `views/modules/SiswaView.html` | Form CRUD siswa |
| `views/modules/GuruView.html` | Form CRUD guru |
| `views/modules/MapelView.html` | Form CRUD mapel |
| `views/modules/NilaiView.html` | Form CRUD nilai |
| `views/modules/laporanNilaiView.html` | Laporan read-only |
| `views/modules/dashboardView.html` | Dashboard analitik |
| `views/scripts/Javascript.html` | Orchestrator include untuk logika client-side modular |
| `views/scripts/helper/JavascriptHelper.html` | Helper UI dan fungsi shared seperti toast dan gasRun |
| `views/scripts/core/JavascriptCore.html` | Registrasi menu dan navigasi antar modul |
| `views/scripts/modules/login/JavascriptLogin.html` | Flow login dan logout |
| `views/scripts/modules/crud/JavascriptCrud.html` | CRUD generik untuk entitas utama |
| `views/scripts/modules/nilai/JavascriptNilai.html` | Modul nilai dan filter data penilaian |
| `views/scripts/modules/laporan/JavascriptLaporan.html` | Modul laporan dan statistik read-only |
| `views/scripts/modules/dashboard/JavascriptDashboard.html` | Dashboard analitik, chart, KPI, leaderboard |

---

## 🔌 Cara Pakai & Instalasi

### Langkah 1: Setup Google Sheets (Database)
Buat spreadsheet baru di Google Drive dan tambahkan sheet berikut:

1. Sheet `Users` dengan header `username,password`
2. Sheet `Siswa` dengan header `id,nama,kelas,jurusan`
3. Sheet `Guru` dengan header `id,nama,mapel,nohp`
4. Sheet `Mapel` dengan header `id,nama_mapel,kode_mapel`
5. Sheet `Nilai` dengan header `id,siswa_id,guru_id,nilai,predikat`

> Sheet `Mapel` dan `Nilai` dapat dibuat otomatis saat aplikasi pertama kali menyimpan data jika belum ada.

### Langkah 2: Konfigurasi Aplikasi
1. Buka Apps Script editor.
2. Jalankan fungsi `setupConfig()` sekali.
3. Masukkan nilai `SPREADSHEET_ID` sesuai spreadsheet Anda.
4. Simpan konfigurasi dan lanjutkan.

Contoh:
```javascript
function setupConfig() {
  PropertiesService.getScriptProperties().setProperties({
    SPREADSHEET_ID: 'ID_SPREADSHEET_ANDA',
    APP_NAME: 'SIAKAD'
  });
}
```

### Langkah 3: Push ke Apps Script
```bash
clasp push
```

### Langkah 4: Deploy Web App
1. Buka editor Apps Script: `clasp open`
2. Pilih **Deploy** → **New deployment** → tipe **Web app**
3. Atur akses sesuai kebutuhan.
4. Salin URL web app yang dihasilkan.

---

## 🔄 Alur Sistem

Aplikasi berjalan sebagai SPA. Saat pengguna login, aplikasi memanggil fungsi server untuk memverifikasi akun, lalu menampilkan modul dashboard atau data sesuai menu yang dipilih.

Proses inti:
- `doGet()` merender halaman utama.
- `checkLogin()` memverifikasi akun dari sheet `Users`.
- `menuRegistry` mengatur navigasi antar modul.
- CRUD server-side menulis ke sheet terkait dan mengembalikan respon status.

---

## 🛠️ Panduan Clasp

### Perintah Penting
```bash
npm install -g @google/clasp
clasp login
clasp push
clasp open
```

### ⚠️ Penting: File Development Jangan Sampai Ter-Push

File development seperti `generate-crud.js`, `README.md`, `TEMPLATE_NOTES.md`, dan `.gitignore` sudah otomatis **dikecualikan** dari push via file `.claspignore`. Ini mencegah error seperti `ReferenceError: require is not defined` jika file Node.js ikut ter-push ke Apps Script.

Jika Anda menambah file development baru, tambahkan pattern-nya ke `.claspignore`:
```
**/skrip-anda.js
**/folder-dev/*
```

---

🤖 CRUD Generator CLI (Otomatis)

Kami menyediakan **CLI Generator** yang bisa membuat seluruh menu CRUD baru secara otomatis dalam satu perintah.

### Cara Pakai

```bash
# Generate CRUD entitas baru (default: field nama + kode)
node generate-crud.js Jurusan

# Generate dengan field kustom
node generate-crud.js Kelas --fields nama:text,tingkat:dropdown:10,11,12

# Generate dengan opsi lengkap
node generate-crud.js Ruangan --prefix RG --icon 🏠 --title "Manajemen Ruangan"

# Dry-run (lihat yang akan dibuat tanpa perubahan)
node generate-crud.js Jurusan --dry-run

# Lihat bantuan
node generate-crud.js --help
```

### Apa yang dilakukan generator?

| # | File | Aksi |
|---|------|------|
| 1 | `Entitas.js` | **Buat** file server-side (get, create, update, delete) |
| 2 | `views/modules/EntitasView.html` | **Buat** template view (form + tabel) |
| 3 | `JavascriptCrud.html` | **Update** `crudConfig` + wrapper functions |
| 4 | `JavascriptCore.html` | **Update** `menuRegistry` |
| 5 | `Aside.html` | **Update** sidebar button |
| 6 | `Index.html` | **Update** include view |
| 7 | `Code.js` | **Update** path mapping |

> **Catatan:** Generator ini bekerja dengan membaca dan memodifikasi file yang sudah ada. Pastikan struktur file proyek sesuai dengan template SIAKAD.

---

📖 Tutorial: Cara Menambah Menu CRUD Baru (Manual)

Panduan ini menjelaskan langkah-langkah untuk menambahkan modul CRUD baru ke dalam aplikasi SIAKAD. Sebagai contoh, kita akan membuat entitas **Jurusan**.

---

### 🗺️ Peta Koneksi (Yang Terhubung ke Apa)

Sebelum memulai, pahami bagaimana komponen-komponen dalam proyek ini saling terhubung:

```
[View] SiswaView.html          (UI: form + tabel)
    ↑ include di Index.html
    ↓ JS logic
[JavascriptCrud.html]           (crudConfig + fungsi: renderForm, loadData, simpanData, dll)
    ↓ google.script.run
[Server] Siswa.js               (getSiswa, createSiswa, updateSiswa, deleteSiswa)
    ↓
[Database] Sheet "Siswa"        (Google Sheets)
    
[Navigasi]
[Javascript.html] menuRegistry  →  [Aside.html] tombol sidebar
[pindahMenu('siswa')]           →  tampilkan/sembunyikan modul
```

**Setiap entitas CRUD baru harus mendaftar di 7 titik ini.**

---

### 📋 Langkah 1: Buat File Server-Side (Backend GAS)

Buat file baru, misal `Jurusan.js`, di root folder proyek (`d:/GAS/siakad/Jurusan.js`).

Gunakan pattern berikut:

```javascript
// File: Jurusan.js

/**
 * Ambil seluruh data Jurusan dari sheet
 */
function getJurusan() {
  var sheet = getSheet('Jurusan');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift(); // hapus header
  return data;
}

/**
 * Tambah data Jurusan baru
 */
function createJurusan(obj) {
  try {
    if (!obj || !String(obj.nama || '').trim()) {
      return { success: false, message: 'Nama jurusan tidak boleh kosong.' };
    }
    var sheet = ensureSheet('Jurusan', ['ID', 'Nama Jurusan', 'Kode Jurusan']);
    var id = generateId('JUR');
    sheet.appendRow([id, String(obj.nama || '').trim(), String(obj.kode || '').trim()]);
    return { success: true, message: 'Data Jurusan berhasil ditambahkan!' };
  } catch (error) {
    return { success: false, message: 'Gagal menambah jurusan: ' + error.message };
  }
}

/**
 * Update data Jurusan
 */
function updateJurusan(obj) {
  try {
    if (!obj || !String(obj.id || '').trim()) {
      return { success: false, message: 'ID jurusan tidak valid.' };
    }
    var sheet = ensureSheet('Jurusan', ['ID', 'Nama Jurusan', 'Kode Jurusan']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(obj.id || '').toString()) {
        var rowIndex = i + 1;
        sheet.getRange(rowIndex, 2).setValue(String(obj.nama || '').trim());
        sheet.getRange(rowIndex, 3).setValue(String(obj.kode || '').trim());
        return { success: true, message: 'Data Jurusan berhasil diperbarui!' };
      }
    }
    return { success: false, message: 'Jurusan tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal memperbarui jurusan: ' + error.message };
  }
}

/**
 * Hapus data Jurusan
 */
function deleteJurusan(id) {
  try {
    var sheet = ensureSheet('Jurusan', ['ID', 'Nama Jurusan', 'Kode Jurusan']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(id || '').toString()) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Data Jurusan berhasil dihapus!' };
      }
    }
    return { success: false, message: 'Jurusan tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus jurusan: ' + error.message };
  }
}
```

> **Fungsi server-side WAJIB mengembalikan format `{ success, message }` untuk CRUD write operations** (create, update, delete). Untuk operasi read (get), cukup kembalikan array 2D.

---

### 📋 Langkah 2: Buat View Template (Frontend HTML)

Buat file `views/modules/JurusanView.html`:

```html
<!-- ========================================== -->
<!-- MODUL: JURUSAN                             -->
<!-- ========================================== -->
<div id="modulJurusan" class="hidden fade-in">
  <!-- Form Jurusan (akan di-render otomatis oleh renderForm() dari JavascriptCrud.html) -->
  <div class="bg-white p-6 rounded-xl shadow-sm border mb-6" id="formJurusan">
  
  </div>
  <!-- Tabel Jurusan -->
  <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-slate-50 border-b">
        <tr>
          <th class="py-3 px-4">ID</th>
          <th class="py-3 px-4">Nama Jurusan</th>
          <th class="py-3 px-4">Kode Jurusan</th>
          <th class="py-3 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody id="tabelJurusan" class="divide-y divide-slate-100"></tbody>
    </table>
  </div>
</div>
```

> **Aturan penamaan ID yang konsisten:**
> - `id` modul wrapper: `modul[NamaEntitas]` → `modulJurusan`
> - `id` form wrapper: `form[NamaEntitas]` → `formJurusan`
> - `id` tbody tabel: `tabel[NamaEntitas]` → `tabelJurusan`
> - Header tabel harus sesuai dengan `tableColumns` di `crudConfig`

---

### 📋 Langkah 3: Daftarkan View Include di Index.html

Buka `views/layout/Index.html`, cari bagian `<div class="flex-1 p-8 overflow-y-auto">` dan tambahkan include **setelah include modul lainnya**:

```html
<?!= include('JurusanView'); ?>
```

---

### 📋 Langkah 4: Tambahkan Konfigurasi CRUD + Wrapper Functions di JavascriptCrud.html

Buka `views/scripts/modules/crud/JavascriptCrud.html`.

**A.** Di dalam objek `crudConfig`, tambahkan entitas baru:

```javascript
jurusan: {
  formWrapperId: 'formJurusan',
  tableId: 'tabelJurusan',
  titleFormId: 'titleFormJurusan',
  form: {
    id:   { el: 'jurusan_id', type: 'hidden' },
    nama: { el: 'jurusan_nama', type: 'text', placeholder: 'Nama Jurusan' },
    kode: { el: 'jurusan_kode', type: 'text', placeholder: 'Kode Jurusan (misal: TJKT)' }
  },
  btnSaveId: 'btnSimpanJurusan',
  btnCancelId: 'btnBatalJurusan',
  loader: ['getJurusan'],          // fungsi server-side untuk load data
  create: 'createJurusan',         // fungsi server-side untuk create
  update: 'updateJurusan',         // fungsi server-side untuk update
  delete: 'deleteJurusan',         // fungsi server-side untuk delete
  tableColumns: [                  // mapping kolom untuk render tabel
    { label: 'ID', key: 0 },
    { label: 'Nama Jurusan', key: 1 },
    { label: 'Kode', key: 2 }
  ]
}
```

> **Penjelasan properti `crudConfig`:**
> | Properti | Deskripsi |
> |---|---|
> | `formWrapperId` | ID elemen div yang akan diisi form |
> | `tableId` | ID elemen tbody untuk render data |
> | `titleFormId` | ID elemen judul form (Tambah/Edit) |
> | `form` | Definisi field: `{ namaField: { el, type, placeholder/options } }` |
> | `btnSaveId` | ID tombol Simpan |
> | `btnCancelId` | ID tombol Batal (untuk cancel edit) |
> | `loader` | Array nama fungsi server untuk load data |
> | `create/update/delete` | Nama fungsi server untuk operasi CRUD |
> | `tableColumns` | Mapping kolom tabel: `{ label, key }` |

**B.** Di bagian bawah file (setelah definisi `hapusData`), daftarkan wrapper functions dan panggil `renderForm`:

```javascript
function loadDataJurusan() { loadData('jurusan'); }
function simpanJurusan() { simpanData('jurusan'); }
function editJurusan() { editData('jurusan'); }
function resetFormJurusan() { resetForm('jurusan'); }
function hapusJurusan() { hapusData('jurusan'); }
renderForm('jurusan');
```

---

### 📋 Langkah 5: Daftarkan Menu di menuRegistry (Javascript.html)

Buka `views/scripts/Javascript.html` (atau `views/scripts/core/JavascriptCore.html` untuk versi modular), cari objek `menuRegistry` dan tambahkan entry baru:

```javascript
jurusan: {
  title: "Manajemen Data Jurusan",
  loader: () => typeof loadDataJurusan === 'function' && loadDataJurusan()
}
```

> Fungsi `loader` akan dipanggil setiap kali user mengklik menu ini. Ini memuat data dari server dan merender tabel secara otomatis.

---

### 📋 Langkah 6: Tambahkan Tombol Sidebar di Aside.html

Buka `views/layout/Aside.html` dan tambahkan button navigasi baru di dalam `<nav>`:

```html
<button onclick="pindahMenu('jurusan')" id="menuJurusanBtn" class="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800">📂 Data Jurusan</button>
```

> **Aturan penamaan:**
> - `onclick` → `pindahMenu('[keyEntitas]')` → `pindahMenu('jurusan')`
> - `id` → `menu[CapitalEntitas]Btn` → `menuJurusanBtn`

---

### 📋 Langkah 7: Daftarkan Path Template di Code.js (resolveTemplatePath)

Buka `Code.js`, cari fungsi `resolveTemplatePath`, dan tambahkan mapping baru ke dalam objek `includeMap`:

```javascript
'JurusanView': 'views/modules/JurusanView',
```

---

### 📋 Langkah 8: Buat Sheet di Google Sheets

Pastikan spreadsheet memiliki sheet dengan nama yang sesuai (sama dengan key entitas di `crudConfig`). Contoh untuk Jurusan:

| ID | Nama Jurusan | Kode Jurusan |
|----|-------------|--------------|
| JUR-1234567890 | Teknik Komputer Jaringan | TKJ |
| JUR-1234567891 | Rekayasa Perangkat Lunak | RPL |

> **Catatan:** Baris pertama (header) akan dibuat otomatis oleh `ensureSheet()` jika sheet belum ada.

---

### ✅ Checklist: Yang Harus UNIK per Entitas

| Komponen | Contoh untuk "Jurusan" | Dimana |
|----------|------------------------|--------|
| Nama file server | `Jurusan.js` | root folder |
| Nama file view | `JurusanView.html` | `views/modules/` |
| Key di `crudConfig` | `jurusan` | `JavascriptCrud.html` |
| Key di `menuRegistry` | `jurusan` | `Javascript.html` / `JavascriptCore.html` |
| `onclick` sidebar | `pindahMenu('jurusan')` | `Aside.html` |
| Mapping path | `'JurusanView'` | `Code.js` |
| Include di Index | `<?!= include('JurusanView'); ?>` | `Index.html` |
| `id` modul div | `modulJurusan` | `JurusanView.html` |
| `id` form wrapper | `formJurusan` | `JurusanView.html` + `crudConfig` |
| `id` tbody | `tabelJurusan` | `JurusanView.html` + `crudConfig` |
| `id` title form | `titleFormJurusan` | `crudConfig` |
| `id` input fields | `jurusan_id`, `jurusan_nama`, `jurusan_kode` | `crudConfig` |
| `id` buttons | `btnSimpanJurusan`, `btnBatalJurusan` | `crudConfig` |
| `id` sidebar btn | `menuJurusanBtn` | `Aside.html` |
| Nama sheet | `Jurusan` | Google Sheets |
| Prefix ID | `JUR` | `Jurusan.js` → `generateId('JUR')` |

---

### 💡 Tips & Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Tombol sidebar tidak responsive | Pastikan key di `menuRegistry` sama persis dengan argumen `pindahMenu()` |
| Form tidak muncul | Pastikan `renderForm('jurusan')` dipanggil dan `formWrapperId` benar |
| Tabel kosong terus | Cek fungsi loader di server (https://script.google.com → Execution Log) |
| Data tidak tersimpan | Pastikan fungsi server mengembalikan `{ success: true, message: '...' }` |
| Edit tidak berfungsi | Cek `editData` — parameter dikirim via `row.join("','")` — pastikan urutan kolom sesuai |
| Toast error "Nama wajib diisi" | Validasi client-side mengharuskan field `nama` ada di form config |

---

### 🔄 Flow Diagram Eksekusi

```
[User klik "Data Jurusan" di sidebar]
        │
        ▼
pindahMenu('jurusan')  ─── di JavascriptCore.html / Javascript.html
        │
        ├─► Sembunyikan semua modul
        ├─► Tampilkan modulJurusan
        ├─► Update headerTitle → "Manajemen Data Jurusan"
        └─► Panggil loadDataJurusan()
                 │
                 ▼
loadDataJurusan() → loadData('jurusan')  ─── di JavascriptCrud.html
        │
        ├─► Set tbody "Memuat..."
        └─► google.script.run.getJurusan()
                 │
                 ▼
getJurusan()  ─── di Jurusan.js (server-side)
        │
        ├─► Baca sheet "Jurusan" dari Spreadsheet
        └─► Kembalikan Array 2D ke client
                 │
                 ▼
renderTable('jurusan', data)  ─── di JavascriptCrud.html
        │
        ├─► Loop data → render baris <tr>
        └─► Tampilkan tombol Edit & Hapus per baris
                 │
                 ▼
[User isi form → klik Simpan]
        │
        ▼
simpanData('jurusan')
        │
        ├─► Ambil nilai dari form (getFieldValue)
        ├─► Validasi: obj.nama wajib diisi
        ├─► Tentukan: createJurusan (jika id kosong) / updateJurusan (jika id ada)
        └─► google.script.run.createJurusan(obj) / updateJurusan(obj)
                 │
                 ▼
createJurusan(obj) / updateJurusan(obj)  ─── di Jurusan.js
        │
        ├─► Validasi server-side
        ├─► Tulis ke sheet
        └─► Return { success, message }
                 │
                 ▼
[Client menerima response]
        │
        ├─► success? → Toast hijau, resetForm, loadData (refresh tabel)
        └─► error?   → Toast merah dengan pesan error
```


## 🚀 Panduan Git

### Alur kerja yang direkomendasikan
```bash
git status
git add .
git commit -m "feat: perbaikan template GAS"
git push origin main
```

Untuk pengembangan fitur, gunakan branch terpisah:
```bash
git checkout -b fitur/nama-fitur
git push -u origin fitur/nama-fitur
```

