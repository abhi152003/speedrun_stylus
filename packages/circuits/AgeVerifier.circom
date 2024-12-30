pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template AgeVerification() {
    // Public inputs
    signal input minAge;         // Minimum age threshold
    signal input currentDate;    // Current date (timestamp in seconds)
    
    // Private input
    signal input birthdate;      // User's birthdate (timestamp in seconds)
    
    // Output
    signal output ageValidation; // Validation status

    // Ensure current date is after birthdate
    component dateCheck = LessThan(64);
    dateCheck.in[0] <== birthdate;
    dateCheck.in[1] <== currentDate;

    // Verify date validity constraint
    dateCheck.out === 1;

    // Calculate age in years using integer division
    // Use 31536000 as approximate seconds in a year (365 * 24 * 60 * 60)
    signal userAgeYears <-- div(currentDate - birthdate, 31536000);

    // Age validation
    component ageCheck = GreaterEqThan(32);
    ageCheck.in[0] <== userAgeYears;
    ageCheck.in[1] <== minAge;

    // Explicit constraint to make ageValidation strictly 0 or 1 and meaningful
    ageValidation <== ageCheck.out;

    // Additional constraint to ensure ageValidation is binary
    ageValidation * (1 - ageValidation) === 0;
}

// Custom integer division for circom
function div(a, b) {
    return a \ b;
}

component main = AgeVerification();