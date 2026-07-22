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

---

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

