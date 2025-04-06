
let studentData = [];

document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        studentData = XLSX.utils.sheet_to_json(sheet);
        renderTable();
    };
    reader.readAsArrayBuffer(file);
});

document.getElementById('searchInput').addEventListener('input', function () {
    renderTable(this.value);
});

function renderTable(searchText = '') {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';
    studentData.forEach((student, index) => {
        if (searchText && !student['姓名'].includes(searchText)) return;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student['姓名']}</td>
            <td><input type="number" value="${student['加分'] || 0}" onchange="updateScore(${index}, this.value, '加分')"></td>
            <td><input type="number" value="${student['减分'] || 0}" onchange="updateScore(${index}, this.value, '减分')"></td>
            <td>${(student['总分'] || 0)}</td>
            <td><button onclick="recalculate(${index})">更新</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function updateScore(index, value, type) {
    studentData[index][type] = parseFloat(value);
}

function recalculate(index) {
    const 加 = parseFloat(studentData[index]['加分']) || 0;
    const 减 = parseFloat(studentData[index]['减分']) || 0;
    studentData[index]['总分'] = 加 - 减;
    renderTable(document.getElementById('searchInput').value);
}

function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(studentData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, '导出学生数据.xlsx');
}
