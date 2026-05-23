// ==================== SUPPORT VECTOR MACHINE (SVM) MODULE ====================

// Linear SVM using gradient descent
function trainSVM(X_train, y_train, X_test, y_test) {
    // Convert labels: 0 -> -1 for SVM calculation
    const yTrainAdj = y_train.map(y => y === 0 ? -1 : 1);
    
    // Initialize weights and bias
    let w = new Array(X_train[0].length).fill(0);
    let b = 0;
    const learningRate = 0.01;
    const epochs = 200;
    const regParam = 0.01;
    
    // Training loop
    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let i = 0; i < X_train.length; i++) {
            // Calculate margin
            let sum = 0;
            for (let j = 0; j < w.length; j++) {
                sum += X_train[i][j] * w[j];
            }
            const margin = yTrainAdj[i] * (sum + b);
            
            if (margin >= 1) {
                // No misclassification: only apply regularization
                for (let j = 0; j < w.length; j++) {
                    w[j] -= learningRate * regParam * w[j];
                }
                b -= learningRate * regParam * b;
            } else {
                // Misclassification: update weights
                for (let j = 0; j < w.length; j++) {
                    w[j] += learningRate * (yTrainAdj[i] * X_train[i][j] - regParam * w[j]);
                }
                b += learningRate * (yTrainAdj[i] - regParam * b);
            }
        }
    }
    
    // Make predictions
    const predictions = [];
    for (let i = 0; i < X_test.length; i++) {
        let sum = 0;
        for (let j = 0; j < w.length; j++) {
            sum += X_test[i][j] * w[j];
        }
        const linear = sum + b;
        predictions.push(linear >= 0 ? 1 : 0);
    }
    
    return predictions;
}