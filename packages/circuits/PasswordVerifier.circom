pragma circom 2.0.0;

template PasswordVerifier() {
    signal input combination[4];
    signal input expectedHash;
    signal output isValid;
    
    // Verify each digit is between 0-9
    for (var i = 0; i < 4; i++) {
        assert(combination[i] >= 0 && combination[i] <= 9);
    }
    
    // Calculate hash
    var calculatedHash = combination[3] * 1000 + combination[2] * 100 + 
                        combination[1] * 10 + combination[0];
    
    // Set isValid based on hash comparison
    isValid <-- calculatedHash == expectedHash ? 1 : 0;
    
    // Ensure isValid is binary
    assert(isValid == 0 || isValid == 1);
}

component main = PasswordVerifier();