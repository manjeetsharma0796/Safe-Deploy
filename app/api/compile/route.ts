import { NextResponse } from 'next/server'
// @ts-ignore
import solc from 'solc'

type CompileRequest = {
    sourceCode: string
}

export async function POST(req: Request) {
    try {
        const { sourceCode }: CompileRequest = await req.json()

        if (!sourceCode) {
            return NextResponse.json({ error: 'No source code provided' }, { status: 400 })
        }

        const input = {
            language: 'Solidity',
            sources: {
                'Contract.sol': {
                    content: sourceCode,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
            },
        }

        const output = JSON.parse(solc.compile(JSON.stringify(input)))

        if (output.errors) {
            const errors = output.errors.filter((err: any) => err.severity === 'error')
            if (errors.length > 0) {
                return NextResponse.json({
                    success: false,
                    errors: output.errors
                })
            }
        }

        // Extract the first contract found
        const contracts = output.contracts['Contract.sol']
        const contractName = Object.keys(contracts)[0]
        const contract = contracts[contractName]

        const bytecode = contract.evm.bytecode.object
        const abi = contract.abi

        // Calculate size in KB
        // Bytecode is hex string (2 hex chars = 1 byte)
        const sizeInBytes = bytecode.length / 2
        const sizeInKB = sizeInBytes / 1024

        return NextResponse.json({
            success: true,
            contractName,
            bytecode,
            abi,
            sizeInBytes,
            sizeInKB,
            gasEstimates: contract.evm.gasEstimates
        })

    } catch (error) {
        console.error('Compilation error:', error)
        return NextResponse.json({ error: 'Internal server error during compilation' }, { status: 500 })
    }
}
