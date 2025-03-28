#!/bin/bash

# Start Nitro dev node in the background
echo "Starting Nitro dev node..."
docker run --rm --name nitro-dev -p 8547:8547 offchainlabs/nitro-node:v3.2.1-d81324d --dev --http.addr 0.0.0.0 --http.api=net,web3,eth,debug --http.corsdomain="*" &

# Wait for the node to initialize
echo "Waiting for the Nitro node to initialize..."
until [[ "$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' \
  http://127.0.0.1:8547)" == *"result"* ]]; do
    sleep 0.1
done
echo "Nitro node is running!"

# Compile the Solidity contract
echo "Compiling Solidity contract..."
solcjs --bin --abi --optimize -o build/ contracts/ModelVerifier.sol

if [[ $? -ne 0 ]]; then
    echo "Error: Solidity compilation failed"
    exit 1
fi

# Extract compiled contract binary
contract_bin=$(cat build/contracts_ModelVerifier_sol_Groth16Verifier.bin)
contract_abi=$(cat build/contracts_ModelVerifier_sol_Groth16Verifier.abi)

if [[ -z "$contract_bin" || -z "$contract_abi" ]]; then
    echo "Error: Compilation output not found"
    exit 1
fi

echo "Solidity contract compiled successfully."

# Deploy the contract to Nitro dev node
echo "Deploying the Solidity contract..."
deploy_output=$(cast send --private-key 0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659 \
  --rpc-url http://127.0.0.1:8547 \
  --create 0x$contract_bin)

# Extract deployment transaction hash and contract address
deployment_tx=$(echo "$deploy_output" | grep -oE '0x[a-fA-F0-9]{64}')
contract_address=$(echo "$deploy_output" | grep -oE '0x[a-fA-F0-9]{40}')

if [[ -z "$deployment_tx" ]]; then
    echo "Error: Contract deployment failed. Output:"
    echo "$deploy_output"
    exit 1
fi
# Output ABI for future use
echo "$contract_abi" > build/ModelVerifierABI.json
echo "ABI saved to build/ModelVerifierABI.json"

# Monitor the Nitro node
while true; do
    if ! docker ps | grep -q nitro-dev; then
        echo "Nitro node container stopped unexpectedly"
        exit 1
    fi
    sleep 5
done