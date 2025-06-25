# 🚩 Challenge #11 : Setup of Vibekit Agents

🎫 Get started with Vibekit DeFi Agents:

👷‍♀️ You'll set up and interact with autonomous DeFi agents using the Vibekit framework. Then, you'll use a modern React frontend to interact with various agents including lending, liquidity, and swapping agents. Finally, you'll deploy and run agents in a Docker environment to experience the full power of DeFi automation! 🚀

🌟 The final deliverable is a fully functional Vibekit setup that lets users interact with multiple DeFi agents through a beautiful web interface.

## 📙 Introduction

Vibekit is the polyglot toolkit for vibe coding smart, autonomous DeFi agents that vibe with the blockchain. Whether you're automating trades, managing liquidity, or integrating with on-chain and off-chain data, Vibekit makes it effortless and fun.

At its core, Vibekit uses the Model Context Protocol (MCP) to standardize how agents connect with tools and data. It includes built-in Agent2Agent (A2A) integration, so the agents can easily work together. Vibekit also works smoothly with popular frameworks like Eliza and LangGraph, just add our MCP tools to your existing agents and watch them level up with DeFi superpowers!

## 🧬 Repository Organization

Vibekit is structured as a monorepo with TypeScript at its core, with a Rust implementation is on the horizon. Here's how it's organized:

- `clients/`: Clients for front-end interaction with agents.

- `templates/`: Vibekit framework agents to use as a starting template to build your own agent.

- `examples/`: Agent examples that demonstrate the use of Ember AI's MCP tools.

- `lib/`: Core libraries and tools.

- `mcp-tools/`: Implementations of MCP tools.

### 📙 For more informations you can visit the below link:

