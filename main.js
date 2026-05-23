// ==================== MAIN APPLICATION BOOTSTRAP ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('LoanSight Pro initialized');
    
    // TABS
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const id = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            contents.forEach(c => c.classList.remove('active'));
            document.getElementById(id).classList.add('active');
        });
    });
    
    // FILE UPLOAD
    const fileUpload = document.getElementById('fileUpload');
    if (fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            if (e.target.files[0]) loadCSVFile(e.target.files[0]);
        });
    }
    
    // LOAD SAMPLE
    document.getElementById('loadSampleBtn').onclick = () => {
        rawData = getSampleDataset();
        displayDataset(rawData);
        alert('Sample dataset loaded with ' + rawData.length + ' records!');
    };
    
    // APPLY PREPROCESS
    document.getElementById('applyPreprocessBtn').onclick = () => runPreprocessing();
    
    // TRAIN ALL
    document.getElementById('trainAllBtn').onclick = () => trainAllModels();
    
    // PREDICT
    document.getElementById('predictBtn').onclick = () => predictLoan();
    
    // SLIDER
    document.getElementById('trainRatio').oninput = function() {
        document.getElementById('trainRatioValue').innerText = this.value;
        document.getElementById('testRatioValue').innerText = (100 - parseInt(this.value)) + '%';
    };
    
    console.log('All event listeners registered');
});