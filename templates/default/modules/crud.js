function setupCrudModule(moduleName, config) {
  const formId = `${moduleName}Form`;
  const tableId = `${moduleName}Table`;
  const saveBtnId = `${moduleName}SaveBtn`;
  const listBtnId = `${moduleName}ListBtn`;

  function renderTable(rows) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;
    tbody.innerHTML = '';
    rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-4 py-2 border-b">${row[config.idField] || ''}</td>
        <td class="px-4 py-2 border-b">${row[config.displayField] || ''}</td>
        <td class="px-4 py-2 border-b text-right">
          <button onclick="edit${capitalize(moduleName)}('${row[config.idField]}')" class="text-blue-600">Edit</button>
          <button onclick="delete${capitalize(moduleName)}('${row[config.idField]}')" class="text-red-600 ml-2">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  document.getElementById(listBtnId)?.addEventListener('click', () => {
    gasRun(config.listFn, {}, res => {
      if (res.success) renderTable(res.data || []);
      else showToast(res.message || 'Gagal memuat data', 'error');
    });
  });

  document.getElementById(saveBtnId)?.addEventListener('click', () => {
    const payload = {};
    config.fields.forEach(field => {
      payload[field.name] = document.getElementById(field.inputId)?.value || '';
    });

    gasRun(config.saveFn, payload, res => {
      if (res.success) {
        showToast(res.message || 'Berhasil disimpan');
        document.getElementById(formId)?.reset();
        document.getElementById(listBtnId)?.click();
      } else {
        showToast(res.message || 'Gagal menyimpan', 'error');
      }
    });
  });
}
