# 🚩 Challenge #1: 🎟 Simple NFT Example

> ⚠️ **Important:** Please complete **Challenge #0** first if you haven't already, as it contains essential instructions related to dependencies needed for all upcoming challenges.

🎫 Create a simple NFT project:

👷‍♀️ In this project, you'll build and deploy smart contracts to create, manage, and interact with NFTs. Use a React-based frontend to enable users to mint NFTs, assign them to specific addresses, check token ownership, and burn tokens directly. 🚀

🌟 The final deliverable is an app that lets users interact with the NFT contract. Deploy your contracts to a testnet, then build and upload your app to a public web server.

## Checkpoint 0: 📦 Environment Setup 📚

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

Then download the challenge to your computer and install dependencies by running:

> ⚠️ IMPORTANT: Please make sure to run the below commands through WSL only. In PowerShell, you'll get an error because some files are not supported on Windows.

```sh
git clone -b nft https://github.com/abhi152003/speedrun_stylus
cd speedrun_stylus
yarn install
```

> In the same terminal, after all the dependencies have installed, run the below commands to start the local devnode in Docker. You'll need to spin up the Stylus nitro devnode by running the script through commands. This script will deploy the contract and generate the ABI so you can interact with the contracts written in RUST:

Contracts will be deployed through the cargo stylus command using the pre-funded account's private key so users can perform any transaction through the frontend while interacting with the contract.

```sh
cd speedrun_stylus # if not done
cd packages
cd cargo-stylus
cd nft
```

> Now open your Docker desktop and then return to your IDE and run the command below to spin up the nitro devnode in Docker. This will deploy the contract and generate the ABI so you can interact with the contracts written in RUST:

```bash
bash run-dev-node.sh
```

This command will spin up the nitro devnode in Docker. You can check it out in your Docker desktop. This will take some time to deploy the RUST contract, and then the script will automatically generate the ABI. You can view all these transactions in your terminal and Docker desktop. The Docker node is running at localhost:8547.

## 🚨 Fixing Line Endings and Running Shell Scripts in WSL on a CRLF-Based Windows System

> ⚠️ This guide provides step-by-step instructions to resolve the Command not found error caused by CRLF line endings in shell scripts when running in a WSL environment.

---

## 🛠️ Steps to Fix the Issue

### Convert Line Endings to LF

Shell scripts created in Windows often have `CRLF` line endings, which cause issues in Unix-like environments such as WSL. To fix this:

#### Using `dos2unix`

1. Install `dos2unix` (if not already installed):

   ```bash
   sudo apt install dos2unix
   ```

2. Convert the script's line endings:

   ```bash
   dos2unix run-dev-node.sh
   ```

3. Make the Script Executable:

   ```bash
   chmod +x run-dev-node.sh
   ```

4. Run the Script in WSL
   ```bash
   bash run-dev-node.sh
   ```

> Then in a second WSL terminal window, you can run below commands to start your 📱 frontend:

```sh
cd speedrun_stylus ( if not done )
cd packages ( if not done )
cd nextjs
yarn run dev OR yarn dev
```

📱 Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📊 Performance Tracking

Before submitting your challenge, you can run the performance tracking script to analyze your application:

1. **Navigate to the performance tracking directory:**

   ```bash
   cd packages/nextjs/services/web3
   ```

2. **Update the contract address:**
   Open the `performanceTracking.js` file and paste the contract address that was deployed on your local node. (you can get contract address same as we have mentioned above in Docker_Img)

3. **Run the performance tracking script:**
   ```bash
   node performanceTracking.js
   ```

This will provide insights about the savings when you cache your deployed contract. The output will show performance analysis similar to the image below:

