import { AadhaarVerifier } from "./_components/AadhaarVerifier";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Anon Aadhaar Verifier",
  description: "Verify Aadhaar QR code data with zero-knowledge proofs",
});

const AadhaarVerifierPage: NextPage = () => {
  return (
    <>
      <AadhaarVerifier />
    </>
  );
};

export default AadhaarVerifierPage;
