# Default Template Starter

Struktur ini dipersiapkan sebagai starter template untuk project baru berbasis Google Apps Script.

## Tujuan
- Pisahkan helper, core, dan modul
- Memudahkan copy-paste ke project baru
- Menyediakan pola login, dashboard, CRUD, laporan, dan helper

## Struktur
- helper.js: fungsi utilitas umum seperti toast dan gasRun
- core.js: registrasi menu dan navigasi utama
- modules/login.js: alur login/logout
- modules/crud.js: pola CRUD yang bisa dipakai ulang

## Susunan folder yang disarankan
- views/layout/: bagian layout utama seperti Head, Aside, Index
- views/auth/: form login dan komponen autentikasi
- views/modules/: file view khusus untuk dashboard, CRUD, laporan
- views/scripts/helper/: helper UI reusable
- views/scripts/core/: registrasi menu dan navigasi
- views/scripts/modules/: modul login, crud, nilai, laporan, dashboard

## Catatan
File ini bersifat starter dan masih perlu disesuaikan dengan kebutuhan modul masing-masing project.