- [Vibekit Documentation](https://github.com/EmberAGI/arbitrum-vibekit)

## Checkpoint 0: 📦 Prerequisites 📚

Before starting, ensure you have the following installed:

- [Node.js (>= v18.17)](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [WSL (for Windows users)](https://www.geeksforgeeks.org/how-to-install-wsl2-windows-subsystem-for-linux-2-on-windows-10/)

### 🔧 Version Checking

Ensure your tools versions after successful installations:

```bash
# Check your versions
pnpm --version
docker --version
docker compose version
```

> 💡 If your are on an M-series Mac, you need to install Docker using the [dmg package](https://docs.docker.com/desktop/setup/install/mac-install/) supplied officially by Docker rather than through Homebrew or other means to avoid build issues.

## ⚡ Developer Quickstart

> ⚠️ **IMPORTANT**: Vibekit currently only supports Arbitrum and Ethereum mainnet configurations. Testnet support is not available as of now.

Follow these steps to build and run an agent:

### 🚩 Setup Instructions

#### For Ubuntu/Mac Users:

1. Open your terminal.
2. Clone the repository:

   ```bash
   git clone https://github.com/EmberAGI/arbitrum-vibekit.git
   cd arbitrum-vibekit
   ```

3. Navigate to the TypeScript directory and install dependencies:

   ```bash
   cd typescript
   pnpm install
   ```

   > 💡 **Important**: After cloning the repository, you must run `pnpm install` in the typescript directory to install all project dependencies before proceeding.

4. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

5. 🔑 **Configure your environment variables:**

   Edit the `.env` file and populate it with your API keys:

   **Step 1:** 🔓 Uncomment this variable:

   ```bash
   MCP_TOOL_TIMEOUT_MS=90000
   ```

   **Step 2:** 🌐 Get your OpenRouter API key:

   - Visit [🔗 OpenRouter API Keys](https://openrouter.ai/settings/keys)
   - Click "Create Key"
   - ⚠️ **Important**: Set "Credit limit (optional)" to **$0**
   - 📋 Copy the generated key and paste it in your `.env` file

   **Step 3:** 🔗 Get your QuickNode API credentials (Required for on-chain transactions):

   > ⚠️ **Important**: Any on-chain transactions like swapping, buying tokens, providing liquidity, or lending to AAVE require valid QuickNode credentials. Without them, you'll receive a **401 Unauthorized error**.

   - Visit [🔗 QuickNode Dashboard](https://dashboard.quicknode.com/endpoints)
   - Complete authentication first
   - Create an Arbitrum Mainnet endpoint to do any transaction on Arbitrum
   - Your endpoint URL will look like: `https://rough-lively-example.arbitrum-mainnet.quiknode.pro/3ergrt62e53b2d4dfiuebfiuerbfir086f1b705f07b/`

   **Configure in your `.env` file:**

   ```bash
   QUICKNODE_SUBDOMAIN=rough-lively-example
   QUICKNODE_API_KEY=3ergrt62e53b2d4dfiuebfiuerbfir086f1b705f07b
   ```

   > 💡 **Breakdown**: In the URL above, `rough-lively-example` is your **QUICKNODE_SUBDOMAIN** and `3ergrt62e53b2d4dfiuebfiuerbfir086f1b705f07b` is your **QUICKNODE_API_KEY** (everything after `arbitrum-mainnet.quiknode.pro/`).

6. Start the services with Docker Compose:

   ```bash
   docker compose up
   ```

7. Open [http://localhost:3000](http://localhost:3000) to see the Vibekit frontend.

### 🤖 Model Configuration & Setup

> 🚨 **IMPORTANT**: Getting errors when chatting? Read this section!

## The Default Model Problem

> ⚠️ **Error Alert**: Vibekit uses `google/gemini-2.5-pro-preview` as the default model in `typescript/clients/web/lib/ai/providers.ts`, which is a **paid model**. If you don't have credits, you'll get errors! 💥

#### How to Switch to Free Models

**🔍 Step 1: Find Free Models**

1. 🌐 Visit [OpenRouter Models](https://openrouter.ai/models)
2. 💰 From the left panel, select **"FREE"** in prompt pricing filter, also added a screenshot below for your reference
3. 📋 Browse all available free LLM models

### Here's the screenshot:

![image](https://github.com/user-attachments/assets/11bff1a5-865f-4fe4-8049-12b465ded44d)

**🔄 Step 2: Replace the Model**
Replace `google/gemini-2.5-pro-preview` with your chosen free model everywhere in the code.

#### ⚠️ Model Compatibility Warning

> 🛑 **CAUTION**: Some free models don't play nice with MCP servers and will refuse connections!

**❌ Example of problematic model:**

```
google/gemma-3n-e4b-it:free → May cause errors in Vibekit
```

#### ✅ Battle-Tested Free Models

These models work great with Vibekit! 🎯

```
meta-llama/llama-4-scout:free
meta-llama/llama-4-maverick:free
meta-llama/llama-3.3-70b-instruct:free
```

#### 🧪 Test Before You Deploy

**Before using any model in Vibekit, test it first!**

🔗 **Testing Playground**: [OpenRouter API Reference](https://openrouter.ai/docs/api-reference/chat-completion?explorer=true)

**Testing Steps:**

1. 🔑 Enter your OpenRouter API key
2. 🎯 Select your preferred free model
3. 💬 Add a test prompt in the content parameter
4. 🚀 Click "Send Request" (upper right corner)
5. ✅ No errors = Model is Vibekit-ready!
6. ❌ Got errors = Try a different model

### For your reference here a attached screenshot:

![image](https://github.com/user-attachments/assets/6f73e9a1-4d03-437f-bf9a-f71c7b408f24)

> 💡 **Pro Tip**: Always test with a simple prompt like "Hello, how are you?" before integrating into Vibekit!

#### For Windows Users (Using WSL):

1. Open your WSL terminal.
2. Ensure you have set your Git username and email globally:

   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. 🔄 **From here, all steps are the same as Mac/Ubuntu users above!**

   Please follow steps 2-6 from the **"For Ubuntu/Mac Users"** section above, starting from cloning the repository.

> 📝 **Note**: All subsequent steps including model configuration are identical for Windows WSL users.

### 🛠️ Troubleshooting Common Issues

#### 1. Docker Permission Denied

If you encounter a permission denied error when running Docker commands, try running with `sudo`:

```bash
sudo docker compose up
```

#### 2. Frontend Errors or Database Issues

If you previously ran `docker compose up` with an older version and encounter errors:

1. Clear your browser cache.
2. Run the following command:
   ```bash
   docker compose down && docker volume rm typescript_db_data && docker compose build web --no-cache && docker compose up
   ```

#### 3. Environment Variables Not Loading

Make sure your `.env` file is properly configured:

- Check that the file is named exactly `.env` (not `.env.txt`)
- Ensure all required API keys are populated
- Restart the Docker containers after making changes

#### 4. Frontend Changes Not Reflecting

If you've made frontend changes and restarted Docker containers but don't see the updates:

- **Important**: You must clear your browser cache before restarting containers for frontend changes to take effect
- Frontend changes require cache clearing to take effect after container restart

#### 5. Port Already in Use

If port 3000 is already in use:

- Stop any other applications using port 3000
- Or modify the port in the Docker configuration

---

## 💫 Checkpoint 1: Frontend Magic

> ⛽ You'll be redirected to the Vibekit dashboard after you complete checkpoint 0

The Vibekit frontend provides a beautiful interface to interact with various DeFi agents:

![image](https://github.com/user-attachments/assets/322e6b7c-8ed3-4d48-8c42-19a742bf1c7b)

> Navigate through the agent selector to choose different agents like lending, liquidity, or swapping agents

![image](https://github.com/user-attachments/assets/11a7c493-89cb-41a0-b4ed-dd8921bf2be3)

The interface allows you to:

1. Select different DeFi agents
2. Chat with agents using natural language
3. Execute DeFi operations through agent interactions
4. Monitor transaction history
5. View agent reasoning and decision-making process

## 💼 Take a quick look at the frontend code in `typescript/clients/web/app` to understand the structure.

## Checkpoint 2: 🤖 Agents Overview

🤖 Vibekit comes with several pre-built agents that are automatically started:

> **Lending Agent**: Handles borrowing and lending operations on Aave
> **Liquidity Agent**: Manages liquidity provision on various DEXs
> **Swapping Agent**: Executes token swaps across different protocols

Each agent runs as a separate service in Docker and communicates using the MCP protocol.

## Checkpoint 3: 🚢 Interact with Agents

> 🎯 Start chatting with agents through the web interface at http://localhost:3000

The agents can help you with:

- **DeFi Operations**: Execute swaps, provide liquidity, borrow/lend
- **Market Analysis**: Get insights about token prices and market conditions
- **Portfolio Management**: Track and manage your DeFi positions
- **Risk Assessment**: Analyze risks before executing operations

🚀 Each interaction is powered by advanced AI that understands DeFi protocols and can execute complex operations safely.

---

## Checkpoint 4: 🔧 Customization

You can customize and extend Vibekit by:

- **Adding New Agents**: Use templates in `typescript/templates/` to create new agents
- **Modifying Existing Agents**: Edit agent configurations in `typescript/examples/`
- **Creating Custom Tools**: Implement new MCP tools in `typescript/lib/mcp-tools/`
- **Frontend Customization**: Modify the React components in `typescript/clients/web/`

📚 Check out the [Templates Documentation](https://github.com/EmberAGI/arbitrum-vibekit/tree/main/typescript/templates/quickstart-agent) for detailed guides on creating custom agents.

---

## 🏆 How to Submit Vibekit Projects into Speedrun

🎉 **Congratulations!** You've successfully completed all the Vibekit setup steps and have your DeFi agents running locally!

Now it's time to showcase your achievement and submit your project for review. Follow these final steps to complete your speedrun submission:

### 📤 Submission Process

1. **🔄 Push Your Code**:

   - Ensure all your Vibekit code changes are committed and pushed to your GitHub repository
   - Make sure your `.env` file is **NOT** included (keep your API keys secure!)
   - Verify that your repository contains all the necessary files and configurations

2. **✅ Final Verification**:

   - Confirm that your Vibekit UI is running successfully at `http://localhost:3000`
   - Test that you can interact with at least one agent (lending, liquidity, or swapping)
   - Ensure all Docker containers are running without errors

3. **🚀 Submit Your Challenge**:
   - Navigate to the speedrun submission portal
   - Click on the **"Submit Challenge"** button
   - Paste your repository URL in the submission field
   - Add any additional notes about your implementation or customizations

### 🔍 What Happens Next?

Once you submit your repository URL:

- ✨ **Acquisition**: We'll acquire your submitted repository
- 📊 **Update**: We'll update your submission count and provide feedback
- 🏅 **Recognition**: Successful submissions will be recognized in the speedrun leaderboard

### 💡 Pro Tips for Submission

- **📝 Documentation**: Include clear comments in your code if you made any customizations
- **🐛 Bug Fixes**: Document any issues you encountered and how you resolved them
- **🎨 Enhancements**: Highlight any additional features or improvements you added
- **📸 Screenshots**: Consider adding screenshots of your working setup in your repository

**Ready to submit? Click that Submit Challenge button and join the ranks of successful Vibekit developers!** 🚀

---

_Thank you for completing the Vibekit speedrun challenge! Your contribution helps build the future of DeFi automation._ 💫
