// ==================== K-NEAREST NEIGHBORS (KNN) MODULE ====================

// Euclidean distance calculation
function euclideanDistance(point1, point2) {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
        sum += (point1[i] - point2[i]) ** 2;
    }
    return Math.sqrt(sum);
}

// KNN Prediction
function knnPredict(X_train, y_train, X_test, k = 5) {
    const predictions = [];
    
    for (let i = 0; i < X_test.length; i++) {
        // Calculate distances to all training points
        const distances = [];
        for (let j = 0; j < X_train.length; j++) {
            const dist = euclideanDistance(X_test[i], X_train[j]);
            distances.push({ dist, label: y_train[j] });
        }
        
        // Sort by distance and get k nearest neighbors
        distances.sort((a, b) => a.dist - b.dist);
        const neighbors = distances.slice(0, k);
        
        // Count votes
        let vote0 = 0, vote1 = 0;
        for (let n = 0; n < neighbors.length; n++) {
            if (neighbors[n].label === 0) vote0++;
            else vote1++;
        }
        
        // Return majority class
        predictions.push(vote1 > vote0 ? 1 : 0);
    }
    
    return predictions;
}

// Train and evaluate KNN model
function trainKNN(X_train, y_train, X_test, y_test) {
    const predictions = knnPredict(X_train, y_train, X_test, 5);
    return predictions;
}