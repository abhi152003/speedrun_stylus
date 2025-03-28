# 🚩 Challenge #8 : ZKP - Location Verifier

🎫 Build a Location Verifier using Zero-Knowledge Proofs (ZKP) on Arbitrum Stylus:

👷‍♀️ In this challenge, you'll build and deploy a smart contract that utilizes Zero-Knowledge Proofs for private location verification. You'll work with ZKP circuits, deploy them to an Arbitrum Stylus dev node, and create a frontend that allows users to generate and verify proofs! 🚀

🌟 The final deliverable is a full-stack application featuring location verification. Deploy your contract to a testnet, then build and upload your app to a public web server.

### How ZKP Integration Works
This project leverages Zero-Knowledge Proofs (ZKPs) to enable private verification of location on Arbitrum Stylus. Here's the workflow:

1. **Circuit Design**: The ZKP logic is defined in `.circom` files (e.g., `LocationVerifier.circom`) using the Circom language. These circuits encode the rules for verification (e.g., "is the user within the bounding box?") without revealing the inputs.
2. **Proof System Setup**: We use the `snarkjs` library with the Groth16 proving system to generate proving and verification keys. The trusted setup is simulated using a pre-existing `pot12_final.ptau` file.
3. **Contract Generation**: The verification key is exported to a Solidity contract (e.g., `LocationVerifier.sol`) that runs on Arbitrum Stylus, allowing on-chain verification of zk-proofs.
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
git checkout stylus-zkp-location-verifier
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
   - Deploys the `LocationVerifier.sol` contract.
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

> The app will be available at [http://localhost:3000/locationVerifier](http://localhost:3000/locationVerifier).

## Checkpoint 2: 💫 Explore the Features

### Location Verifier

- **Purpose**: Prove that a user's current geographic location (latitude and longitude) lies within a specific state's bounding box (e.g., California) without revealing their exact coordinates.
- **Circuit Logic**: The `LocationVerifier.circom` circuit takes two private inputs (`user_lat`, `user_lon`) representing the user's scaled latitude and longitude, and four public inputs (`min_lat`, `max_lat`, `min_lon`, `max_lon`) defining the state's bounding box, also scaled to integers (e.g., multiplied by \(10^7\)). For California, the bounding box might be defined as:
  - `min_lat`: 32.5343 (scaled)
  - `max_lat`: 42.0095 (scaled)
  - `min_lon`: -124.4096 (scaled)
  - `max_lon`: -114.8483 (scaled)
- **On-Chain Verification**: The generated proof is submitted to `LocationVerifier.sol` on the Stylus dev node, which uses the verification key to confirm validity.

![Location Verifier Interface](https://github.com/user-attachments/assets/bb817dd3-5e88-4a14-a60e-c6063a4c5254)
*Location verification interface and process flow*

- Navigate to the "Debug Contracts" tab in the frontend.
- This feature interacts with the **Location Verifier** contract, which was generated from the `LocationVerifier.circom` circuit located in `packages/circuits`.
- Circuit generation commands:
  ```bash
  circom LocationVerifier.circom --r1cs --wasm --sym
  npx snarkjs groth16 setup LocationVerifier.r1cs pot12_final.ptau LocationVerifier_0000.zkey
  npx snarkjs zkey contribute LocationVerifier_0000.zkey LocationVerifier_final.zkey --name="Contributor" -v
  npx snarkjs zkey export verificationkey LocationVerifier_final.zkey verification_key.json
  npx snarkjs zkey export solidityverifier LocationVerifier_final.zkey LocationVerifier.sol
  ```
- Enter your current location in the frontend to generate a zk-proof, which will be verified on-chain using the deployed `LocationVerifier.sol` contract.

## Checkpoint 3: 🛠 Modify and Deploy Contracts

You can tinker with circuit logic by modifying files in the `packages/circuits` folder. After making changes, regenerate contracts using these commands:

```bash
circom LocationVerifier.circom --r1cs --wasm --sym
npx snarkjs groth16 setup LocationVerifier.r1cs pot12_final.ptau LocationVerifier_0000.zkey
npx snarkjs zkey contribute LocationVerifier_0000.zkey LocationVerifier_final.zkey --name="Contributor" -v
npx snarkjs zkey export verificationkey LocationVerifier_final.zkey verification_key.json
npx snarkjs zkey export solidityverifier LocationVerifier_final.zkey LocationVerifier.sol
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