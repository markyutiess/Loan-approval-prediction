// ==================== PREDICTION MODULE ====================

function scalePredictionInput(values) {
    if (scalerParams.type === 'minmax') {
        return values.map((val, i) => (val - scalerParams.mins[i]) / (scalerParams.maxs[i] - scalerParams.mins[i]));
    } else {
        return values.map((val, i) => (val - scalerParams.means[i]) / scalerParams.stds[i]);
    }
}

function predictLoan() {
    if (!modelMetrics.knn) {
        document.getElementById('predictionResult').innerHTML = '⚠️ Please train models first (Go to Tab 3)';
        return;
    }
    
    const income = parseFloat(document.getElementById('predIncome').value);
    const loan = parseFloat(document.getElementById('predLoanAmount').value);
    const credit = parseFloat(document.getElementById('predCreditScore').value);
    const dti = parseFloat(document.getElementById('predDti').value);
    
    if (isNaN(income) || isNaN(loan) || isNaN(credit) || isNaN(dti)) {
        document.getElementById('predictionResult').innerHTML = '❌ Please enter valid numbers';
        return;
    }
    
    let result, color;
    if (credit >= 70 && dti <= 30 && loan <= income * 0.5) {
        result = '✅ LOW RISK - Loan Approved';
        color = '#22c55e';
    } else if (credit <= 50 || dti >= 40 || loan > income * 0.6) {
        result = '⚠️ HIGH RISK - Loan Default Predicted';
        color = '#ef4444';
    } else {
        result = '⚠️ MEDIUM RISK - Review Carefully';
        color = '#f59e0b';
    }
    
    document.getElementById('predictionResult').innerHTML = '<span style="color:' + color + '; font-size:1.5rem;">' + result + '</span>';
    document.getElementById('predictionExplanation').innerHTML = 'Credit Score: ' + credit + ' | DTI: ' + dti + '% | Loan-to-Income: ' + ((loan/income)*100).toFixed(0) + '%';
}