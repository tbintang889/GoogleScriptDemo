# 🚀 SIAKAD Starter Template

## Cara Pakai

### 1. Copy folder ini ke project baru
```bash
cp -r templates/default/starter/ ../project-baru/
cd ../project-baru/
```

### 2. Setup Google Sheets
Buat spreadsheet baru dengan sheet:
| Sheet | Header |
|-------|--------|
| `Users` | `username`, `password` |

### 3. Generate entitas CRUD
```bash
node ../siakad/generate-crud.js Barang --fields nama:text,kategori:dropdown:Elektronik,Furniture,stok:number,harga:number
node ../siakad/generate-crud.js Kategori --fields nama:text,kode:text
```

### 4. Konfigurasi & Deploy
```bash
# Setup SPREADSHEET_ID
# Buka Code.js → jalankan setupConfig()
clasp push
clasp open
```

## Struktur
```
├── Code.js              # Entry point, login, helper
├── _helper.js            # Utility pagination
├── appsscript.json
├── .clasp.json
├── .claspignore
├── views/
│   ├── layout/          # Index, Head, Aside
│   ├── auth/            # Login form
│   └── modules/         # View module (kosong, isi via generator)
└── views/scripts/
    ├── Javascript.html   # Orchestrator include
    ├── helper/           # showToast, gasRun, capitalize
    ├── core/             # menuRegistry, pindahMenu
    └── modules/
        ├── login/        # Login logic
        ├── crud/         # CRUD config + render
        ├── dashboard/    # Dashboard logic
        └── laporan/      # Laporan logic
```

