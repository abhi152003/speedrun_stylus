pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";

template ModelVerifier() {
    // Private inputs (secret to the service)
    signal input w;  // Slope
    signal input b;  // Intercept

    // Public inputs (known to both user and verifier)
    signal input x;  // User-provided input
    signal input y;  // Computed output
    signal input H;  // Commitment hash

    // Compute y' = w * x + b inside the circuit
    signal y_computed;
    y_computed <== w * x + b;

    // Constraint: Ensure the computed y matches the provided y
    y_computed === y;

    // Compute H' = Poseidon(w, b) for commitment verification
    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== w;
    poseidon.inputs[1] <== b;
    signal H_computed;
    H_computed <== poseidon.out;

    // Constraint: Ensure the computed hash matches the provided H
    H_computed === H;
}

// Declare public inputs for the verifier
component main {public [x, y, H]} = ModelVerifier();