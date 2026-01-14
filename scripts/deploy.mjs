import { createWalletClient, createPublicClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantleSepoliaTestnet } from 'viem/chains';
import solc from 'solc';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log('🚀 Starting deployment (Node.js ESM)...');

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    if (!privateKey) {
        console.error('❌ Missing DEPLOYER_PRIVATE_KEY');
        process.exit(1);
    }

    // Contract Path - Go up one level from scripts/
    const contractPath = path.resolve(__dirname, '..', 'contracts', 'GuardToken.sol');
    if (!fs.existsSync(contractPath)) {
        console.error(`❌ Contract not found at ${contractPath}`);
        process.exit(1);
    }

    const source = fs.readFileSync(contractPath, 'utf8');
    console.log(`📦 Loaded contract: ${source.length} bytes`);

    const input = {
        language: 'Solidity',
        sources: {
            'GuardToken.sol': {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    console.log('🔨 Compiling...');
    const compiled = solc.compile(JSON.stringify(input));
    const output = JSON.parse(compiled);

    if (output.errors) {
        const errors = output.errors.filter((e) => e.severity === 'error');
        if (errors.length > 0) {
            console.error('❌ Compilation Errors:', JSON.stringify(errors, null, 2));
            process.exit(1);
        }
    }

    const contractFile = output.contracts['GuardToken.sol']['GuardToken'];
    const bytecode = contractFile.evm.bytecode.object;
    const abi = contractFile.abi;

    console.log('✅ Compilation successful!');

    const account = privateKeyToAccount(privateKey);
    const client = createWalletClient({
        account,
        chain: mantleSepoliaTestnet,
        transport: http()
    });

    const publicClient = createPublicClient({
        chain: mantleSepoliaTestnet,
        transport: http()
    });

    console.log(`📢 Deploying from: ${account.address}`);

    const hash = await client.deployContract({
        abi,
        bytecode: `0x${bytecode}`,
        args: [account.address],
    });

    console.log(`📝 Tx Hash: ${hash}`);
    console.log('⏳ Waiting for confirmation...');

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log(`\n🎉 Deployed at: ${receipt.contractAddress}`);
    fs.writeFileSync('deployed_address.txt', receipt.contractAddress);
}

main().catch(console.error);
