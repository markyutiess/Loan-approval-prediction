// ==================== EVALUATION MODULE ====================
// This file is for additional evaluation functions if needed
// Main evaluation is handled in train.js

console.log('Evaluation module loaded');

function displayConfusionMatrix(metrics, modelName) {
    console.log(`${modelName} - TP:${metrics.tp}, TN:${metrics.tn}, FP:${metrics.fp}, FN:${metrics.fn}`);
}

function getBestModel() {
    if (!modelMetrics.knn) return null;
    let best = 'knn';
    let bestAcc = modelMetrics.knn.accuracy;
    if (modelMetrics.svm.accuracy > bestAcc) { best = 'svm'; bestAcc = modelMetrics.svm.accuracy; }
    if (modelMetrics.ann.accuracy > bestAcc) { best = 'ann'; }
    return best;
}