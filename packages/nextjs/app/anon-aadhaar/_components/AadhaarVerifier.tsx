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
    <div className="flex flex-col items-center justify-center w-full my-auto">
      <div className="bg-white dark:bg-gray-900/95 shadow-2xl rounded-3xl w-full max-w-5xl p-8 border border-slate-200 dark:border-blue-500/30">
        <div className="flex items-center justify-center mb-8">
          <div className="px-6 py-3 rounded-full">
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 dark:text-cyan-400">
              Anon Aadhaar Verifier
            </h1>
          </div>
        </div>

        {/* Status displays */}
        {(modeErrorMessage || error || verificationStatus) && (
          <div
            className={`transition-all duration-300 alert mb-8 border shadow-lg backdrop-blur-md rounded-2xl
            ${
              modeErrorMessage || error
                ? "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-200 border-red-200 dark:border-red-500/40"
                : verificationStatus && verificationStatus.includes("Generating")
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 border-blue-200 dark:border-blue-500/40"
                  : "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-500/40"
            }`}
          >
            <div className="flex items-center">
              {verificationStatus && verificationStatus.includes("Generating") && (
                <div className="h-5 w-5 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 rounded-full animate-spin mr-3" />
              )}
              {verificationStatus && !verificationStatus.includes("Generating") && !error && !modeErrorMessage && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-green-500 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {(modeErrorMessage || error) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-red-500 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="font-medium">{modeErrorMessage || error || verificationStatus}</span>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Mode selector */}
          <div className="bg-slate-50 dark:bg-gray-800/80 rounded-2xl p-6 border border-slate-200 dark:border-blue-500/20">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-blue-200 mb-4">Verification Mode</h2>
            <div className="flex justify-center items-center gap-4">
              <span className={`text-sm ${useTestAadhaar ? "font-bold text-amber-500 dark:text-amber-400" : ""}`}>
                Test Mode
              </span>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary bg-slate-300 dark:bg-slate-700"
                    checked={!useTestAadhaar}
                    onChange={toggleTestMode}
                  />
                </label>
              </div>
              <span className={`text-sm ${!useTestAadhaar ? "font-bold text-green-500 dark:text-green-400" : ""}`}>
                Production Mode
              </span>
            </div>
            {useTestAadhaar && (
              <div className="text-center text-sm text-amber-500 mt-2">
                Using test mode - QR codes verified against test keys
              </div>
            )}
            {!useTestAadhaar && (
              <div className="text-center text-sm text-green-500 mt-2">
                Using production mode - Real Aadhaar QR codes required
              </div>
            )}
          </div>

          {/* Fields to reveal */}
          <div className="bg-slate-50 dark:bg-gray-800/80 rounded-2xl p-6 border border-slate-200 dark:border-blue-500/20">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-blue-200 mb-4">Information to Reveal</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <label className="flex items-center gap-2 cursor-pointer bg-white/70 dark:bg-blue-900/30 px-4 py-2 rounded-xl border border-slate-300 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400 transition-all">
                <input
                  type="checkbox"
                  checked={selectedFields.ageAbove18}
                  onChange={() => handleFieldToggle("ageAbove18")}
                  className="checkbox checkbox-primary"
                />
                <span className="text-slate-800 dark:text-blue-200">Age Above 18</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white/70 dark:bg-blue-900/30 px-4 py-2 rounded-xl border border-slate-300 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400 transition-all">
                <input
                  type="checkbox"
                  checked={selectedFields.gender}
                  onChange={() => handleFieldToggle("gender")}
                  className="checkbox checkbox-primary"
                />
                <span className="text-slate-800 dark:text-blue-200">Gender</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white/70 dark:bg-blue-900/30 px-4 py-2 rounded-xl border border-slate-300 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400 transition-all">
                <input
                  type="checkbox"
                  checked={selectedFields.pincode}
                  onChange={() => handleFieldToggle("pincode")}
                  className="checkbox checkbox-primary"
                />
                <span className="text-slate-800 dark:text-blue-200">PIN Code</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white/70 dark:bg-blue-900/30 px-4 py-2 rounded-xl border border-slate-300 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400 transition-all">
                <input
                  type="checkbox"
                  checked={selectedFields.state}
                  onChange={() => handleFieldToggle("state")}
                  className="checkbox checkbox-primary"
                />
                <span className="text-slate-800 dark:text-blue-200">State</span>
              </label>
            </div>
          </div>

          {/* Anon Aadhaar login */}
          <div className="flex justify-center">
            <div className="transform hover:scale-105 transition-all duration-300">
              <LogInWithAnonAadhaar nullifierSeed={NULLIFIER_SEED} fieldsToReveal={fieldsToReveal as any} signal="0" />
            </div>
          </div>

          {/* Debug info */}
          {(Object.keys(debugInfo).length > 0 || anonAadhaar.status === "logged-in") && (
            <div className="bg-slate-50 dark:bg-gray-800/80 rounded-2xl p-6 border border-slate-200 dark:border-blue-500/20 mt-8">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-blue-200 mb-4">Verification Information</h2>
              <div className="space-y-3 font-mono text-sm overflow-auto max-h-96 text-slate-700 dark:text-blue-200">
                <div className="bg-slate-100/80 dark:bg-blue-900/40 rounded-xl px-4 py-3 border border-slate-200 dark:border-blue-500/20">
                  <p className="font-bold">
                    Status: <span className="font-normal">{anonAadhaar.status}</span>
                  </p>
                </div>

                {Object.entries(debugInfo).map(([key, value]) => {
                  if (typeof value === "object" && value !== null) {
                    return (
                      <div
                        key={key}
                        className="bg-slate-100/80 dark:bg-blue-900/40 rounded-xl px-4 py-3 border border-slate-200 dark:border-blue-500/20"
                      >
                        <p className="font-bold">{key}:</p>
                        <pre className="text-xs p-2 bg-slate-200/80 dark:bg-blue-950/60 rounded overflow-auto max-h-32 mt-2">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={key}
                      className="bg-slate-100/80 dark:bg-blue-900/40 rounded-xl px-4 py-3 border border-slate-200 dark:border-blue-500/20"
                    >
                      <p className="font-bold">
                        {key}: <span className="font-normal">{String(value)}</span>
                      </p>
                    </div>
                  );
                })}

                {anonAadhaar.status === "logged-in" && latestProof?.proof && (
                  <>
                    <div className="bg-slate-100/80 dark:bg-blue-900/40 rounded-xl px-4 py-3 border border-slate-200 dark:border-blue-500/20">
                      <p className="font-bold">
                        Proof Available: <span className="font-normal">Yes</span>
                      </p>
                    </div>

                    <div className="bg-slate-100/80 dark:bg-blue-900/40 rounded-xl px-4 py-3 border border-slate-200 dark:border-blue-500/20">
                      <p className="font-bold">
                        Fields Selected to Reveal:{" "}
                        <span className="font-normal">{fieldsToReveal.join(", ") || "None"}</span>
                      </p>
                    </div>

                    <div className="bg-slate-100/80 dark:bg-blue-900/40 rounded-xl px-4 py-3 border border-slate-200 dark:border-blue-500/20">
                      <p className="font-bold mb-2">Revealed Fields in Proof:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedFields.ageAbove18 && latestProof.proof.ageAbove18 && (
                          <li>
                            Age Above 18:{" "}
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                              {latestProof.proof.ageAbove18 === "1" ? "Yes" : "No"}
                            </span>
                          </li>
                        )}
                        {selectedFields.gender && latestProof.proof.gender && (
                          <li>
                            Gender:{" "}
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                              {latestProof.proof.gender === "77"
                                ? "Male"
                                : latestProof.proof.gender === "70"
                                  ? "Female"
                                  : "Other"}
                            </span>
                          </li>
                        )}
                        {selectedFields.pincode && latestProof.proof.pincode && (
                          <li>
                            PIN Code:{" "}
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                              {latestProof.proof.pincode}
                            </span>
                          </li>
                        )}
                        {selectedFields.state && latestProof.proof.state && (
                          <li>
                            State:{" "}
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                              {latestProof.proof.state}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="bg-slate-100/80 dark:bg-blue-900/40 rounded-xl px-4 py-3 border border-slate-200 dark:border-blue-500/20">
                      <details>
                        <summary className="cursor-pointer font-bold text-slate-800 dark:text-blue-300">
                          Groth16 Proof (ZK Proof Data)
                        </summary>
                        <div className="mt-2 p-2 bg-slate-200/80 dark:bg-blue-950/60 rounded overflow-auto max-h-60">
                          {latestProof.proof.groth16Proof ? (
                            <div className="space-y-2">
                              <p className="font-semibold text-slate-700 dark:text-blue-300">Pi_A:</p>
                              <pre className="text-xs overflow-auto whitespace-pre-wrap text-slate-800 dark:text-blue-200">
                                {JSON.stringify(latestProof.proof.groth16Proof.pi_a, null, 2)}
                              </pre>

                              <p className="font-semibold text-slate-700 dark:text-blue-300">Pi_B:</p>
                              <pre className="text-xs overflow-auto whitespace-pre-wrap text-slate-800 dark:text-blue-200">
                                {JSON.stringify(latestProof.proof.groth16Proof.pi_b, null, 2)}
                              </pre>

                              <p className="font-semibold text-slate-700 dark:text-blue-300">Pi_C:</p>
                              <pre className="text-xs overflow-auto whitespace-pre-wrap text-slate-800 dark:text-blue-200">
                                {JSON.stringify(latestProof.proof.groth16Proof.pi_c, null, 2)}
                              </pre>

                              <p className="font-semibold text-slate-700 dark:text-blue-300">Protocol:</p>
                              <pre className="text-xs text-slate-800 dark:text-blue-200">
                                {latestProof.proof.groth16Proof.protocol}
                              </pre>

                              <p className="font-semibold text-slate-700 dark:text-blue-300">Curve:</p>
                              <pre className="text-xs text-slate-800 dark:text-blue-200">
                                {latestProof.proof.groth16Proof.curve}
                              </pre>
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
