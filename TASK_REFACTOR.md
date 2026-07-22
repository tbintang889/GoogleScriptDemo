# Template Refactor Plan: Standar Proyek GAS Baru

Dokumen ini menyusun ulang kritik dari TEMPLATE_NOTES.md menjadi blueprint modular yang siap dipakai sebagai template utama untuk proyek baru. Fokus utamanya adalah menyatukan standar untuk:
- Login / autentikasi
- Dashboard
- CRUD
- Laporan
- Helper / utilitas umum

---

## 1. Tujuan Utama

Membuat starter template yang mudah di-copy-paste untuk proyek GAS baru dengan arsitektur yang konsisten, aman, dan siap dikembangkan.

Target modul utama:
1. Login
2. Dashboard
3. CRUD
4. Laporan
5. Helper / _helper

---

## 2. Status Implementasi Saat Ini

### Sudah dikerjakan
- [x] Konfigurasi spreadsheet dipindah ke PropertiesService di Code.js
- [x] Login memakai validasi server-side dan hash password dasar
- [x] Helper error handling terpusat via `gasRun`
- [x] CRUD memakai `tableColumns` yang eksplisit untuk render tabel
- [x] Helper pagination dasar dibuat di _helper.js
- [x] File template default disiapkan sebagai acuan pemisahan modul
- [x] Bagian frontend dipisah ke modul modular: helper, core, login, CRUD, nilai, laporan, dashboard
- [x] File utama Javascript.html kini berperan sebagai orchestrator include untuk modul modular

### Belum / prioritas berikutnya
- [ ] Menyusun default starter bundle yang lebih rapi untuk copy-paste ke project baru
- [ ] Menambahkan dokumentasi README yang lebih detail untuk arsitektur modular
- [ ] Menyelaraskan semua modul (login, dashboard, crud, laporan) dengan pola yang sama di template default
- [ ] Menguji alur end-to-end setelah pemisahan file di lingkungan runtime Apps Script

---

## 3. Kritik Utama yang Harus Ditangani

### A. Konfigurasi hardcoded
- [x] Hilangkan nilai spreadsheet ID yang tertulis langsung di kode.
- [x] Pakai PropertiesService untuk menyimpan konfigurasi sensitif.
- [x] Sediakan fungsi setup awal untuk konfigurasi pertama kali.

### B. Keamanan login
- [x] Hindari password plaintext di sheet Users.
- [x] Terapkan hash password sebelum simpan.
- [x] Simpan password secara aman dan validasi login di server.

### C. Error handling yang konsisten
- [x] Tambahkan helper terpusat untuk semua panggilan `google.script.run`.
- [x] Gunakan `withFailureHandler` di semua operasi.
- [x] Tampilkan pesan error lewat toast yang konsisten.

### D. Validasi server-side
- [x] Validasi semua input CRUD di server.
- [x] Pastikan fungsi CRUD mengembalikan objek `{ success, message }`.
- [x] Hindari proses write ke sheet jika input tidak valid.

### E. Paginasi untuk data besar
- [x] Sediakan helper `getSheetPaginated(sheetName, offset, limit)`.
- [ ] Terapkan pagination untuk operasi baca data yang potensial besar.
- [ ] Pastikan UI dapat memuat data secara bertahap.

### F. Struktur CRUD yang lebih jelas
- [x] Ganti pola `data: []` yang ambigu.
- [x] Pakai struktur kolom eksplisit seperti `tableColumns`.
- [x] Pastikan render tabel mengikuti konfigurasi yang jelas.

### G. Konvensi file dan modularisasi
- [ ] Tetapkan standar arsitektur file yang jelas.
- [ ] Pisahkan modul inti dan modul bisnis secara konsisten.
- [ ] Jadikan file helper sebagai pusat logika reusable.

---

## 4. Struktur Template Target

### Core / inti
- [ ] Code.js → entry point, setup config, helper umum, autentikasi
- [ ] _helper.js → fungsi reusable seperti hitung predikat, formatter, validasi umum
- [ ] Head.html → CDN dan layout global
- [ ] Login.html → form login standar
- [ ] Aside.html → sidebar navigasi
- [ ] Index.html → layout utama dan include komponen

### Modul utama
- [ ] Login module → login, logout, session state
- [ ] Dashboard module → ringkasan KPI, chart, recent activity
- [ ] CRUD module → form + tabel + create/update/delete
- [ ] Laporan module → data read-only dengan filter dan aggregate

### Project-specific modules
- [ ] Modul entitas baru bisa dibuat dengan pola yang sama
- [ ] CRUD module dapat dipakai ulang untuk entitas berbeda
- [ ] Laporan module dapat dipakai untuk berbagai jenis report

---

## 5. Task Implementasi untuk Javascript yang Belum Terpisah

### Peta pemisahan isi Javascript.html

#### A. Helper shared
- Target: `templates/default/helper.js`
- Bagian yang masuk:
  - `showToast`
  - `gasRun`
  - `capitalize`

#### B. Core UI / navigasi
- Target: `templates/default/core.js`
- Bagian yang masuk:
  - `menuRegistry`
  - `registerMenu`
  - `pindahMenu`

#### C. Modul login
- Target: `templates/default/modules/login.js`
- Bagian yang masuk:
  - `prosesLogin`
  - `prosesLogout`

#### D. Modul CRUD generik
- Target: `templates/default/modules/crud.js`
- Bagian yang masuk:
  - `crudConfig`
  - `renderForm`
  - `getFieldValue`
  - `setFieldValue`
  - `loadData`
  - `renderTable`
  - `simpanData`
  - `editData`
  - `resetForm`
  - `hapusData`
