# 🚩 Challenge #7 : ZKP - Password Verifier

🎫 Build a Password Verifier using Zero-Knowledge Proofs (ZKP) on Arbitrum Stylus:

👷‍♀️ In this challenge, you'll build and deploy a smart contract that utilizes Zero-Knowledge Proofs for private password verification. You'll work with ZKP circuits, deploy them to an Arbitrum Stylus dev node, and create a frontend that allows users to generate and verify proofs! 🚀

🌟 The final deliverable is a full-stack application featuring password verification. Deploy your contract to a testnet, then build and upload your app to a public web server.

### How ZKP Integration Works
This project leverages Zero-Knowledge Proofs (ZKPs) to enable private verification of passwords on Arbitrum Stylus. Here's the workflow:

1. **Circuit Design**: The ZKP logic is defined in `.circom` files (e.g., `PasswordVerifier.circom`) using the Circom language. These circuits encode the rules for verification (e.g., "does the password match the expected hash?") without revealing the inputs.
2. **Proof System Setup**: We use the `snarkjs` library with the Groth16 proving system to generate proving and verification keys. The trusted setup is simulated using a pre-existing `pot12_final.ptau` file.
3. **Contract Generation**: The verification key is exported to a Solidity contract (e.g., `PasswordVerifier.sol`) that runs on Arbitrum Stylus, allowing on-chain verification of zk-proofs.
4. **Frontend Interaction**: The Next.js frontend uses WebAssembly (`.wasm`) outputs from Circom to generate proofs locally, which are then submitted to the deployed contract for verification.
5. **Arbitrum Stylus Advantage**: Stylus' Rust-based environment enables efficient execution of the verifier contract, reducing gas costs compared to traditional EVM-based ZKP verification.

This integration ensures privacy (inputs remain off-chain) and scalability (proof verification is lightweight on-chain).

## Checkpoint 0: 📦 Environment Setup 📚

Before starting, ensure you have the following installed:

- [Node.js (>= v18.17)](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Clone the Repository

```bash
git clone https://github.com/abhi152003/speedrun_stylus.git
cd speedrun_stylus
git checkout stylus-zkp-password-verifier
```

### Install Dependencies

Run the following command to install all necessary dependencies:

```bash
yarn install
```

## Checkpoint 1: 🚀 Start Your Dev Environment

### Step 1: Start the Nitro Dev Node

1. Ensure Docker is running on your machine. You can start Docker Desktop if it's not already running.
2. Navigate to the `cargo-stylus` folder:
   ```bash
   cd packages/cargo-stylus
   ```

3. Run the `run-dev-node.sh` script:
   ```bash
   bash run-dev-node.sh
   ```
   This script:
   - Spins up an Arbitrum Stylus Nitro dev node in Docker.
   - Deploys the `PasswordVerifier.sol` contract.
   - Generates the ABI for interacting with the contract.

> The dev node will be accessible at `http://localhost:8547`.

### Step 2: Start the Frontend

1. Open a new terminal window to keep the dev node running.
2. Navigate to the `nextjs` folder:
   ```bash
   cd packages/nextjs
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

> The app will be available at [http://localhost:3000/passwordVerifier](http://localhost:3000/passwordVerifier).

## Checkpoint 2: 💫 Explore the Features

### Password Verifier

- **Purpose**: Prove that a user knows a secret password (or combination) matching an expected hash without revealing the password itself.
- **Circuit Logic**: The `PasswordVerifier.circom` circuit takes a private input (the user's password or combination) and a public input (the expected hash). It computes the hash of the password using a hash function (e.g., MiMC or Poseidon, chosen for ZKP compatibility) within the circuit and checks if it equals the expected hash. The circuit outputs a proof if the hashes match, ensuring the password remains confidential.
- **On-Chain Verification**: The generated proof is submitted to `PasswordVerifier.sol` on the Stylus dev node. The contract verifies the proof using the Groth16 verification key, confirming that the user's input matches the expected hash without exposing the password. This enables secure, private authentication on-chain.

![Password Verifier Interface](https://github.com/user-attachments/assets/a031b559-46a4-4e70-9619-e535a4c65675)
*Password verification interface and process flow*

- Navigate to the "Debug Contracts" tab in the frontend.
- This feature interacts with the **Password Verifier** contract, which was generated from the `PasswordVerifier.circom` circuit located in `packages/circuits`.
- Circuit generation commands:
  ```bash
  circom PasswordVerifier.circom --r1cs --wasm --sym
  npx snarkjs groth16 setup PasswordVerifier.r1cs pot12_final.ptau PasswordVerifier_0000.zkey
  npx snarkjs zkey contribute PasswordVerifier_0000.zkey PasswordVerifier_final.zkey --name="Contributor" -v
  npx snarkjs zkey export verificationkey PasswordVerifier_final.zkey verification_key.json
  npx snarkjs zkey export solidityverifier PasswordVerifier_final.zkey PasswordVerifier.sol
  ```
- Example inputs:
  - Combination: `1234`
  - Expected Hash: `4321`
- The app generates a zk-proof to verify if the provided combination matches the expected hash.

## Checkpoint 3: 🛠 Modify and Deploy Contracts

You can tinker with circuit logic by modifying files in the `packages/circuits` folder. After making changes, regenerate contracts using these commands:

```bash
circom PasswordVerifier.circom --r1cs --wasm --sym
npx snarkjs groth16 setup PasswordVerifier.r1cs pot12_final.ptau PasswordVerifier_0000.zkey
npx snarkjs zkey contribute PasswordVerifier_0000.zkey PasswordVerifier_final.zkey --name="Contributor" -v
npx snarkjs zkey export verificationkey PasswordVerifier_final.zkey verification_key.json
npx snarkjs zkey export solidityverifier PasswordVerifier_final.zkey PasswordVerifier.sol
```

Deploy new contracts by placing them in `packages/cargo-stylus/contracts` and running:

```bash
bash run-dev-node.sh
```

## 🛠️ Debugging Tips

### Fixing Line Endings for Shell Scripts on Windows (CRLF Issue)

If you encounter errors like `Command not found`, convert line endings to LF:

```bash
sudo apt install dos2unix
dos2unix run-dev-node.sh
chmod +x run-dev-node.sh
```

Run the script again:
```bash
bash run-dev-node.sh
```

## Checkpoint 4: 🚢 Ship your frontend! 🚁

To deploy your app to Vercel:

```bash
yarn vercel
```

Follow Vercel's instructions to get a public URL.

For production deployment:
```bash
yarn vercel --prod
```

## Checkpoint 5: 📜 Contract Verification

You can verify your deployed smart contract using:

```bash
cargo stylus verify -e http://127.0.0.1:8547 --deployment-tx "$deployment_tx"
```

Replace `$deployment_tx` with your deployment transaction hash.

## 🏁 Next Steps

Explore more challenges or contribute to this project!