"use client";

import { useEffect, useState } from "react";
import { useTestMode } from "../../../components/AnonAadhaarProviderWrapper";
import { LogInWithAnonAadhaar, useAnonAadhaar, useProver } from "@anon-aadhaar/react";

// Anon Aadhaar App ID
const NULLIFIER_SEED = 1234;

// Define allowed field names for Anon Aadhaar
type FieldToReveal = "revealAgeAbove18" | "revealGender" | "revealPinCode" | "revealState";

// Storage key for selected fields
const SELECTED_FIELDS_STORAGE_KEY = "aadhaarVerifier_selectedFields";

export function AadhaarVerifier() {
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();
  const {
    useTestAadhaar,
    setUseTestAadhaar,
    modeError: modeErrorMessage,
    clearModeError,
    setModeError,
  } = useTestMode();

  // State for fields to reveal
  const [selectedFields, setSelectedFields] = useState({
    ageAbove18: true,
    gender: false,
    pincode: false,
    state: false,
  });

  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({
    currentMode: useTestAadhaar ? "Test Mode" : "Production Mode",
  });

  // Load selected fields from localStorage on initial mount
  useEffect(() => {
    const loadStoredFields = () => {
      try {
        const storedFields = localStorage.getItem(SELECTED_FIELDS_STORAGE_KEY);
        if (storedFields) {
          setSelectedFields(JSON.parse(storedFields));
        }
      } catch (e) {
        console.error("Failed to load saved fields:", e);
      }
    };

    loadStoredFields();
  }, []);

  // Update debug info on mode change
  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      currentMode: useTestAadhaar ? "Test Mode" : "Production Mode",
      modeChangeTimestamp: new Date().toLocaleString(),
    }));
  }, [useTestAadhaar]);

  // Sync selected fields to localStorage when they change
  useEffect(() => {
    localStorage.setItem(SELECTED_FIELDS_STORAGE_KEY, JSON.stringify(selectedFields));
  }, [selectedFields]);

  // Handle login status and extract Anon Aadhaar proof details
  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      console.log("Logged in successfully!");
      console.log("Proof details:", latestProof?.proof);

      setDebugInfo(prevInfo => ({
        ...prevInfo,
        loginStatus: "logged-in",
        nullifier: latestProof?.proof?.nullifier ?? "N/A",
        timestamp: latestProof?.proof?.timestamp
          ? new Date(Number(latestProof.proof.timestamp) * 1000).toLocaleString()
          : "N/A",
        mode: useTestAadhaar ? "Test Mode" : "Production Mode",
        fieldsRevealed: Object.entries(selectedFields)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(", "),
      }));

      setVerificationStatus("Proof generated successfully");
      clearModeError();
    } else if (anonAadhaar.status === "logging-in") {
      setVerificationStatus("Generating proof...");
    }
  }, [anonAadhaar.status, latestProof, useTestAadhaar, clearModeError, selectedFields]);

  // Separate effect to handle proof field extraction to avoid loop
  useEffect(() => {
    // Only run this once when proof becomes available
    if (anonAadhaar.status === "logged-in" && latestProof?.proof) {
      // Extract revealed fields from the proof
      const revealedInProof = {
        ageAbove18: !!latestProof.proof.ageAbove18 && latestProof.proof.ageAbove18 !== "0",
        gender: !!latestProof.proof.gender && latestProof.proof.gender !== "0",
        pincode: !!latestProof.proof.pincode && latestProof.proof.pincode !== "0",
        state: !!latestProof.proof.state && latestProof.proof.state !== "0",
      };

      // Update selected fields based on what was actually revealed in the proof
      setSelectedFields(prev => ({
        ageAbove18: revealedInProof.ageAbove18 || prev.ageAbove18,
        gender: revealedInProof.gender || prev.gender,
        pincode: revealedInProof.pincode || prev.pincode,
        state: revealedInProof.state || prev.state,
      }));
    }
  }, [anonAadhaar.status, latestProof]);

  // Listen for Anon Aadhaar UI events
  useEffect(() => {
    const handleAnonAadhaarEvent = (event: MessageEvent) => {
      if (event.data && typeof event.data === "object") {
        if (event.data.type && typeof event.data.type === "string" && event.data.type.startsWith("anonAadhaar")) {
          console.log("AnonAadhaar event:", event.data);
          if (event.data.type === "anonAadhaarError") {
            setError(`QR scan error: ${event.data.error}`);
          }
          if (event.data.type === "anonAadhaarQrScan" && event.data.status === "error") {
            const errorMsg = !useTestAadhaar
              ? "QR validation failed in production mode. Use a real Aadhaar QR code."
              : "QR validation failed in test mode. Try a test QR code.";
            setModeError(errorMsg);
          }
        }
      }
    };

    window.addEventListener("message", handleAnonAadhaarEvent);
    return () => window.removeEventListener("message", handleAnonAadhaarEvent);
  }, [useTestAadhaar, setModeError]);

  // Toggle test mode
  const toggleTestMode = () => {
    if (anonAadhaar.status === "logged-in") {
      setVerificationStatus("Mode changed - re-verify required");
    }
    setError(null);
    setUseTestAadhaar(!useTestAadhaar);
    console.log(`Switching to ${!useTestAadhaar ? "test" : "production"} mode`);
  };

  // Handle field selection
  const handleFieldToggle = (field: keyof typeof selectedFields) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Map selected fields to Anon Aadhaar field names
  const fieldsToReveal: FieldToReveal[] = [];
  if (selectedFields.ageAbove18) fieldsToReveal.push("revealAgeAbove18");
  if (selectedFields.gender) fieldsToReveal.push("revealGender");
  if (selectedFields.pincode) fieldsToReveal.push("revealPinCode");
  if (selectedFields.state) fieldsToReveal.push("revealState");

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6">
      <div className="bg-base-100 shadow-lg rounded-2xl w-full p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Anon Aadhaar Verifier</h1>

        <div className="space-y-6">
          {/* Mode selector */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-center items-center gap-4">
              <span className={`text-sm ${useTestAadhaar ? "font-bold" : ""}`}>Test Mode</span>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={!useTestAadhaar}
                    onChange={toggleTestMode}
                  />
                </label>
              </div>
              <span className={`text-sm ${!useTestAadhaar ? "font-bold" : ""}`}>Production Mode</span>
            </div>
            {useTestAadhaar && (
              <div className="text-center text-sm text-amber-500">
                Using test mode - QR codes verified against test keys
              </div>
            )}
            {!useTestAadhaar && (
              <div className="text-center text-sm text-green-500">
                Using production mode - Real Aadhaar QR codes required
              </div>
            )}
          </div>

          {/* Fields to reveal */}
          <div>
            <label className="block text-sm mb-2 font-medium">Information to Reveal</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFields.ageAbove18}
                  onChange={() => handleFieldToggle("ageAbove18")}
                  className="checkbox"
                />
                <span>Age Above 18</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFields.gender}
                  onChange={() => handleFieldToggle("gender")}
                  className="checkbox"
                />
                <span>Gender</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFields.pincode}
                  onChange={() => handleFieldToggle("pincode")}
                  className="checkbox"
                />
                <span>PIN Code</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFields.state}
                  onChange={() => handleFieldToggle("state")}
                  className="checkbox"
                />
                <span>State</span>
              </label>
            </div>
          </div>

          {/* Anon Aadhaar login */}
          <div className="flex flex-col items-center gap-4">
            <LogInWithAnonAadhaar nullifierSeed={NULLIFIER_SEED} fieldsToReveal={fieldsToReveal as any} signal="0" />
          </div>

          {/* Status displays */}
          {modeErrorMessage && (
            <div className="alert alert-warning">
              <span>Mode Error: {modeErrorMessage}</span>
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}
          {verificationStatus && !error && !modeErrorMessage && (
            <div className={`alert ${verificationStatus.includes("failed") ? "alert-error" : "alert-success"}`}>
              {verificationStatus}
            </div>
          )}

          {/* Debug info */}
          {(Object.keys(debugInfo).length > 0 || anonAadhaar.status === "logged-in") && (
            <div className="bg-base-300 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-3">Verification Information:</h2>
              <div className="space-y-2 font-mono text-sm overflow-auto max-h-96">
                <p>Status: {anonAadhaar.status}</p>
                {Object.entries(debugInfo).map(([key, value]) => {
                  if (typeof value === "object" && value !== null) {
                    return (
                      <div key={key}>
                        <p>{key}:</p>
                        <pre className="text-xs p-2 bg-base-200 rounded overflow-auto max-h-32">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <p key={key}>
                      {key}: {String(value)}
                    </p>
                  );
                })}
                {anonAadhaar.status === "logged-in" && latestProof?.proof && (
                  <>
                    <p>Proof Available: Yes</p>
                    <p>Fields Selected to Reveal: {fieldsToReveal.join(", ") || "None"}</p>
                    <p>Revealed Fields in Proof:</p>
                    <ul className="list-disc pl-5">
                      {selectedFields.ageAbove18 && latestProof.proof.ageAbove18 && (
                        <li>Age Above 18: {latestProof.proof.ageAbove18 === "1" ? "Yes" : "No"}</li>
                      )}
                      {selectedFields.gender && latestProof.proof.gender && (
                        <li>
                          Gender:{" "}
                          {latestProof.proof.gender === "77"
                            ? "Male"
                            : latestProof.proof.gender === "70"
                              ? "Female"
                              : "Other"}
                        </li>
                      )}
                      {selectedFields.pincode && latestProof.proof.pincode && (
                        <li>PIN Code: {latestProof.proof.pincode}</li>
                      )}
                      {selectedFields.state && latestProof.proof.state && <li>State: {latestProof.proof.state}</li>}
                    </ul>

                    <div className="mt-4">
                      <details>
                        <summary className="cursor-pointer font-semibold">Groth16 Proof (ZK Proof Data)</summary>
                        <div className="mt-2 p-2 bg-base-200 rounded overflow-auto max-h-60">
                          {latestProof.proof.groth16Proof ? (
                            <div className="space-y-2">
                              <p className="font-semibold">Pi_A:</p>
                              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                                {JSON.stringify(latestProof.proof.groth16Proof.pi_a, null, 2)}
                              </pre>

                              <p className="font-semibold">Pi_B:</p>
                              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                                {JSON.stringify(latestProof.proof.groth16Proof.pi_b, null, 2)}
                              </pre>

                              <p className="font-semibold">Pi_C:</p>
                              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                                {JSON.stringify(latestProof.proof.groth16Proof.pi_c, null, 2)}
                              </pre>

                              <p className="font-semibold">Protocol:</p>
                              <pre className="text-xs">{latestProof.proof.groth16Proof.protocol}</pre>

                              <p className="font-semibold">Curve:</p>
                              <pre className="text-xs">{latestProof.proof.groth16Proof.curve}</pre>
                            </div>
                          ) : (
                            <p>Groth16 proof data not available</p>
                          )}
                        </div>
                      </details>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
