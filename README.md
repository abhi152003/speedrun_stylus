# 🚩 Challenge #5 : 🔐 ZKP-Based Contract Interactions

🎫 Build Zero-Knowledge Proof (ZKP) based contract interactions with Arbitrum Stylus:

👷‍♀️ In this challenge, you'll build and deploy smart contracts that utilize Zero-Knowledge Proofs for private verification of various conditions. You'll work with ZKP circuits, deploy them to an Arbitrum Stylus dev node, and create a frontend that allows users to generate and verify proofs! 🚀

🌟 The final deliverable is a full-stack application featuring three different ZKP verification scenarios: age verification, balance checking, and password verification. Deploy your contracts to a testnet, then build and upload your app to a public web server.

### How ZKP Integration Works
This project leverages Zero-Knowledge Proofs (ZKPs) to enable private verification of conditions (e.g., age, balance, password) on Arbitrum Stylus. Here's the workflow:

1. **Circuit Design**: The ZKP logic is defined in `.circom` files (e.g., `AgeVerifier.circom`) using the Circom language. These circuits encode the rules for verification (e.g., "is age ≥ 18?") without revealing the inputs.
2. **Proof System Setup**: We use the `snarkjs` library with the Groth16 proving system to generate proving and verification keys. The trusted setup is simulated using a pre-existing `pot12_final.ptau` file.
3. **Contract Generation**: The verification key is exported to a Solidity contract (e.g., `AgeVerifier.sol`) that runs on Arbitrum Stylus, allowing on-chain verification of zk-proofs.
4. **Frontend Interaction**: The Next.js frontend uses WebAssembly (`.wasm`) outputs from Circom to generate proofs locally, which are then submitted to the deployed contract for verification.
5. **Arbitrum Stylus Advantage**: Stylus’ Rust-based environment enables efficient execution of the verifier contract, reducing gas costs compared to traditional EVM-based ZKP verification.

This integration ensures privacy (inputs remain off-chain) and scalability (proof verification is lightweight on-chain).

We opted for Groth16 due to its efficiency in proof generation and verification, which aligns with Arbitrum Stylus' goal of low-cost execution. While it requires a trusted setup, this is acceptable for a proof-of-concept; future iterations could explore trustless setups like PLONK.

Arbitrum Stylus’ support for Rust-based contracts allows us to optimize the verifier logic beyond Solidity’s limitations. The ZKP verifier contracts (e.g., `AgeVerifier.sol`) are deployed to a Stylus dev node, leveraging its lower gas fees and faster execution compared to Ethereum L1.

## Checkpoint 0: 📦 Environment Setup 📚

Before starting, ensure you have the following installed:

