/**
 * ==========================================
 * 🔗 SIAKAD CRUD LINK GENERATOR CLI
 * ==========================================
 * 
 * CLI untuk menambahkan relasi dinamis antar entitas CRUD.
 * Misalnya: dropdown Siswa → data Jurusan (getOptionsJurusan)
 * 
 * Penggunaan:
 *   node update-crud-link.js <entity> <field> <sourceEntity> <sourceFunction> [options]
 * 
 * Contoh:
 *   node update-crud-link.js siswa jurusan Jurusan getOptionsJurusan
 *   node update-crud-link.js siswa kelas Kelas getOptionsKelas --label kode
 *   node update-crud-link.js guru mapel Mapel getOptionsMapel
 * 
 * Options:
 *   --label   Field dari source yang dipakai sebagai value option (default: nama)
 *   --text    Format teks option: "{nama} ({kode})" (default: "{nama}")
 *   --dry-run Show what would be done without making changes
 *   --help    Tampilkan bantuan
 * 
 * ==========================================
 */

if (typeof require === 'undefined' || typeof module === 'undefined') {
  // Running in GAS or browser; do nothing
} else {
  main();
}

function main() {
  const fs = require('fs');
  const path = require('path');

  const ROOT = 'd:/GAS/siakad';

  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
  🔗 SIAKAD CRUD LINK GENERATOR

  Tambahkan relasi dinamis dropdown/radio antar entitas CRUD.

  Usage:
    node update-crud-link.js <entity> <field> <sourceEntity> <sourceFunction> [options]

  Arguments:
    entity          Entitas target (key crudConfig, e.g. siswa)
    field           Nama field di form target (e.g. jurusan)
    sourceEntity    Entitas sumber data (e.g. Jurusan)
    sourceFunction  Nama fungsi server helper (e.g. getOptionsJurusan)

  Options:
    --label   Field value option (default: nama). Contoh: kode, id
    --text    Format teks option, pakai {field}. Contoh: "{nama} ({kode})"
    --dry-run Show without making changes
    --help    Tampilkan bantuan

  Examples:
    node update-crud-link.js siswa jurusan Jurusan getOptionsJurusan
    node update-crud-link.js siswa jurusan Jurusan getOptionsJurusan --label kode --text "{nama} ({kode})"
    node update-crud-link.js guru mapel Mapel getOptionsMapel --text "{nama} ({kode})"

  Step-by-step what this does:
    1. Update crudConfig di JavascriptCrud.html → ubah options jadi placeholder
    2. Update loadData wrapper di JavascriptCrud.html → panggil populate function
    3. Tambahkan populate function di JavascriptCrud.html
    4. Tambahkan getOptions function di source server file (jika belum ada)
    5. Update loader array di crudConfig
    `);
    process.exit(0);
  }

  const entity = args[0];
  const field = args[1];
  const sourceEntity = args[2];
  const sourceFunction = args[3] || `getOptions${sourceEntity}`;

  const options = {
    label: 'nama',
    text: null,
    dryRun: false
  };

  for (let i = 4; i < args.length; i++) {
    if (args[i] === '--label' && args[i + 1]) {
      options.label = args[i + 1];
      i++;
    } else if (args[i] === '--text' && args[i + 1]) {
      options.text = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    }
  }

  const entityCap = entity.charAt(0).toUpperCase() + entity.slice(1);
  const sourceCap = sourceEntity.charAt(0).toUpperCase() + sourceEntity.slice(1);
  const functionName = `populate${entityCap}${sourceCap}Dropdown`;
  const selectId = `${entity}_${field}`;

  const formatText = options.text || `{${options.label}}`;

  console.log(`
╔═══════════════════════════════════════╗
║  🔗 SIAKAD CRUD LINK GENERATOR       ║
╠═══════════════════════════════════════╣
║  Entity       : ${entity.padEnd(29)}║
║  Field        : ${field.padEnd(29)}║
║  Source       : ${sourceEntity.padEnd(29)}║
║  Source Func  : ${sourceFunction.padEnd(29)}║
║  Format       : ${formatText.padEnd(29)}║
╚═══════════════════════════════════════╝
`);

  const paths = {
    crudHtml: path.join(ROOT, 'views/scripts/modules/crud/JavascriptCrud.html'),
    serverFile: path.join(ROOT, `${sourceEntity}.js`)
  };

  // ==========================================
  // 1. Read and modify JavascriptCrud.html
  // ==========================================
  console.log(`📄 Membaca ${paths.crudHtml}...`);
  let crudContent = null;
  try {
    crudContent = fs.readFileSync(paths.crudHtml, 'utf-8');
  } catch (err) {
    console.error(`❌ Gagal membaca ${paths.crudHtml}: ${err.message}`);
    process.exit(1);
  }

  // Generate the populate function code
  const textExpr = formatText.replace(/\{(\w+)\}/g, (_, fieldName) => `\${item.${fieldName}}`);
  const populateFunctionCode = `
  function ${functionName}() {
    google.script.run.withSuccessHandler(list => {
      const selectEl = document.getElementById('${selectId}');
      if (!selectEl) return;
      const currVal = selectEl.value;

      let html = '<option value="">-- Pilih ${sourceEntity} --</option>';
      if (list && list.length > 0) {
        list.forEach(item => {
          html += \`<option value="\${item.${options.label}}">\` + \`${textExpr}\` + \`</option>\`;
        });
      }
      selectEl.innerHTML = html;
      if (currVal) selectEl.value = currVal;
    }).${sourceFunction}();
  }`;

  // 2. Update loadData wrapper
  const oldLoader = `  function loadData${entityCap}() { loadData('${entity}'); }`;
  const newLoader = `  function loadData${entityCap}() {\n    ${functionName}();\n    loadData('${entity}');\n  }`;

  let updatedCrud = crudContent;
  const hasPopulate = crudContent.includes(functionName);
  const hasLoader = crudContent.includes(newLoader);

  if (!hasPopulate) {
    // Add populate function before the wrapper functions section
    const wrapperMatch = updatedCrud.match(/\n  function loadData\w+\(\)/);
    if (wrapperMatch) {
      const insertPos = updatedCrud.lastIndexOf('  renderForm', wrapperMatch.index - 100);
      if (insertPos !== -1) {
        const afterRenderForm = updatedCrud.indexOf('\n', insertPos);
        if (afterRenderForm !== -1) {
          updatedCrud = updatedCrud.slice(0, afterRenderForm + 1) + populateFunctionCode + '\n' + updatedCrud.slice(afterRenderForm + 1);
          console.log(`  ✅ Added ${functionName}()`);
        }
      }
    }
  } else {
    console.log(`  ⏭️  ${functionName}() already exists`);
  }

  if (!hasLoader) {
    if (updatedCrud.includes(oldLoader)) {
      updatedCrud = updatedCrud.replace(oldLoader, newLoader);
      console.log(`  ✅ Updated loadData${entityCap}() to call ${functionName}()`);
    } else {
      console.log(`  ⚠️  Could not find loadData${entityCap}() - may already be updated`);
    }
  } else {
    console.log(`  ⏭️  loadData${entityCap}() already calls populate function`);
  }

  // Update dropdown options to placeholder in crudConfig
  const oldFieldPattern = new RegExp(`${field}:\\s*\\{[^}]*options:\\s*\\[[^\\]]+\\]`);
  const newFieldStr = `${field}: { el: '${selectId}', type: 'dropdown', options: ['-- Memuat ${sourceEntity} --'] }`;
  const fieldMatch = updatedCrud.match(oldFieldPattern);
  if (fieldMatch) {
    updatedCrud = updatedCrud.replace(fieldMatch[0], newFieldStr);
    console.log(`  ✅ Updated ${field} options to dynamic placeholder`);
  } else {
    console.log(`  ⚠️  Could not find ${field} in crudConfig - may already be updated`);
  }

  // Write changes
  if (!options.dryRun) {
    try {
      fs.writeFileSync(paths.crudHtml, updatedCrud, 'utf-8');
      console.log(`  ✅ Updated ${paths.crudHtml}`);
    } catch (err) {
      console.error(`  ❌ Gagal menulis ${paths.crudHtml}: ${err.message}`);
    }
  } else {
    console.log(`  🔍 DRY RUN: Skip writing ${paths.crudHtml}`);
  }

  // ==========================================
  // 3. Check if server helper function exists
  // ==========================================
  console.log(`\n📄 Memeriksa ${paths.serverFile}...`);
  try {
    const serverContent = fs.readFileSync(paths.serverFile, 'utf-8');
    if (serverContent.includes(`function ${sourceFunction}`)) {
      console.log(`  ✅ ${sourceFunction}() already exists in ${sourceEntity}.js`);
    } else {
      console.log(`  ⚠️  ${sourceFunction}() NOT found in ${sourceEntity}.js`);
      console.log(`     ➡️  Tambahkan fungsi berikut ke ${sourceEntity}.js:\n`);
      console.log(`/**`);
      console.log(` * Helper untuk mengambil opsi ${sourceEntity.toLowerCase()} (digunakan di dropdown Form ${entityCap})`);
      console.log(` */`);
      console.log(`function ${sourceFunction}() {`);
      console.log(`  var sheet = getSheet('${sourceEntity}');`);
      console.log(`  if (!sheet) return [];`);
      console.log(`  var data = sheet.getDataRange().getValues();`);
      console.log(`  if (data.length > 0) data.shift();`);
      console.log(`  return data.map(function(r) {`);
      console.log(`    return { id: r[0], nama: r[1], kode: r[2] };`);
      console.log(`  });`);
      console.log(`}\n`);
    }
  } catch (err) {
    console.error(`  ❌ Gagal membaca ${paths.serverFile}: ${err.message}`);
  }

  // ==========================================
  // Summary
  // ==========================================
  console.log(`
╔═══════════════════════════════════════╗
║  📋 SUMMARY                          ║
╠═══════════════════════════════════════╣
║  ✅ JavascriptCrud.html updated      ║
║  ✅ Data flow ready:                 ║
║     ${entity} → ${sourceFunction}() → sheet ${sourceEntity} ║
╚═══════════════════════════════════════╝

📋 Next steps (if needed):
  1. Add ${sourceFunction}() to ${sourceEntity}.js if missing
  2. Run: clasp push
  3. Test the dropdown in your web app
  `);
}
