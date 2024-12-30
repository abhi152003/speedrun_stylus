pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template BalanceChecker() {
    signal input balance;    // Private
    signal input threshold;  // Public
    signal output hasSufficientFunds;
    
    // Verify balance is non-negative using a constraint
    component nonNegativeCheck = GreaterEqThan(32); // 32 bits for comparison
    nonNegativeCheck.in[0] <== balance;
    nonNegativeCheck.in[1] <== 0;
    nonNegativeCheck.out === 1;  // Enforce balance >= 0
    
    // Check if balance meets threshold
    component thresholdCheck = GreaterEqThan(32);
    thresholdCheck.in[0] <== balance;
    thresholdCheck.in[1] <== threshold;
    hasSufficientFunds <== thresholdCheck.out;
}

component main = BalanceChecker();