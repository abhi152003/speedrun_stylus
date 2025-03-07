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

![Frontend Interface](https://github.com/user-attachments/assets/3502c4b8-7bb6-4ea4-92e0-cbbf1ebe7039)
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

![Age Verifier Interface](https://github.com/user-attachments/assets/36c8961b-a3c2-4dee-ab53-929ddb8a265b)
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

![Balance Checker Interface](https://github.com/user-attachments/assets/a67edf35-119d-4766-874d-9f92e36c7150)
*Balance verification interface and process flow*

- First, you need to modify the contract deployment:
  1. In the `run-dev-node.sh` script, use `Ctrl + F` to find all occurrences of "AgeVerifier"
  2. Replace them with "BalanceChecker"
  3. Re-run the script using `bash run-dev-node.sh`
  4. After the script runs successfully, copy the deployed contract address from the terminal output
  5. Navigate to `packages/nextjs/app/balanceChecker/page.tsx`
  6. Replace the existing contract address with your newly deployed contract address as shown below :
  ![Contract Address](https://github.com/user-attachments/assets/06618145-dc63-464d-8acf-57dd267b24ec)
- Access it at [http://localhost:3000/balanceChecker](http://localhost:3000/balanceChecker).
- Enter your balance and a threshold balance.
- The app generates a zk-proof to verify if your balance exceeds the threshold.

### 3. Password Verifier

- **Purpose**: Prove that a user knows a secret password (or combination) matching an expected hash without revealing the password itself.
- **Circuit Logic**: The `PasswordVerifier.circom` circuit takes a private input (the user’s password or combination) and a public input (the expected hash). It computes the hash of the password using a hash function (e.g., MiMC or Poseidon, chosen for ZKP compatibility) within the circuit and checks if it equals the expected hash. The circuit outputs a proof if the hashes match, ensuring the password remains confidential.
- **On-Chain Verification**: The generated proof is submitted to `PasswordVerifier.sol` on the Stylus dev node. The contract verifies the proof using the Groth16 verification key, confirming that the user’s input matches the expected hash without exposing the password. This enables secure, private authentication on-chain.

![Password Verifier Interface](https://github.com/user-attachments/assets/a031b559-46a4-4e70-9619-e535a4c65675)
*Password verification interface and process flow*

- First, you need to modify the contract deployment:
  1. In the `run-dev-node.sh` script, use `Ctrl + F` to find all occurrences of "BalanceChecker"
  2. Replace them with "PasswordVerifier"
  3. Re-run the script using `bash run-dev-node.sh`
  4. After the script runs successfully, copy the deployed contract address from the terminal output
  5. Navigate to `packages/nextjs/app/passwordVerifier/page.tsx`
  6. Replace the existing contract address with your newly deployed contract address as shown below : 
  ![Contract Address](https://github.com/user-attachments/assets/b63e4cc9-e322-4651-a511-0611f43b17a4)
- Access it at [http://localhost:3000/passwordVerifier](http://localhost:3000/passwordVerifier).
- Example inputs:
  - Combination: `1234`
  - Expected Hash: `4321`
- The app generates a zk-proof to verify if the provided combination matches the expected hash.

### 4. Location Verifier

- **Purpose**: Prove that a user’s current geographic location (latitude and longitude) lies within a specific state’s bounding box without revealing their exact coordinates. This ensures privacy while allowing verification of location-based eligibility, such as regional access or compliance with jurisdictional requirements.
- **Circuit Logic**: 
  - The `LocationVerifier.circom` circuit takes two private inputs (`user_lat`, `user_lon`) representing the user’s scaled latitude and longitude, and four public inputs (`min_lat`, `max_lat`, `min_lon`, `max_lon`) defining the state’s bounding box, also scaled to integers (e.g., multiplied by \(10^7\)).
  - It uses Circom’s `GreaterEqThan` and `LessEqThan` components from `circomlib` to enforce four constraints:
    - `user_lat >= min_lat`: Ensures the user’s latitude is at or above the state’s minimum latitude.
    - `user_lat <= max_lat`: Ensures the user’s latitude is at or below the state’s maximum latitude.
    - `user_lon >= min_lon`: Ensures the user’s longitude is at or above the state’s minimum longitude.
    - `user_lon <= max_lon`: Ensures the user’s longitude is at or below the state’s maximum longitude.
  - Each constraint outputs a 1 (true) if satisfied, and the circuit enforces all must be true using `=== 1`. If any condition fails (e.g., the user’s location is outside the box), proof generation fails, reflecting that the statement "user is in the state" is false.
- **On-Chain Verification**: 
  - The user generates a proof locally using the `snarkjs` library’s `groth16.fullProve` function, providing their private location (`user_lat`, `user_lon`) and the public bounding box coordinates.
  - The proof, along with the public inputs (`min_lat`, `max_lat`, `min_lon`, `max_lon`), is submitted to the `Groth16Verifier.sol` contract deployed on the Arbitrum Stylus dev node. This leverages Stylus’ efficient execution to minimize gas costs.


![Location Verifier Interface](https://github.com/user-attachments/assets/bb817dd3-5e88-4a14-a60e-c6063a4c5254)
*Location verification interface and process flow*

- First, you need to modify the contract deployment:
  1. In the `run-dev-node.sh` script, use `Ctrl + F` to find all occurrences of "PasswordVerifier".
  2. Replace them with "LocationVerifier".
  3. Re-run the script using `bash run-dev-node.sh`.
  4. After the script runs successfully, copy the deployed contract address from the terminal output.
  5. Navigate to `packages/nextjs/app/locationVerifier/page.tsx`.
  6. Replace the existing contract address with your newly deployed contract address as shown below: 
  ![Contract Address](https://github.com/user-attachments/assets/b63e4cc9-e322-4651-a511-0611f43b17a4)
- Access it at [http://localhost:3000/locationVerifier](http://localhost:3000/locationVerifier).
- Example inputs:
- Current Location: `Latitude: 34.0522, Longitude: -118.2437` (e.g., Los Angeles, CA) (You'll need to allow location permission to be able to fetch your current location using GPS.)
- State Location: `California`
- The app generates a zk-proof to verify if the user’s current location lies within the specified state’s bounding box without revealing the exact coordinates.

### 5. Model Verifier

- **Purpose**: Prove that a linear regression model’s output (`y`) was correctly computed as `y = w * x + b` for a user-provided input (`x`), using secret model parameters (`w` and `b`), without revealing those parameters. This ensures privacy for proprietary models while allowing users to verify the computation’s integrity, such as in secure ML inference services.
- **Circuit Logic**: 
  - The `ModelVerifier.circom` circuit takes two private inputs (`w`, `b`) representing the slope and intercept of the linear regression model, and three public inputs (`x`, `y`, `H`) representing the user’s input, the computed output, and a commitment hash of the model parameters, respectively. All values are integers for simplicity.
  - It performs two main computations with constraints:
    - **Output Computation**: Calculates `y_computed = w * x + b` and enforces `y_computed === y`, ensuring the provided output matches the secret model’s prediction for the given input.
    - **Commitment Verification**: Uses the `Poseidon` hash function from `circomlib` to compute `H_computed = Poseidon(w, b)` and enforces `H_computed === H`, ensuring the secret parameters match the public commitment hash.
  - If either constraint fails (e.g., `y` doesn’t match the computation or `H` doesn’t correspond to `w` and `b`), proof generation fails, reflecting that the statement "the output was computed correctly with the committed model" is false.
- **On-Chain Verification**: 
  - The user (or service, in a real scenario) generates a proof locally using the `snarkjs` library’s `groth16.fullProve` function, providing the private model parameters (`w`, `b`) and the public inputs (`x`, `y`, `H`).
  - The proof, along with the public inputs (`x`, `y`, `H`), is submitted to the `ModelVerifier.sol` contract deployed on the Arbitrum Stylus dev node. The contract verifies the proof using the Groth16 verification key, returning `true` if the computation is valid and consistent with the committed model, leveraging Stylus’ efficient execution to minimize gas costs.

![Model Verifier Interface](https://github.com/user-attachments/assets/9192372d-bb8e-41a5-a384-5c726e2a6eb9)
*Model verification interface and process flow*

- First, you need to modify the contract deployment:
  1. In the `run-dev-node.sh` script, use `Ctrl + F` to find all occurrences of "LocationVerifier".
  2. Replace them with "ModelVerifier".
  3. Re-run the script using `bash run-dev-node.sh`.
  4. After the script runs successfully, copy the deployed contract address from the terminal output.
  5. Navigate to `packages/nextjs/app/modelVerifier/page.tsx`.
  6. Replace the existing contract address with your newly deployed contract address as shown below:
  ![Contract Address](https://github.com/user-attachments/assets/b63e4cc9-e322-4651-a511-0611f43b17a4)
- Access it at [http://localhost:3000/modelVerifier](http://localhost:3000/modelVerifier).
- Example inputs:
- Slope (`w`): `2`
- Intercept (`b`): `3`
- Input (`x`): `5`
- Output (`y`): `13` (computed as `y = 2 * 5 + 3`)
- Commitment Hash (`H`): `Poseidon(2, 3)` (automatically computed and displayed in the app)
- The app generates a zk-proof to verify that the output `y` was correctly computed using the secret model parameters committed to by the hash `H`, without revealing `w` or `b` to the verifier.

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