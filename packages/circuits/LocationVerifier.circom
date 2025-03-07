pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template LocationVerifier() {
    // Inputs: User's scaled latitude and longitude (private), and state's bounding box (public)
    signal input user_lat;  // Private
    signal input user_lon;  // Private
    signal input min_lat;   // Public
    signal input max_lat;   // Public
    signal input min_lon;   // Public
    signal input max_lon;   // Public
    
    // Check if user_lat >= min_lat
    component geq_lat_min = GreaterEqThan(28);
    geq_lat_min.in[0] <== user_lat;
    geq_lat_min.in[1] <== min_lat;
    geq_lat_min.out === 1; // Enforce that user_lat >= min_lat
    
    // Check if user_lat <= max_lat
    component leq_lat_max = LessEqThan(28);
    leq_lat_max.in[0] <== user_lat;
    leq_lat_max.in[1] <== max_lat;
    leq_lat_max.out === 1; // Enforce that user_lat <= max_lat
    
    // Check if user_lon >= min_lon
    component geq_lon_min = GreaterEqThan(28);
    geq_lon_min.in[0] <== user_lon;
    geq_lon_min.in[1] <== min_lon;
    geq_lon_min.out === 1; // Enforce that user_lon >= min_lon
    
    // Check if user_lon <= max_lon
    component leq_lon_max = LessEqThan(28);
    leq_lon_max.in[0] <== user_lon;
    leq_lon_max.in[1] <== max_lon;
    leq_lon_max.out === 1; // Enforce that user_lon <= max_lon
}

// Declare main component with public inputs
component main {public [min_lat, max_lat, min_lon, max_lon]} = LocationVerifier();