- [Node.js (>= v18.17)](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Clone the Repository

```bash
git clone https://github.com/abhi152003/speedrun-rust.git
cd speedrun-rust
git checkout stylus-zkp
```

## Checkpoint 1: 🚀 Start Your Dev Environment

### Step 1: Start the Nitro Dev Node

1. Navigate to the `cargo-stylus` folder:
   ```bash
   cd packages/cargo-stylus
   ```

2. Run the `run-dev-node.sh` script:
   ```bash
   bash run-dev-node.sh
   ```
   This script:
   - Spins up an Arbitrum Stylus Nitro dev node in Docker.
   - Deploys the `AgeVerifier.sol` contract.
   - Generates the ABI for interacting with the contract.

> The dev node will be accessible at `http://localhost:8547`.

### Step 2: Start the Frontend

![Frontend Interface](images/frontend-interface.png)
*The main application interface*

1. Navigate to the `nextjs` folder:
   ```bash
   cd ../nextjs
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

> The app will be available at [http://localhost:3000](http://localhost:3000).

## Checkpoint 2: 💫 Explore the Features

### 1. Age Verifier

- **Purpose**: Prove that a user’s age meets a threshold (e.g., ≥ 18) without disclosing their birthdate.
- **Circuit Logic**: The `AgeVerifier.circom` circuit takes a private input (birthdate) and a public input (threshold year). It computes the age and outputs a proof if the condition is met.
- **On-Chain Verification**: The generated proof is submitted to `AgeVerifier.sol` on the Stylus dev node, which uses the verification key to confirm validity.

![Age Verifier Interface](images/age-verifier.png)
*Age verification interface and process flow*

- Navigate to the "Debug Contracts" tab in the frontend.
- This feature interacts with the **Age Verifier** contract, which was generated from the `AgeVerifier.circom` circuit located in `packages/circuits`.
- Circuit generation commands:
  ```bash
  circom AgeVerifier.circom --r1cs --wasm --sym
  npx snarkjs groth16 setup AgeVerifier.r1cs pot12_final.ptau AgeVerifier_0000.zkey
  npx snarkjs zkey contribute AgeVerifier_0000.zkey AgeVerifier_final.zkey --name="Contributor" -v
  npx snarkjs zkey export verificationkey AgeVerifier_final.zkey verification_key.json
  npx snarkjs zkey export solidityverifier AgeVerifier_final.zkey AgeVerifier.sol
  ```
- Choose a birthdate in the frontend to generate a zk-proof, which will be verified on-chain using the deployed `AgeVerifier.sol` contract.

### 2. Balance Checker

- **Purpose**: Prove that a user’s balance exceeds a specified threshold (e.g., ≥ 1000 wei) without revealing the exact balance amount.
- **Circuit Logic**: The `BalanceChecker.circom` circuit takes a private input (user’s balance) and a public input (threshold balance). It performs a comparison to check if `balance >= threshold` and outputs a proof if the condition is satisfied. The circuit uses constraints to ensure the balance is a valid positive integer and the comparison is cryptographically sound.
- **On-Chain Verification**: The generated proof is submitted to `BalanceChecker.sol` deployed on the Arbitrum Stylus dev node. The contract uses the embedded Groth16 verification key to validate the proof against the public threshold, returning `true` if the user’s balance meets or exceeds the threshold, all while keeping the balance private.

![Balance Checker Interface](images/balance-checker.png)
*Balance verification interface and process flow*

- First, you need to modify the contract deployment:
  1. In the `run-dev-node.sh` script, use `Ctrl + F` to find all occurrences of "AgeVerifier"
  2. Replace them with "BalanceChecker"
  3. Re-run the script using `bash run-dev-node.sh`
  4. After the script runs successfully, copy the deployed contract address from the terminal output
  5. Navigate to `packages/nextjs/app/balanceChecker/page.tsx`
  6. Replace the existing contract address with your newly deployed contract address as shown below :
  ![Contract Address](images/contract-address.png)
- Access it at [http://localhost:3000/balanceChecker](http://localhost:3000/balanceChecker).
- Enter your balance and a threshold balance.
- The app generates a zk-proof to verify if your balance exceeds the threshold.

### 3. Password Verifier

- **Purpose**: Prove that a user knows a secret password (or combination) matching an expected hash without revealing the password itself.
- **Circuit Logic**: The `PasswordVerifier.circom` circuit takes a private input (the user’s password or combination) and a public input (the expected hash). It computes the hash of the password using a hash function (e.g., MiMC or Poseidon, chosen for ZKP compatibility) within the circuit and checks if it equals the expected hash. The circuit outputs a proof if the hashes match, ensuring the password remains confidential.
- **On-Chain Verification**: The generated proof is submitted to `PasswordVerifier.sol` on the Stylus dev node. The contract verifies the proof using the Groth16 verification key, confirming that the user’s input matches the expected hash without exposing the password. This enables secure, private authentication on-chain.

![Password Verifier Interface](images/password-verifier.png)
*Password verification interface and process flow*

- First, you need to modify the contract deployment:
  1. In the `run-dev-node.sh` script, use `Ctrl + F` to find all occurrences of "AgeVerifier"
  2. Replace them with "PasswordVerifier"
  3. Re-run the script using `bash run-dev-node.sh`
  4. After the script runs successfully, copy the deployed contract address from the terminal output
  5. Navigate to `packages/nextjs/app/passwordVerifier/page.tsx`
  6. Replace the existing contract address with your newly deployed contract address as shown below : 
  ![Contract Address](images/contract-address.png)
- Access it at [http://localhost:3000/passwordVerifier](http://localhost:3000/passwordVerifier).
- Example inputs:
  - Combination: `1234`
  - Expected Hash: `4321`
- The app generates a zk-proof to verify if the provided combination matches the expected hash.

## Checkpoint 3: 🛠 Modify and Deploy Contracts

You can tinker with circuit logic by modifying files in the `packages/circuits` folder. After making changes, regenerate contracts using these commands:

```bash
circom <YourCircuit>.circom --r1cs --wasm --sym
npx snarkjs groth16 setup <YourCircuit>.r1cs pot12_final.ptau <YourCircuit>_0000.zkey
npx snarkjs zkey contribute <YourCircuit>_0000.zkey <YourCircuit>_final.zkey --name="Contributor" -v
npx snarkjs zkey export verificationkey <YourCircuit>_final.zkey verification_key.json
npx snarkjs zkey export solidityverifier <YourCircuit>_final.zkey <YourCircuit>.sol
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