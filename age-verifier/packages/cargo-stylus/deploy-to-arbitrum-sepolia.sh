#!/bin/bash

# Check if private key is set in environment
if [[ -z "$PRIVATE_KEY" ]]; then
    echo "Error: PRIVATE_KEY environment variable is not set"
    echo "Please set your private key: export PRIVATE_KEY=your_private_key_here"
    exit 1
fi

# Arbitrum Sepolia RPC URL
RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# Check if we can connect to Arbitrum Sepolia
echo "Checking connection to Arbitrum Sepolia..."
if ! curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' \
  "$RPC_URL" > /dev/null; then
    echo "Error: Cannot connect to Arbitrum Sepolia RPC"
    exit 1
fi
echo "Connected to Arbitrum Sepolia!"

# Compile the Solidity contract
echo "Compiling Solidity contract..."
solcjs --bin --abi --optimize -o build/ contracts/AgeVerifier.sol

if [[ $? -ne 0 ]]; then
    echo "Error: Solidity compilation failed"
    exit 1
fi

# Extract compiled contract binary
contract_bin=$(cat build/contracts_AgeVerifier_sol_Groth16Verifier.bin)
contract_abi=$(cat build/contracts_AgeVerifier_sol_Groth16Verifier.abi)

if [[ -z "$contract_bin" || -z "$contract_abi" ]]; then
    echo "Error: Compilation output not found"
    exit 1
fi

echo "Solidity contract compiled successfully."

# Deploy the contract to Arbitrum Sepolia
echo "Deploying the Solidity contract to Arbitrum Sepolia..."
deploy_output=$(cast send --private-key "$PRIVATE_KEY" \
  --rpc-url "$RPC_URL" \
  --create 0x$contract_bin)

# Extract transaction hash and contract address from deployment output
deployment_tx=$(echo "$deploy_output" | grep "transactionHash" | grep -oE '0x[a-fA-F0-9]{64}')
contract_address=$(echo "$deploy_output" | grep "contractAddress" | grep -oE '0x[a-fA-F0-9]{40}')

if [[ -z "$deployment_tx" ]]; then
    echo "Error: Could not extract transaction hash from deployment. Output:"
    echo "$deploy_output"
    exit 1
fi

if [[ -z "$contract_address" ]]; then
    echo "Error: Could not extract contract address from deployment. Output:"
    echo "$deploy_output"
    exit 1
fi

echo "Contract deployed successfully!"
echo "Transaction hash: $deployment_tx"
echo "Contract address: $contract_address"

# Output ABI for future use
echo "$contract_abi" > build/AgeVerifierABI.json
echo "ABI saved to build/AgeVerifierABI.json"

# Save deployment info
echo "{
  \"network\": \"arbitrum-sepolia\",
  \"contract_address\": \"$contract_address\",
  \"transaction_hash\": \"$deployment_tx\",
  \"rpc_url\": \"$RPC_URL\"
}" > build/deployment-info.json

echo "Deployment info saved to build/deployment-info.json"
echo "Deployment completed successfully!"