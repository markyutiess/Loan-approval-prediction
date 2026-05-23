// ==================== DATA PREPROCESSING MODULE ====================

let rawData = null;
let processedData = null;
let preprocessedReady = false;
let scalerParams = { type: 'minmax', mins: [], maxs: [], means: [], stds: [] };

// Sample dataset
function getSampleDataset() {
    return [
        { income: 50000, loan_amount: 20000, credit_history: 100, dti: 25, default_flag: 0 },
        { income: 30000, loan_amount: 25000, credit_history: 50, dti: 45, default_flag: 1 },
        { income: 80000, loan_amount: 30000, credit_history: 100, dti: 20, default_flag: 0 },
        { income: 45000, loan_amount: 18000, credit_history: 80, dti: 30, default_flag: 0 },
        { income: 28000, loan_amount: 22000, credit_history: 45, dti: 55, default_flag: 1 }
    ];
}

// Display dataset
function displayDataset(data) {
    const tbody = document.getElementById('tableBody');
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No data loaded</td></tr>';
        return;
    }
    let html = '';
    for (let i = 0; i < data.length; i++) {
        html += '<tr>';
        html += '<td>' + data[i].income + '</td>';
        html += '<td>' + data[i].loan_amount + '</td>';
        html += '<td>' + data[i].credit_history + '</td>';
        html += '<td>' + data[i].dti + '</td>';
        html += '<td>' + (data[i].default_flag === 1 ? '⚠️ Default' : '✅ Approved') + '</td>';
        html += '</tr>';
    }
    tbody.innerHTML = html;
    document.getElementById('datasetInfo').innerHTML = '<i class="fas fa-info-circle"></i> Total samples: ' + data.length;
}

// Load CSV file
function loadCSVFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            const values = lines[i].split(',');
            const row = {};
            for (let j = 0; j < headers.length; j++) {
                let val = values[j] ? values[j].trim() : '';
                row[headers[j]] = isNaN(parseFloat(val)) ? val : parseFloat(val);
            }
            data.push(row);
        }
        rawData = data;
        displayDataset(rawData);
        alert('Loaded ' + data.length + ' records from CSV!');
    };
    reader.readAsText(file);
}

// Handle missing values
function handleMissingValues(data, strategy) {
    if (strategy === 'drop') {
        return data.filter(row => Object.values(row).every(v => v !== null && v !== undefined && !isNaN(v)));
    }
    return data;
}

// Feature scaling
function scaleFeatures(data, method) {
    const X = data.map(row => [row.income, row.loan_amount, row.credit_history, row.dti]);
    const n = X.length;
    if (method === 'minmax') {
        const mins = [Infinity, Infinity, Infinity, Infinity];
        const maxs = [-Infinity, -Infinity, -Infinity, -Infinity];
        X.forEach(row => {
            for (let j = 0; j < 4; j++) {
                mins[j] = Math.min(mins[j], row[j]);
                maxs[j] = Math.max(maxs[j], row[j]);
            }
        });
        const scaled = X.map(row => row.map((val, j) => (val - mins[j]) / (maxs[j] - mins[j])));
        scalerParams = { type: 'minmax', mins, maxs };
        return scaled;
    }
    return X;
}

// Split data
function splitData(X, y, trainPercent) {
    const splitIdx = Math.floor(X.length * trainPercent / 100);
    return {
        X_train: X.slice(0, splitIdx),
        X_test: X.slice(splitIdx),
        y_train: y.slice(0, splitIdx),
        y_test: y.slice(splitIdx)
    };
}

// Main preprocessing function
function runPreprocessing() {
    if (!rawData || rawData.length === 0) {
        alert('Please load a dataset first');
        return false;
    }
    
    let data = rawData.map(row => ({ ...row }));
    const missingStrategy = document.getElementById('missingStrategy').value;
    data = handleMissingValues(data, missingStrategy);
    
    const scalingMethod = document.getElementById('scalingMethod').value;
    const X_scaled = scaleFeatures(data, scalingMethod);
    const y = data.map(row => row.default_flag);
    
    const trainPercent = parseInt(document.getElementById('trainRatio').value);
    const split = splitData(X_scaled, y, trainPercent);
    
    processedData = {
        X_train: split.X_train,
        X_test: split.X_test,
        y_train: split.y_train,
        y_test: split.y_test
    };
    
    document.getElementById('preprocessStatus').innerHTML = '<span class="success">✓ Preprocessing complete! ' + processedData.X_train.length + ' training, ' + processedData.X_test.length + ' testing</span>';
    preprocessedReady = true;
    return true;
}