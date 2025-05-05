"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";

// Create context to expose test mode state
export const TestModeContext = createContext<{
  useTestAadhaar: boolean;
  setUseTestAadhaar: (value: boolean) => void;
  modeError: string | null;
  clearModeError: () => void;
  setModeError: (error: string) => void;
}>({
  useTestAadhaar: true,
  setUseTestAadhaar: () => {},
  modeError: null,
  clearModeError: () => {},
  setModeError: () => {},
});

// Hook to use the test mode context
export const useTestMode = () => useContext(TestModeContext);

export const AnonAadhaarProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  // Default to test mode
  const [useTestAadhaar, setUseTestAadhaarState] = useState(true);
  const [modeError, setModeError] = useState<string | null>(null);
  const [key, setKey] = useState<number>(0); // Add key to force re-render

  // Wrapper for setting test mode with error handling
  const setUseTestAadhaar = (value: boolean) => {
    console.log(`Switching to ${value ? "test" : "production"} mode`);
    setUseTestAadhaarState(value);
    setModeError(null);
    // Force re-render of the provider when mode changes
    setKey(prev => prev + 1);
  };

  const clearModeError = () => setModeError(null);

  // Wait for client-side rendering to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for QR validation errors from AnonAadhaar
  useEffect(() => {
    // Handle global errors from the AnonAadhaar library
    const handleQrError = (event: MessageEvent) => {
      // Check if the message is from the AnonAadhaar iframe
      if (
        event.data &&
        typeof event.data === "object" &&
        typeof event.data.type === "string" &&
        event.data.type === "anonAadhaarError"
      ) {
        console.error("AnonAadhaar error:", event.data.error);
        setModeError(`QR validation failed: ${event.data.error}`);
      }
    };

    window.addEventListener("message", handleQrError);

    return () => {
      window.removeEventListener("message", handleQrError);
    };
  }, []);

  if (!mounted) return null;

  return (
    <TestModeContext.Provider
      value={{
        useTestAadhaar,
        setUseTestAadhaar,
        modeError,
        clearModeError,
        setModeError,
      }}
    >
      <AnonAadhaarProvider
        key={key} // Force re-render when mode changes
        _useTestAadhaar={useTestAadhaar}
        _appName="Anon Aadhaar Verifier"
      >
        {children}
      </AnonAadhaarProvider>
    </TestModeContext.Provider>
  );
};
