# 🚩 Challenge #10 : ZKP - Aadhaar Verifier

> ⚠️ **Important:** Please complete **Challenge #9** first if you haven't already, as it contains essential instructions related to all upcoming challenges.

🎫 Build Privacy-Preserving Verifiers using Zero-Knowledge Proofs (ZKP) on Arbitrum Stylus:

👷‍♀️ In this challenge, you'll explore a frontend that uses the Anon Aadhaar SDK to verify identity without revealing sensitive information. For advanced users, you can optionally deploy smart contracts to an Arbitrum Stylus dev node for custom verification logic. 🚀

🌟 The final deliverable is a privacy-preserving Aadhaar identity verification application that uses zero-knowledge proofs.

### How ZKP Integration Works
This project leverages Zero-Knowledge Proofs (ZKPs) to enable private verification of Aadhaar identity:

1. **Anon Aadhaar SDK**: We integrate [Anon Aadhaar](https://github.com/anon-aadhaar/anon-aadhaar), a privacy-preserving protocol for proving Aadhaar identity through zero-knowledge proofs.
2. **Frontend Integration**: The Next.js frontend uses the Anon Aadhaar SDK for QR code verification and selective disclosure of identity information.
3. **Advanced (Optional)**: For those wanting to modify the underlying circuits, verification keys can be exported to Solidity contracts that run on Arbitrum Stylus, allowing on-chain verification of zk-proofs.

This integration ensures privacy (inputs remain off-chain) while providing cryptographic proof of identity.

## Checkpoint 0: 📦 Environment Setup 📚

Before starting, ensure you have the following installed:

- [Node.js (>= v18.17)](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (optional - only needed for advanced customization)

### Clone the Repository

```bash
git clone -b stylus-zkp-anon-aadhaar https://github.com/abhi152003/speedrun_stylus.git
cd speedrun_stylus
```

### Install Dependencies

Run the following command to install all necessary dependencies:

```bash
yarn install
```

## Checkpoint 1: 🚀 Start Your Dev Environment

### Start the Frontend Application

Navigate to the `nextjs` folder and start the development server:

```bash
cd packages/nextjs
yarn dev
```

> The app will be available at [http://localhost:3000](http://localhost:3000).

> **Note:** The app works out-of-the-box with the Anon Aadhaar SDK. You don't need to run a local Stylus node unless you want to modify the underlying ZK circuits and verifier contracts.

## Checkpoint 2: 💫 Explore the Features

### Anon Aadhaar Verifier

- **Purpose**: Verify identity information from an Aadhaar QR code without revealing all personal data.
- **Implementation**: Uses the [Anon Aadhaar SDK](https://github.com/anon-aadhaar/anon-aadhaar) to verify Aadhaar QR codes and generate zero-knowledge proofs.
- **Privacy-Preserving**: Users choose which fields to reveal (age, gender, pincode, state) while keeping other information private.

Key features:
- Toggle between test mode and production mode for different QR code validation
- Select specific fields to reveal while keeping others private
- View detailed proof information, including the Groth16 ZK proof components

![Image](https://github.com/user-attachments/assets/08ffa63a-14c8-42b9-853d-fe5fd43dd92f)
Visit [http://localhost:3000/anon-aadhaar](http://localhost:3000/anon-aadhaar) to try the Anon Aadhaar Verifier.

## Advanced (Optional): 🛠 Deploying to a Local Arbitrum Stylus Node

If you want to dive deeper into ZKP circuits or deploy custom verification contracts, follow these steps:

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
   - Deploys the verifier contracts.
   - Generates the ABI for interacting with the contracts.

> The dev node will be accessible at `http://localhost:8547`.

### Step 2: Modify and Deploy Custom Contracts

For the Anon Aadhaar verification, refer to the [Anon Aadhaar documentation](https://documentation.anon-aadhaar.pse.dev/docs/intro) for customizing its behavior.

To see how the ZK circuits work under the hood, explore the circuits in the Anon Aadhaar repository's [circuit folder](https://github.com/anon-aadhaar/anon-aadhaar/tree/main/packages/circuits).

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

## Checkpoint 3: 🚢 Ship your frontend! 🚁

To deploy your app to Vercel:

```bash
vercel
```

Follow Vercel's instructions to get a public URL.

For production deployment:
```bash
vercel --prod
```

## 🏆 Credits and Acknowledgements

This project uses the following open-source technology:

- [Anon Aadhaar](https://github.com/anon-aadhaar/anon-aadhaar) - A zero-knowledge protocol that allows Aadhaar ID owners to prove their identity in a privacy-preserving way, developed by [Privacy & Scaling Explorations](https://pse.dev/).

## 🏁 Next Steps

- Explore other zk-proof applications for privacy-preserving verification
- Add more identity verification options
- Implement on-chain credential issuance based on successful verifications
- Integrate with decentralized identity frameworks

## 🎉🎉 Congratulations! 🎉🎉

You've successfully completed all the challenges! Your dedication and hard work have paid off. Keep exploring and learning more about the exciting world of blockchain technology. 

Good luck on your journey ahead! 🚀