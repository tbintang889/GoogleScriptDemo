# SIAKAD - Sistem Informasi Akademik (Google Apps Script Web App)

SIAKAD adalah aplikasi web **Single Page Application (SPA)** berbasis **Google Apps Script** dan **TailwindCSS** yang digunakan untuk mengelola data akademik sekolah secara lengkap, meliputi Data Siswa, Guru, Mata Pelajaran, Nilai, Laporan, dan Dashboard Analitik. Aplikasi ini terintegrasi langsung dengan **Google Sheets** sebagai database-nya.

---

## 📋 Daftar Isi
1. [Prasyarat Sistem](#-prasyarat-sistem)
2. [Arsitektur Proyek & Struktur File](#-arsitektur-proyek--struktur-file)
3. [Cara Pakai & Instalasi](#-cara-pakai--instalasi)
   - [Langkah 1: Setup Google Sheets](#langkah-1-setup-google-sheets-database)
   - [Langkah 2: Konfigurasi Kode Lokal](#langkah-2-konfigurasi-kode-lokal)
   - [Langkah 3: Push ke Apps Script](#langkah-3-push-ke-apps-script)
   - [Langkah 4: Deploy Web App](#langkah-4-deploy-web-app)
4. [🔄 Alur Sistem](#-alur-sistem)
   - [Diagram Alur Kerja](#diagram-alur-kerja)
   - [Penjelasan Teknis Alur](#penjelasan-teknis-alur)
   - [Pola JOIN / Lookup Antar Sheet](#pola-join--lookup-antar-sheet)
   - [Sistem Navigasi (menuRegistry)](#sistem-navigasi-menuregistry)
5. [🛠️ Panduan Clasp](#%EF%B8%8F-panduan-clasp-command-line-apps-script-projects)
6. [🚀 Panduan Git](#-panduan-git)

---

## 💻 Prasyarat Sistem
Sebelum memulai, pastikan Anda telah memasang tool berikut:
* [Node.js](https://nodejs.org/) (minimal versi 16)
* [Git](https://git-scm.com/)
* Akun Google untuk mengakses Google Sheets & Google Apps Script

---

## 📁 Arsitektur Proyek & Struktur File

Proyek ini mengikuti pola **file-per-modul** untuk kemudahan perawatan dan pengembangan ke depan.

### Server-Side Scripts (`.js`)
| File | Fungsi |
|---|---|
| `Code.js` | Entry point, `doGet()`, `include()`, autentikasi `checkLogin()`, dan helper `getSheet()`, `generateId()` |
| `Siswa.js` | CRUD Data Siswa: `getSiswa()`, `createSiswa()`, `updateSiswa()`, `deleteSiswa()` |
| `Guru.js` | CRUD Data Guru: `getGuru()`, `createGuru()`, `updateGuru()`, `deleteGuru()` |
| `Mapel.js` | CRUD Mata Pelajaran: `getMapel()`, `createMapel()`, `updateMapel()`, `deleteMapel()`, `getOptionsMapel()` |
| `Nilai.js` | CRUD Nilai + In-Memory JOIN: `getNilai()`, `createNilai()`, `updateNilai()`, `deleteNilai()`, `getOptionsSiswaDanGuru()`, `hitungPredikat()` |
| `laporanNilai.js` | Laporan Rekapitulasi: `getLaporanNilai()` dengan JOIN 3 sheet + opsi filter |
| `dashboard.js` | Analitik Dashboard dipecah per modul: `getDashboardSummary()`, `getDashboardRawData()`, `calculateKpiStats()`, `calculateSiswaPerJurusan()`, `calculateMapelStats()`, `calculateGuruStats()`, `calculateDistribusiPredikat()`, `calculateTop5Siswa()`, `calculateRecentNilai()` |

### Client-Side Views (`.html`)
| File | Keterangan |
|---|---|
| `Index.html` | Layout utama: perakit semua komponen via `include()` |
| `Head.html` | CDN: TailwindCSS, Chart.js, Google Fonts |
| `Login.html` | Form login (username & password) |
| `Aside.html` | Sidebar navigasi (menuregistry-aware) |
| `SiswaView.html` | Form CRUD & Tabel Data Siswa |
| `GuruView.html` | Form CRUD & Tabel Data Guru |
| `MapelView.html` | Form CRUD & Tabel Mata Pelajaran |
| `NilaiView.html` | Form CRUD Nilai dengan dropdown Siswa & Guru/Mapel + Filter |
| `laporanNilaiView.html` | Laporan Read-Only: tabel JOIN + filter Mapel/Guru/Siswa + statistik |
| `dashboardView.html` | Dashboard: 4 KPI Cards, 4 Chart.js Infografis, Leaderboard, dan Penilaian Terbaru |
| `Javascript.html` | Semua logika JavaScript client-side (termasuk `menuRegistry`) |

### Google Sheets (Database)
| Sheet | Kolom |
|---|---|
| `Users` | `username`, `password` |
| `Siswa` | `id`, `nama`, `kelas`, `jurusan` |
| `Guru` | `id`, `nama`, `mapel`, `nohp` |
| `Mapel` | `id`, `nama_mapel`, `kode_mapel` |
| `Nilai` | `id`, `siswa_id`, `guru_id`, `nilai`, `predikat` |

---

## 🔌 Cara Pakai & Instalasi

### Langkah 1: Setup Google Sheets (Database)
Buat sebuah Spreadsheet baru di Google Drive dan tambahkan sheet-sheet berikut secara manual:

1. **Sheet `Users`**: Baris pertama adalah header (`username`, `password`). Tambahkan satu akun admin di baris ke-2.
2. **Sheet `Siswa`**: Header: `id`, `nama`, `kelas`, `jurusan`. Biarkan kosong, data akan diisi via aplikasi.
3. **Sheet `Guru`**: Header: `id`, `nama`, `mapel`, `nohp`.
4. **Sheet `Mapel`**: Header: `id`, `nama_mapel`, `kode_mapel`.
5. **Sheet `Nilai`**: Header: `id`, `siswa_id`, `guru_id`, `nilai`, `predikat`.

> [!IMPORTANT]
> Salin **Spreadsheet ID** dari URL Spreadsheet Anda.
> Format URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

> [!TIP]
> Sheet `Nilai` dan `Mapel` akan **dibuat otomatis** oleh aplikasi saat pertama kali menyimpan data jika belum ada.

---

### Langkah 2: Konfigurasi Kode Lokal
1. Buka file `Code.js`.
2. Ganti nilai `SPREADSHEET_ID` dengan ID Spreadsheet Anda:
   ```javascript
   var SPREADSHEET_ID = "SPREADSHEET_ID_ANDA_DI_SINI";
   ```

---

### Langkah 3: Push ke Apps Script
```bash
clasp push
```

---

### Langkah 4: Deploy Web App
1. Buka editor Apps Script: `clasp open`
2. Klik **Deploy** → **New deployment** → Tipe: **Web app**
3. Konfigurasi:
   * **Execute as:** `Me`
   * **Who has access:** `Anyone` atau `Myself`
4. Klik **Deploy** dan salin **Web app URL** yang diberikan.

---

## 🔄 Alur Sistem

### Diagram Alur Kerja

```mermaid
sequenceDiagram
    autonumber
    Actor User as User / Admin
    participant Client as Web App (Client Side)
    participant GAS as Google Apps Script (Server)
    database GSheets as Google Sheets (Database)

    User->>Client: Buka URL Web App
    Client->>GAS: doGet() → Rakit Index.html
    GAS-->>Client: Kirim HTML Lengkap (Login Screen)
    User->>Client: Input Kredensial + Klik Masuk
    Client->>GAS: google.script.run.checkLogin(u, p)
    GAS->>GSheets: Cari di Sheet "Users"
    GSheets-->>GAS: Match / Tidak Match
    GAS-->>Client: { success: true/false, message }

    alt Login Sukses
        Client->>Client: Sembunyikan Login, pindahMenu('dashboard')
        Client->>GAS: getDashboardSummary()
        GAS->>GSheets: JOIN: Siswa + Guru + Mapel + Nilai
        GSheets-->>GAS: Data agregasi lengkap
        GAS-->>Client: KPI, charts, leaderboard, recent nilai
        Client->>Client: Render Chart.js + Widget Dashboard

        User->>Client: Klik menu "Data Nilai"
        Client->>GAS: getNilai() + getOptionsSiswaDanGuru()
        GAS->>GSheets: JOIN: Nilai → Siswa, Nilai → Guru
        GAS-->>Client: Data Nilai + opsi dropdown Siswa & Guru

        User->>Client: Klik menu "Laporan Nilai"
        Client->>GAS: getLaporanNilai()
        GAS->>GSheets: JOIN: Nilai → Siswa, Nilai → Guru, Mapel
        GAS-->>Client: Data laporan + opsi filter (Mapel, Guru, Siswa)
    else Login Gagal
        Client-->>User: Toast Error
    end
```

### Penjelasan Teknis Alur

1. **Inisialisasi & Assembling**: `doGet()` merender `Index.html` yang mengumpulkan semua sub-komponen via fungsi `include()` (Head, Login, Aside, semua View, Javascript).
2. **Autentikasi**: Semua panggilan server menggunakan `google.script.run.withSuccessHandler(fn).namaFungsi(args)`. Setelah login sukses, navigasi otomatis dialihkan ke Dashboard.
3. **Pola SPA (menuRegistry)**: Navigasi antar halaman menggunakan sistem `menuRegistry` terpusat tanpa reload. Setiap menu memiliki `title` dan `loader` function yang dipanggil otomatis saat menu diklik.

### Pola JOIN / Lookup Antar Sheet

SIAKAD menggunakan pola **In-Memory JOIN** di server-side untuk menggabungkan data dari beberapa sheet tanpa formula Spreadsheet:

```javascript
// 1. Baca sheet master, bangun Map/Dictionary untuk lookup O(1)
var siswaMap = {};
dataSiswa.forEach(function(row) {
  siswaMap[row[0].toString()] = { nama: row[1], kelas: row[2], jurusan: row[3] };
});

// 2. Loop data transaksi, lookup ke Map berdasarkan Foreign Key
var result = dataNilai.map(function(row) {
  var infoSiswa = siswaMap[row[1].toString()] || { nama: "Tidak Ditemukan" };
  return { ...row, namaSiswa: infoSiswa.nama }; // Data sudah ter-JOIN
});
```
Diimplementasikan di: `Nilai.js`, `laporanNilai.js`, dan `dashboard.js`.

### Sistem Navigasi (menuRegistry)

Navigasi antar modul dikelola oleh sebuah objek konfigurasi terpusat di `Javascript.html`. Untuk menambah menu baru di masa depan, cukup daftarkan 1 entry baru:

```javascript
const menuRegistry = {
  dashboard:     { title: "🏠 Dashboard Analitik", loader: () => loadDataDashboard() },
  siswa:         { title: "Manajemen Data Siswa",  loader: () => loadDataSiswa() },
  guru:          { title: "Manajemen Data Guru",   loader: () => loadDataGuru() },
  mapel:         { title: "Manajemen Data Mapel",  loader: () => loadDataMapel() },
  nilai:         { title: "Manajemen Data Nilai",  loader: () => loadDataNilai() },
  laporanNilai:  { title: "📊 Laporan Nilai",      loader: () => loadDataLaporanNilai() }
  // Tambahkan menu baru cukup dengan 1 baris di sini
};
```

---

## 🛠️ Panduan Clasp (Command Line Apps Script Projects)

`clasp` adalah tool buatan Google untuk mengelola proyek Apps Script secara lokal.

### Perintah Penting Clasp:

* **Instalasi Clasp Secara Global**
  ```bash
  npm install -g @google/clasp
  ```

* **Login ke Akun Google** (Hanya sekali di awal)
  ```bash
  clasp login
  ```

* **Clone Proyek dari Server ke Lokal**
  ```bash
  clasp clone <scriptId>
  ```
  *(File `.clasp.json` di repositori ini sudah berisi `scriptId` yang dikonfigurasi)*

* **Sinkronisasi Kode dari Server → Lokal (Pull)**
  ```bash
  clasp pull
  ```

* **Unggah Kode Lokal → Server (Push)**
  ```bash
  clasp push
  ```

* **Push + Auto-Watch Perubahan File**
  ```bash
  clasp push --watch
  ```

* **Buka Editor Apps Script di Browser**
  ```bash
  clasp open
  ```

* **Buat Deployment Baru**
  ```bash
  clasp deploy
  ```

---

## 🚀 Panduan Git

### Alur Kerja Standar:

1. **Inisialisasi** (hanya sekali)
   ```bash
   git init
   git remote add origin <URL_GITHUB>
   git branch -M main
   ```

2. **Cek status perubahan**
   ```bash
   git status
   ```

3. **Staging & Commit**
   ```bash
   git add .
   git commit -m "feat: deskripsi singkat perubahan"
   ```

4. **Push ke GitHub**
   ```bash
   git push origin main
   ```

5. **Pull perubahan terbaru dari tim**
   ```bash
   git pull origin main
   ```

6. **Kembangkan fitur di branch terpisah (Best Practice)**
   ```bash
   git checkout -b fitur/nama-fitur
   # coding...
   git add .
   git commit -m "feat: nama fitur"
   git push origin fitur/nama-fitur
   ```

7. **Alur Kerja Harian yang Direkomendasikan**
   ```bash
   # Sebelum coding: pastikan kode lokal terbaru
   git pull origin main

   # Setelah coding selesai
   git add .
   git commit -m "pesan commit"
   clasp push          # Unggah ke Google Apps Script
   git push origin main  # Simpan ke GitHub
   ```
