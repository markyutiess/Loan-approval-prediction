// DATASET MODULE
console.log('data.js loaded');

window.rawData = null;

// Sample dataset
window.getSampleDataset = function() {
    return [
        { total_income: 5849, loan_amount: 128, credit_history: 100, dti_ratio: 2.5, default_flag: 0 },
        { total_income: 6091, loan_amount: 128, credit_history: 100, dti_ratio: 2.4, default_flag: 1 },
        { total_income: 3000, loan_amount: 66, credit_history: 100, dti_ratio: 2.8, default_flag: 0 },
        { total_income: 4941, loan_amount: 120, credit_history: 100, dti_ratio: 2.6, default_flag: 0 },
        { total_income: 6000, loan_amount: 141, credit_history: 100, dti_ratio: 2.7, default_flag: 0 }
    ];
};

// Display dataset in table
window.displayDataset = function(data) {
    console.log('Displaying dataset', data);
    
    if (!data || data.length === 0) {
        document.getElementById('dataTable').innerHTML = '<thead><tr><th>No data</th></tr></thead><tbody></tbody>';
        return;
    }
    
    // Create table header
    let thead = '<thead><tr><th>Total Income</th><th>Loan Amount</th><th>Credit History</th><th>DTI Ratio</th><th>Default Status</th></tr></thead>';
    
    // Create table body
    let tbody = '<tbody>';
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        tbody += '<tr>';
        tbody += '<td>' + row.total_income + '</td>';
        tbody += '<td>' + row.loan_amount + '</td>';
        tbody += '<td>' + row.credit_history + '</td>';
        tbody += '<td>' + row.dti_ratio.toFixed(2) + '</td>';
        tbody += '<td>' + (row.default_flag === 1 ? 'Default' : 'Approved') + '</td>';
        tbody += '</tr>';
    }
    tbody += '</tbody>';
    
    document.getElementById('dataTable').innerHTML = thead + tbody;
    document.getElementById('datasetInfo').innerHTML = 'Total samples: ' + data.length + ' | Features: Total Income, Loan Amount, Credit History, DTI Ratio';
};

// Load CSV file
window.loadCSVFile = function(file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
        const text = evt.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            const values = lines[i].split(',');
            const row = {};
            for (let j = 0; j < headers.length; j++) {
                let val = values[j] ? values[j].trim() : '';
                if (!isNaN(parseFloat(val)) && isFinite(val)) {
                    row[headers[j]] = parseFloat(val);
                } else {
                    row[headers[j]] = val;
                }
            }
            data.push(row);
        }
        
        window.rawData = data;
        window.displayDataset(window.rawData);
        alert('Loaded ' + data.length + ' records from CSV!');
    };
    reader.readAsText(file);
};