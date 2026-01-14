import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mantleSepoliaTestnet } from 'viem/chains'
import solc from 'solc'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY
    if (!privateKey) {
        console.error('❌ Error: DEPLOYER_PRIVATE_KEY not found in .env file')
        process.exit(1)
    }

    console.log('🏗️  Compiling GuardToken.sol...')

    const contractPath = path.resolve(process.cwd(), 'contracts', 'GuardToken.sol')
    const source = fs.readFileSync(contractPath, 'utf8')

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
    }

    // Compile
    const compiled = solc.compile(JSON.stringify(input))
    console.log('Raw Solc Output Length:', compiled.length)
    const output = JSON.parse(compiled)

    if (output.errors) {
        const errors = output.errors.filter((e: any) => e.severity === 'error')
        if (errors.length > 0) {
            console.error('❌ Compilation Errors:', errors)
            process.exit(1)
        }
    }

    const contractFile = output.contracts['GuardToken.sol']['GuardToken']
    const bytecode = contractFile.evm.bytecode.object
    const abi = contractFile.abi

    console.log('✅ Compilation successful!')

    // Deploy
    const account = privateKeyToAccount(privateKey as `0x${string}`)
    const client = createWalletClient({
        account,
        chain: mantleSepoliaTestnet,
        transport: http()
    })

    const publicClient = createPublicClient({
        chain: mantleSepoliaTestnet,
        transport: http()
    })

    console.log(`🚀 Deploying from address: ${account.address}`)

    const hash = await client.deployContract({
        abi,
        bytecode: `0x${bytecode}`,
        args: [account.address], // Initial Owner
    })

    console.log(`📝 Transaction sent: ${hash}`)
    console.log('⏳ Waiting for confirmation...')

    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    console.log(`\n🎉 Contract Deployed Successfully!`)
    console.log(`📍 Address: ${receipt.contractAddress}`)
    console.log(`\n👉 NEXT STEP: Copy this address to 'lib/token-config.ts'`)
}

main().catch(console.error)