- Catatan: wrapper spesifik per entitas seperti `loadDataSiswa`, `simpanGuru`, dan sejenisnya tetap bisa dipertahankan sebagai file modul tambahan atau wrapper kecil.

#### E. Modul nilai (app-specific)
- Target: file modul khusus untuk fitur nilai
- Bagian yang masuk:
  - `rawNilaiData`
  - `loadDataNilai`
  - `populateOptionsSiswaDanGuru`
  - `renderTabelNilai`
  - `filterTabelNilai`
  - `resetFilterNilai`
  - `simpanNilai`
  - `editNilai`
  - `resetFormNilai`
  - `hapusNilai`

#### F. Modul laporan (read-only)
- Target: file modul khusus untuk fitur laporan
- Bagian yang masuk:
  - `rawLaporanData`
  - `loadDataLaporanNilai`
  - `populateFilterLaporanOptions`
  - `renderLaporanTable`
  - `applyFilterLaporan`
  - `resetFilterLaporan`

#### G. Modul dashboard (chart + KPI)
- Target: file modul khusus untuk dashboard
- Bagian yang masuk:
  - `chartJurusanInst`, `chartMapelInst`, `chartPredikatInst`, `chartGuruInst`
  - `loadDataDashboard`
  - `renderDashboard`
  - `renderChartJurusan`
  - `renderChartMapel`
  - `renderChartPredikat`
  - `renderChartGuru`
  - `renderLeaderboard`
  - `renderRecentNilai`

### A. Pisahkan helper shared
- [x] Buat file modular helper: `JavascriptHelper.html`
- [x] Pindahkan fungsi `showToast`, `gasRun`, `capitalize` ke file helper
- [x] Pastikan file ini bisa dipakai ulang di project baru

### B. Pisahkan core UI / navigasi
- [x] Buat file modular core: `JavascriptCore.html`
- [x] Pindahkan `menuRegistry`, `registerMenu`, `pindahMenu` ke file core
- [x] Pastikan navigasi menu bisa dipakai sebagai starter template

### C. Pisahkan modul login
- [x] Buat file modular: `JavascriptLogin.html`
- [x] Pindahkan alur login dan logout ke file ini
- [x] Pastikan modul login siap dipakai ulang

### D. Pisahkan modul CRUD
- [x] Buat file modular: `JavascriptCrud.html`
- [x] Pindahkan konfigurasi CRUD, render form, render tabel, dan operasi simpan/edit/hapus ke file ini
- [x] Pastikan `crudConfig` memakai struktur kolom yang eksplisit

### E. Pisahkan modul dashboard
- [x] Buat file modular: `JavascriptDashboard.html`
- [x] Pindahkan logika dashboard, chart, KPI, leaderboard, recent data ke file ini
- [x] Pastikan data dimuat dengan pendekatan efisien

### F. Pisahkan modul laporan
- [x] Buat file modular: `JavascriptLaporan.html`
- [x] Pindahkan logika filter, render tabel, dan statistik laporan ke file ini
- [x] Pastikan bisa dipakai untuk report read-only yang lebih luas

### G. Susun default starter bundle
- [x] Buat folder `templates/default/` sebagai paket starter siap copy-paste
- [x] Simpan file helper/core/module di dalam folder tersebut
- [x] Siapkan README ringkas di folder default agar mudah dipakai tim

---

## 6. Checklist Penerapan

### Tahap 1 - Fondasi Template
- [x] Siapkan struktur folder inti: Core, Modules, Project-Specific
- [x] Pastikan konfigurasi menggunakan PropertiesService
- [x] Siapkan helper umum di _helper.js

### Tahap 2 - Login & Autentikasi
- [x] Implementasikan flow login standar
- [x] Tambahkan hash password dan validasi server
- [x] Pastikan logout bekerja dengan baik

### Tahap 3 - Dashboard
- [ ] Bangun dashboard basic dengan KPI
- [ ] Integrasikan chart atau widget sederhana
- [ ] Pastikan data dimuat dengan efisien

### Tahap 4 - CRUD Template
- [x] Siapkan template CRUD generik
- [x] Terapkan validasi server-side dan error handling
- [x] Uji create, read, update, delete (secara logika kode)

### Tahap 5 - Laporan
- [ ] Siapkan modul laporan dasar
- [ ] Terapkan filter dan pagination sederhana
- [ ] Pastikan output tetap mudah dibaca

### Tahap 6 - Dokumentasi & Publish
- [ ] Perbarui README dengan alur setup proyek baru
- [ ] Dokumentasikan modul inti dan aturan kontribusi
- [ ] Commit, push, dan upload via Clasp

---

## 7. Workflow Git

### Buat branch baru
```bash
git checkout -b refactor/template-modular
```

### Commit perubahan
```bash
git add .
git commit -m "refactor: build modular GAS starter template"
```

### Push ke GitHub
```bash
git push -u origin refactor/template-modular
```

---

## 8. Workflow Clasp

### Upload ke Apps Script
```bash
clasp push
```

### Buka editor Apps Script
```bash
clasp open
```

### Sinkronisasi dari server ke lokal jika perlu
```bash
clasp pull
```

---

## 9. Definition of Done

Template dianggap siap sebagai modul utama untuk proyek baru jika:
- [ ] Login, Dashboard, CRUD, Laporan, dan helper sudah terpisah dengan jelas
- [x] Konfigurasi aman dan tidak hardcoded
- [x] CRUD dan login memiliki validasi server-side
- [x] Error handling tampil konsisten
- [ ] Struktur file mudah dipakai ulang untuk project baru
- [ ] README dan workflow Git/Clasp sudah siap
