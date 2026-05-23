// ==================== MODEL TRAINING MODULE ====================

let modelMetrics = { knn: null, svm: null, ann: null };

function calculateMetrics(y_true, y_pred) {
    let tp = 0, tn = 0, fp = 0, fn = 0;
    for (let i = 0; i < y_true.length; i++) {
        if (y_true[i] === 1 && y_pred[i] === 1) tp++;
        else if (y_true[i] === 0 && y_pred[i] === 0) tn++;
        else if (y_true[i] === 0 && y_pred[i] === 1) fp++;
        else if (y_true[i] === 1 && y_pred[i] === 0) fn++;
    }
    const accuracy = (tp + tn) / (tp + tn + fp + fn);
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1 = 2 * (precision * recall) / (precision + recall) || 0;
    return { accuracy, precision, recall, f1, tp, tn, fp, fn };
}

function knnPredict(X_train, y_train, X_test, k = 3) {
    return X_test.map(x => {
        const distances = X_train.map((train, idx) => ({
            dist: Math.sqrt(train.reduce((sum, val, i) => sum + (val - x[i]) ** 2, 0)),
            label: y_train[idx]
        }));
        distances.sort((a, b) => a.dist - b.dist);
        const neighbors = distances.slice(0, k);
        const votes = neighbors.reduce((acc, d) => { acc[d.label] = (acc[d.label] || 0) + 1; return acc; }, {});
        return (votes[1] || 0) > (votes[0] || 0) ? 1 : 0;
    });
}

function trainSVM(X_train, y_train, X_test, y_test) {
    const yTrainAdj = y_train.map(y => y === 0 ? -1 : 1);
    let w = new Array(X_train[0].length).fill(0);
    let b = 0;
    const lr = 0.01, epochs = 100;
    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let i = 0; i < X_train.length; i++) {
            const margin = yTrainAdj[i] * (X_train[i].reduce((sum, val, j) => sum + val * w[j], 0) + b);
            if (margin >= 1) {
                for (let j = 0; j < w.length; j++) w[j] -= lr * 0.01 * w[j];
                b -= lr * 0.01 * b;
            } else {
                for (let j = 0; j < w.length; j++) w[j] += lr * (yTrainAdj[i] * X_train[i][j] - 0.01 * w[j]);
                b += lr * (yTrainAdj[i] - 0.01 * b);
            }
        }
    }
    const predictions = X_test.map(x => (x.reduce((sum, val, j) => sum + val * w[j], 0) + b) >= 0 ? 1 : 0);
    return predictions;
}

function trainANN(X_train, y_train, X_test, y_test) {
    let w = new Array(X_train[0].length).fill(0).map(() => Math.random() * 0.1);
    let b = 0;
    const lr = 0.05, epochs = 200;
    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let i = 0; i < X_train.length; i++) {
            const linear = X_train[i].reduce((sum, val, j) => sum + val * w[j], 0) + b;
            const pred = 1 / (1 + Math.exp(-linear));
            const error = pred - y_train[i];
            for (let j = 0; j < w.length; j++) w[j] -= lr * error * pred * (1 - pred) * X_train[i][j];
            b -= lr * error * pred * (1 - pred);
        }
    }
    const predictions = X_test.map(x => {
        const linear = x.reduce((sum, val, j) => sum + val * w[j], 0) + b;
        return 1 / (1 + Math.exp(-linear)) >= 0.5 ? 1 : 0;
    });
    return predictions;
}

function trainAllModels() {
    if (!preprocessedReady && !runPreprocessing()) return;
    
    const { X_train, X_test, y_train, y_test } = processedData;
    
    document.getElementById('trainStatus').innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Training models...';
    
    setTimeout(() => {
        const knnPred = knnPredict(X_train, y_train, X_test, 3);
        const knnMetrics = calculateMetrics(y_test, knnPred);
        
        const svmPred = trainSVM(X_train, y_train, X_test, y_test);
        const svmMetrics = calculateMetrics(y_test, svmPred);
        
        const annPred = trainANN(X_train, y_train, X_test, y_test);
        const annMetrics = calculateMetrics(y_test, annPred);
        
        modelMetrics = { knn: knnMetrics, svm: svmMetrics, ann: annMetrics };
        
        document.getElementById('knnMetrics').innerHTML = `📊 Acc: ${(knnMetrics.accuracy*100).toFixed(1)}%<br>🎯 Prec: ${(knnMetrics.precision*100).toFixed(1)}%<br>📈 Rec: ${(knnMetrics.recall*100).toFixed(1)}%<br>⭐ F1: ${(knnMetrics.f1*100).toFixed(1)}%`;
        document.getElementById('svmMetrics').innerHTML = `📊 Acc: ${(svmMetrics.accuracy*100).toFixed(1)}%<br>🎯 Prec: ${(svmMetrics.precision*100).toFixed(1)}%<br>📈 Rec: ${(svmMetrics.recall*100).toFixed(1)}%<br>⭐ F1: ${(svmMetrics.f1*100).toFixed(1)}%`;
        document.getElementById('annMetrics').innerHTML = `📊 Acc: ${(annMetrics.accuracy*100).toFixed(1)}%<br>🎯 Prec: ${(annMetrics.precision*100).toFixed(1)}%<br>📈 Rec: ${(annMetrics.recall*100).toFixed(1)}%<br>⭐ F1: ${(annMetrics.f1*100).toFixed(1)}%`;
        
        document.getElementById('comparisonBody').innerHTML = `
            <tr><td><strong>KNN</strong></td><td>${(knnMetrics.accuracy*100).toFixed(1)}%</td><td>${(knnMetrics.precision*100).toFixed(1)}%</td><td>${(knnMetrics.recall*100).toFixed(1)}%</td><td>${(knnMetrics.f1*100).toFixed(1)}%</td><td>TP:${knnMetrics.tp} TN:${knnMetrics.tn}<br>FP:${knnMetrics.fp} FN:${knnMetrics.fn}</td></tr>
            <tr><td><strong>SVM</strong></td><td>${(svmMetrics.accuracy*100).toFixed(1)}%</td><td>${(svmMetrics.precision*100).toFixed(1)}%</td><td>${(svmMetrics.recall*100).toFixed(1)}%</td><td>${(svmMetrics.f1*100).toFixed(1)}%</td><td>TP:${svmMetrics.tp} TN:${svmMetrics.tn}<br>FP:${svmMetrics.fp} FN:${svmMetrics.fn}</td></tr>
            <tr><td><strong>ANN</strong></td><td>${(annMetrics.accuracy*100).toFixed(1)}%</td><td>${(annMetrics.precision*100).toFixed(1)}%</td><td>${(annMetrics.recall*100).toFixed(1)}%</td><td>${(annMetrics.f1*100).toFixed(1)}%</td><td>TP:${annMetrics.tp} TN:${annMetrics.tn}<br>FP:${annMetrics.fp} FN:${annMetrics.fn}</td></tr>
        `;
        document.getElementById('trainStatus').innerHTML = '<span class="success">✓ All three models (KNN, SVM, ANN) trained successfully!</span>';
    }, 100);
}