// import fs from "fs";
// import path from "path";
// import { hardhat } from "viem/chains";
import { AddressComponent } from "~~/app/blockexplorer/_components/AddressComponent";
// import deployedContracts from "~~/contracts/deployedContracts";
import { isZeroAddress } from "~~/utils/scaffold-eth/common";

// import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

type PageProps = {
  params: { address: string };
};

export function generateStaticParams() {
  // An workaround to enable static exports in Next.js, generating single dummy page.
  return [{ address: "0x0000000000000000000000000000000000000000" }];
}

const AddressPage = async ({ params }: PageProps) => {
  const address = params?.address as string;

  if (isZeroAddress(address)) return null;

  return <AddressComponent address={address} />;
};

export default AddressPage;
