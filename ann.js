// ==================== ARTIFICIAL NEURAL NETWORK (ANN) MODULE ====================

// Simple Neural Network with one hidden layer
function trainANN(X_train, y_train, X_test, y_test) {
    const inputSize = X_train[0].length;
    const hiddenSize = 4;
    
    // Initialize weights and biases randomly
    let w1 = [];
    for (let i = 0; i < inputSize; i++) {
        w1.push([]);
        for (let j = 0; j < hiddenSize; j++) {
            w1[i][j] = (Math.random() * 0.2) - 0.1;
        }
    }
    
    let w2 = [];
    for (let i = 0; i < hiddenSize; i++) {
        w2.push((Math.random() * 0.2) - 0.1);
    }
    
    let b1 = new Array(hiddenSize).fill(0);
    let b2 = 0;
    
    const learningRate = 0.1;
    const epochs = 300;
    
    // Sigmoid activation function
    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    function sigmoidDerivative(x) {
        return x * (1 - x);
    }
    
    // Training loop
    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let i = 0; i < X_train.length; i++) {
            // Forward propagation - hidden layer
            const hiddenInput = [];
            for (let j = 0; j < hiddenSize; j++) {
                let sum = 0;
                for (let k = 0; k < inputSize; k++) {
                    sum += X_train[i][k] * w1[k][j];
                }
                hiddenInput.push(sum + b1[j]);
            }
            
            const hiddenOutput = hiddenInput.map(sigmoid);
            
            // Forward propagation - output layer
            let outputInput = 0;
            for (let j = 0; j < hiddenSize; j++) {
                outputInput += hiddenOutput[j] * w2[j];
            }
            outputInput += b2;
            const output = sigmoid(outputInput);
            
            // Backward propagation - output layer
            const outputError = output - y_train[i];
            const outputDelta = outputError * sigmoidDerivative(output);
            
            // Backward propagation - hidden layer
            const hiddenErrors = [];
            const hiddenDeltas = [];
            for (let j = 0; j < hiddenSize; j++) {
                hiddenErrors.push(outputDelta * w2[j]);
                hiddenDeltas.push(hiddenErrors[j] * sigmoidDerivative(hiddenOutput[j]));
            }
            
            // Update weights and biases
            for (let j = 0; j < w2.length; j++) {
                w2[j] -= learningRate * outputDelta * hiddenOutput[j];
            }
            b2 -= learningRate * outputDelta;
            
            for (let j = 0; j < inputSize; j++) {
                for (let k = 0; k < hiddenSize; k++) {
                    w1[j][k] -= learningRate * hiddenDeltas[k] * X_train[i][j];
                }
            }
            for (let k = 0; k < hiddenSize; k++) {
                b1[k] -= learningRate * hiddenDeltas[k];
            }
        }
    }
    
    // Make predictions
    const predictions = [];
    for (let i = 0; i < X_test.length; i++) {
        // Forward propagation
        const hiddenInput = [];
        for (let j = 0; j < hiddenSize; j++) {
            let sum = 0;
            for (let k = 0; k < inputSize; k++) {
                sum += X_test[i][k] * w1[k][j];
            }
            hiddenInput.push(sum + b1[j]);
        }
        const hiddenOutput = hiddenInput.map(sigmoid);
        
        let outputInput = 0;
        for (let j = 0; j < hiddenSize; j++) {
            outputInput += hiddenOutput[j] * w2[j];
        }
        outputInput += b2;
        const output = sigmoid(outputInput);
        
        predictions.push(output >= 0.5 ? 1 : 0);
    }
    
    return predictions;
}