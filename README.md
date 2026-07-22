# SIAKAD - Sistem Informasi Akademik (Google Apps Script Web App)

SIAKAD adalah aplikasi web single-page (SPA) berbasis **Google Apps Script** dan **TailwindCSS** yang digunakan untuk mengelola data Akademik (Siswa dan Guru). Aplikasi ini terintegrasi langsung dengan **Google Sheets** sebagai database-nya.

---

## 📋 Daftar Ini
1. [Prasyarat Sistem](#-prasyarat-sistem)
2. [Cara Pakai & Instalasi](#-cara-pakai--instalasi)
   - [Langkah 1: Setup Google Sheets](#langkah-1-setup-google-sheets)
   - [Langkah 2: Konfigurasi Kode Lokal](#langkah-2-konfigurasi-kode-lokal)
   - [Langkah 3: Push ke Apps Script](#langkah-3-push-ke-apps-script)
   - [Langkah 4: Deploy Web App](#langkah-4-deploy-web-app)
3. [🔄 Alur Sistem](#-alur-sistem)
   - [Diagram Alur Kerja](#diagram-alur-kerja)
   - [Penjelasan Alur](#penjelasan-alur)
4. [🛠️ Panduan Clasp (Command Line Apps Script Projects)](#%EF%B8%8F-panduan-clasp-command-line-apps-script-projects)
5. [🚀 Panduan Git](#-panduan-git)

---

## 💻 Prasyarat Sistem
Sebelum memulai, pastikan Anda telah memasang tool berikut di komputer Anda:
* [Node.js](https://nodejs.org/) (minimal versi 16)
* [Git](https://git-scm.com/)
* Akun Google untuk mengakses Google Sheets & Google Apps Script.

---

## 🔌 Cara Pakai & Instalasi

### Langkah 1: Setup Google Sheets
Aplikasi ini membutuhkan database Google Sheets. Buat sebuah Spreadsheet baru di Google Drive dengan struktur lembar kerja (sheet) sebagai berikut:

1. **Sheet `Users`** (untuk autentikasi):
   * Kolom A: `username`
   * Kolom B: `password`
   * *Isi baris pertama dengan header di atas, dan baris kedua dengan data akun (misal: admin / admin123).*

2. **Sheet `Siswa`** (untuk data siswa):
   * Kolom A: `id` (Auto-generated)
   * Kolom B: `nama`
   * Kolom C: `kelas`
   * Kolom D: `jurusan`

3. **Sheet `Guru`** (untuk data guru):
   * Kolom A: `id` (Auto-generated)
   * Kolom B: `nama`
   * Kolom C: `mapel`
   * Kolom D: `nohp`

> [!IMPORTANT]  
> Salin **Spreadsheet ID** dari URL Spreadsheet Anda.  
> Format URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

---

### Langkah 2: Konfigurasi Kode Lokal
1. Buka file `Code.js` di editor lokal Anda.
2. Cari baris konfigurasi berikut (biasanya di baris ke-4):
   ```javascript
   var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
   ```
3. Ganti `"YOUR_SPREADSHEET_ID_HERE"` dengan ID Spreadsheet yang telah Anda salin sebelumnya.

---

### Langkah 3: Push ke Apps Script
Jika Anda telah mengonfigurasi clasp, jalankan perintah berikut untuk mengunggah semua file kode lokal ke Google Apps Script editor:
```bash
clasp push
```

---

### Langkah 4: Deploy Web App
1. Jalankan perintah `clasp open` untuk membuka editor skrip Google Apps Script di browser Anda.
2. Di dalam editor Apps Script:
   * Klik tombol **Deploy** di bagian kanan atas -> pilih **New deployment**.
   * Pilih tipe deployment: **Web app**.
   * Konfigurasikan hak akses:
     * **Execute as:** `Me (email-anda@gmail.com)`
     * **Who has access:** `Anyone` atau `Myself` (sesuai kebutuhan Anda).
   * Klik **Deploy**.
3. Salin **Web app URL** yang diberikan. Buka URL tersebut di browser untuk menjalankan aplikasi.

---

## 🔄 Alur Sistem

Aplikasi ini berjalan sebagai aplikasi satu halaman (**Single Page Application**) di sisi client, menggunakan Google Apps Script sebagai penyedia server-side API yang terhubung dengan Google Sheets.

### Diagram Alur Kerja

```mermaid
sequenceDiagram
    autonumber
    Actor User as User / Admin
    participant Client as Web App (Client Side)
    participant GAS as Google Apps Script (Server Side)
    database GSheets as Google Sheets (Database)

    %% Alur Load Halaman & Login
    User->>Client: Buka URL Web App
    Client->>GAS: Meminta Halaman Utama (doGet)
    GAS-->>Client: Mengirimkan Index.html (Tampilan Login)
    User->>Client: Input Username & Password + Klik Masuk
    Client->>GAS: google.script.run.checkLogin(user, pass)
    GAS->>GSheets: Cari di Sheet "Users"
    GSheets-->>GAS: Data Cocok/Tidak Cocok
    GAS-->>Client: Return Status Login { success: true/false }

    %% Alur Dashboard & CRUD Siswa
    alt Login Sukses
        Client->>Client: Sembunyikan Form Login, Tampilkan Dashboard
        Client->>GAS: google.script.run.getSiswa() & getGuru()
        GAS->>GSheets: Ambil Data dari Sheet "Siswa" & "Guru"
        GSheets-->>GAS: Array Data Siswa & Guru
        GAS-->>Client: Tampilkan Tabel Data Siswa & Guru
        
        %% Contoh aksi CRUD
        User->>Client: Tambah/Edit Data Siswa
        Client->>GAS: google.script.run.createSiswa(obj) atau updateSiswa(obj)
        GAS->>GSheets: Simpan/Update Baris di Sheet "Siswa"
        GAS-->>Client: Return "Berhasil" & Refresh Tabel
    else Login Gagal
        Client-->>User: Tampilkan Pesan Error / Gagal
    end
```

### Penjelasan Alur
1. **Inisialisasi**: Saat aplikasi diakses, server-side function `doGet()` merender template `Index.html` yang merakit semua sub-komponen HTML (`Head`, `Login`, `Aside`, `SiswaView`, `GuruView`, `Javascript`) menjadi satu kesatuan dokumen utuh.
2. **Autentikasi**: Login diproses secara asinkron di frontend melalui objek global Apps Script Client API `google.script.run`. Fungsi `checkLogin()` di server memverifikasi kecocokan username dan password pada sheet `Users`.
3. **Penyajian Data (SPA)**: Setelah masuk, UI berubah tanpa reload halaman (*state transition*). Modul `Siswa` dan `Guru` akan dimuat secara dinamis dengan memanggil fungsi server `getSiswa()` dan `getGuru()`.
4. **Operasi Database (CRUD)**:
   * **Create**: `createSiswa(obj)` / `createGuru(obj)` menggunakan `appendRow` di Google Sheets untuk membuat baris baru dengan unique ID yang terbuat otomatis menggunakan timestamp.
   * **Read**: Membaca data menggunakan `getDataRange().getValues()` dan menghapus header baris pertama sebelum mengirim ke client.
   * **Update**: Mencocokkan ID di Google Sheets lalu mengubah nilai pada kolom tertentu memakai `setValue()`.
   * **Delete**: Mencari baris dengan ID yang sesuai dan menghapusnya menggunakan `deleteRow()`.

---

## 🛠️ Panduan Clasp (Command Line Apps Script Projects)

`clasp` adalah tool buatan Google untuk memudahkan developer menulis kode Apps Script secara lokal di PC masing-masing, lalu mengunggahnya ke server Google Apps Script menggunakan CLI.

### Perintah Penting Clasp:

* **Instalasi Clasp Secara Global**
  ```bash
  npm install -g @google/clasp
  ```

* **Login ke Akun Google Anda** (Hanya dilakukan sekali di awal)
  ```bash
  clasp login
  ```

* **Menghubungkan/Clone Proyek yang Sudah Ada**
  Jika ingin menyalin proyek dari server ke komputer Anda menggunakan `scriptId`:
  ```bash
  clasp clone <scriptId>
  ```
  *(Catatan: Proyek ini sudah dikonfigurasi dengan file `.clasp.json` yang berisi scriptId target).*

* **Menarik Kode dari Server ke Lokal (Pull)**
  Gunakan ini jika ada perubahan kode yang dibuat langsung di editor browser Apps Script dan Anda ingin menyelaraskannya ke lokal:
  ```bash
  clasp pull
  ```

* **Mengunggah Kode Lokal ke Server (Push)**
  Gunakan ini setelah mengedit file lokal untuk mengirimkan semua kode Anda ke Apps Script:
  ```bash
  clasp push
  ```

* **Memantau Perubahan Kode Secara Realtime (Watch)**
  Secara otomatis mengunggah perubahan file begitu Anda menyimpannya:
  ```bash
  clasp setting watch true
  clasp push --watch
  ```

* **Membuka Editor Apps Script di Browser**
  ```bash
  clasp open
  ```

* **Membuat Versi Deployment Baru**
  ```bash
  clasp deploy
  ```

---

## 🚀 Panduan Git

Git digunakan untuk mencatat riwayat perubahan kode (version control) dan berkolaborasi secara tim melalui repository online (seperti GitHub/GitLab).

### Alur Kerja Git Standar:

1. **Inisialisasi Git di Repositori Baru (Jika belum)**
   ```bash
   git init
   ```

2. **Mengecek Status Perubahan**
   Melihat file apa saja yang telah diubah, dihapus, atau baru ditambahkan:
   ```bash
   git status
   ```

3. **Memasukkan Perubahan ke Staging Area**
   * Untuk memasukkan file tertentu saja:
     ```bash
     git add Code.js
     ```
   * Untuk memasukkan semua perubahan di folder:
     ```bash
     git add .
     ```

4. **Menyimpan Perubahan dengan Commit**
   Tuliskan pesan yang jelas dan deskriptif mengenai perubahan yang dilakukan:
   ```bash
   git commit -m "feat: tambah modul pengelolaan data guru"
   ```

5. **Menghubungkan dengan Repositori Remote (GitHub)** (Hanya sekali di awal)
   ```bash
   git remote add origin <URL_REPOSITORY_GITHUB>
   git branch -M main
   ```

6. **Mengunggah Perubahan ke GitHub (Push)**
   Unggah commit Anda ke repositori utama (branch `main`):
   ```bash
   git push origin main
   ```

7. **Mengambil Perubahan Terbaru dari GitHub (Pull)**
   Gunakan ini sebelum mulai bekerja untuk memastikan kode lokal Anda selalu up-to-date dengan kode terbaru dari tim:
   ```bash
   git pull origin main
   ```

8. **Membuat Fitur Baru di Branch Terpisah (Best Practice)**
   Untuk menjaga branch utama tetap stabil, buatlah branch baru saat ingin mengembangkan fitur:
   ```bash
   git checkout -b fitur-baru
   # Lakukan coding...
   git add .
   git commit -m "feat: penjelasan fitur baru"
   git push origin fitur-baru
   ```