![image](https://raw.githubusercontent.com/purvik6062/speedrun_stylus/refs/heads/counter/assets/performance.png)

> 📝 **Important**: Make sure to note down the **Latency Improvement** and **Gas Savings** values from the output, as you'll need to include these metrics when submitting your challenge.

---

## 💫 Checkpoint 1: Frontend Magic

> ⛽ You'll be redirected to the below page after you complete checkpoint 0

![image](https://github.com/user-attachments/assets/e4b8dc4a-f304-43ef-8817-ae6d028beea4)

> Then you have to click on the debug contracts to start interacting with your contract. Click on "Debug Contracts" from the Navbar or from the Debug Contracts Div placed in the middle of the screen

![image](https://github.com/user-attachments/assets/2b9a8121-7498-43e6-a047-47e69b14d145)

The interface allows you to:

1. Mint NFT
2. Mint to recipient address
3. Check the Owner
4. Burn token
5. Track all transactions in the Block Explorer

Below are the examples of above all interactions that can be done with the NFT smart contract written in the RUST

![image](https://github.com/user-attachments/assets/a449b9ae-95aa-487c-bd86-3f59a5c7801d)

![image](https://github.com/user-attachments/assets/763ec7f7-dd7d-4c2f-b1d5-58c3ab6f3bcb)

![image](https://github.com/user-attachments/assets/2a320ff8-8955-4c9b-8719-65f3142137b8)

> After that, you can easily view all of your transactions from the Block Explorer Tab

![image](https://github.com/user-attachments/assets/950a27bb-ee5a-43f4-9c13-a9e4f0b48b30)

💼 Take a quick look at your deploy script `run-dev-node.sh` in `speedrun_stylus/packages/cargo-stylus/nft/run-dev-node.sh`.

📝 If you want to edit the frontend, navigate to `speedrun_stylus/packages/nextjs/app` and open the specific page you want to modify. For instance: `/debug/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.

---

## Checkpoint 2: 💾 Deploy your contract! 🛰

🛰 You don't need to provide any specifications to deploy your contract because contracts are automatically deployed from the `run-dev-node.sh`

> You can check that below :

![image](https://github.com/user-attachments/assets/d84c4d6a-be20-426b-9c68-2c021caefb29)

The above command will automatically deploy the contract functions written inside `speedrun_stylus/packages/cargo-stylus/nft/src/lib.rs`

> This local account will deploy your contracts, allowing you to avoid entering a personal private key because the deployment happens using the pre-funded account's private key.

## Checkpoint 3: 🚢 Ship your frontend! 🚁

> We are deploying all the RUST contracts at the `localhost:8547` endpoint where the nitro devnode is spinning up in Docker. You can check the network where your contract has been deployed in the frontend (http://localhost:3000):

![image](https://github.com/user-attachments/assets/bb82e696-97b9-453e-a7c7-19ebb7bd607f)

🚀 Deploy your NextJS App

```shell
vercel
```

> Follow the steps to deploy to Vercel. Once you log in (email, github, etc), the default options should work. It'll give you a public URL.

> If you want to redeploy to the same production URL you can run `yarn vercel --prod`. If you omit the `--prod` flag it will deploy it to a preview/test URL.

## Checkpoint 4: 📜 Contract Verification

You can verify your smart contract by running:

```bash
cargo stylus verify -e http://127.0.0.1:8547 --deployment-tx "$deployment_tx"
# here deployment_tx can be received through the docker desktop's terminal when you have depoloyed your contract using the below command:

cargo stylus deploy -e http://127.0.0.1:8547 --private-key "$your_private_key"
# here you can use pre-funded account's private-key as well
```

> It is okay if it says your contract is already verified.

---

## 🚀 Deploying to Arbitrum Sepolia

If you want to deploy your NFT contract to the Arbitrum Sepolia testnet, follow these steps:

1. **Run the Sepolia Deployment Script**

   Export your private key in the terminal :
   ```bash
   export PRIVATE_KEY=your_private_key_of_your_ethereum_wallet
   ```

   Open your terminal and run:

   ```bash
   cd packages/cargo-stylus/nft
   bash run-sepolia-deploy.sh
   ```

   This will deploy your NFT contract to Arbitrum Sepolia and output the contract address and transaction hash.

2. **Configure the Frontend for Sepolia**

   - Go to the `packages/nextjs` directory:
     ```bash
     cd packages/nextjs
     ```
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file and set the following variables:
     ```env
     NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
     NEXT_PUBLIC_PRIVATE_KEY=0xyour_private_key_of_your_ethereum_wallet
     ```
     Replace `your_private_key_of_your_ethereum_wallet` with your actual Ethereum wallet private key (never share this key publicly).

3. **Start the Frontend**

   ```bash
   yarn run dev
   ```

   Your frontend will now connect to the Arbitrum Sepolia network and interact with your deployed NFT contract.

---


## ⚡️ Cache Your Deployed Contract for Faster, Cheaper Access

> 📖 Contracts deployed on Arbitrum Sepolia can use this command for gas benefits, time savings, and cheaper contract function calls. Our backend will benchmark and place bids on your behalf to ensure your contract is not evicted from the CacheManager contract, fully automating this process for you.

Before caching your contract, make sure you have installed the Smart Cache CLI globally:

```bash
npm install -g smart-cache-cli
```

After deploying your contract to Arbitrum Sepolia, you can cache your contract address using the `smart-cache` CLI. Caching your contract enables:
- 🚀 **Faster contract function calls** by reducing lookup time
- 💸 **Cheaper interactions** by optimizing access to contract data
- 🌐 **Seamless access** to your contract from any environment or system

> 💡 **Info:** Both the `<address>` and `--deployed-by` flags are **mandatory** when adding a contract to the cache.

### 📝 Simple Example

```bash
smart-cache add <CONTRACT_ADDRESS> --deployed-by <YOUR_WALLET_ADDRESS_WITH_WHOM_YOU_HAVE_DEPLOYED_CONTRACT>
```

### 🛠️ Advanced Example

```bash
smart-cache add 0xYourContractAddress \
  --deployed-by 0xYourWalletAddress \
  --network arbitrum-sepolia \
  --tx-hash 0xYourDeploymentTxHash \
  --name "YourContractName" \
  --version "1.0.0"
```

- `<CONTRACT_ADDRESS>`: The address of your deployed contract (**required**)
- `--deployed-by`: The wallet address you used to deploy the contract (**required**)
- `--network arbitrum-sepolia`: By default, contracts are cached for the Arbitrum Sepolia network for optimal benchmarking and compatibility
- `--tx-hash`, `--name`, `--version`: Optional metadata for better organization

> ⚠️ **Warning:** If you omit the required fields, the command will not work as expected.

> 💡 For more options, run `smart-cache add --help`.

For more in-depth details and the latest updates, visit the [smart-cache-cli package on npmjs.com](https://www.npmjs.com/package/smart-cache-cli).

---

## 🔍 Analyze Your Contract with Radar

**Radar** by [Auditware](https://github.com/Auditware/radar) is a powerful static analysis tool designed to identify security vulnerabilities in Rust-based smart contracts. It uses a rule engine to detect common security issues like unchecked arithmetic, missing access controls, and account validation problems.

### 📦 Installation

Radar requires Docker to be installed and running on your system. Make sure Docker is installed and running before proceeding.

**Install Radar using the official installation script:** (⚠️ **Windows users must use a WSL terminal**)

```bash
curl -L https://raw.githubusercontent.com/auditware/radar/main/install-radar.sh | bash
```

This will install Radar globally on your system. Alternatively, you can install from source:

```bash
git clone https://github.com/auditware/radar.git
cd radar
bash install-radar.sh
```

**Note:** After installation, you must restart your terminal or run the following command so the system recognizes the newly installed `radar`:

```bash
source ~/.bashrc
```

### 🚀 Running Radar on Your Contract

From the root of your project, run Radar with:

```bash
radar -p .
```

This will analyze your entire project, including all contract code using Radar.

Radar will output:
- **Console output**: Real-time findings with severity levels (Low, Medium, High)
- **JSON report**: Detailed results saved to `output.json` in your project directory

**Example Output:**
```
[ Low ] Unchecked Arithmetics found at:
 * /path/to/your/contract/src/lib.rs:49:34-44

[i] radar completed successfully. json results were saved to disk.
[i] Results written to /path/to/output.json
```

> 💡 **Tip**: The JSON output (`output.json`) contains detailed information about each check, including severity, certainty, and locations of issues. Review it carefully to understand what needs to be fixed.

---

## 🏁 Next Steps

Explore more challenges or contribute to this project!

> 🏃 Head to your next challenge [here](https://speedrunstylus.com/challenge/vending-machine).
