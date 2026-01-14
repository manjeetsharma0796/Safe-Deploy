import { NextResponse } from 'next/server'
import { createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mantleSepoliaTestnet } from 'wagmi/chains'
import { GUARD_TOKEN_ADDRESS, ERC20_ABI } from '@/lib/token-config'
import fs from 'fs'
import path from 'path'

const CLAIM_AMOUNT = '20' // 20 GUARD tokens
const COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const STORAGE_PATH = path.join(process.cwd(), 'data', 'claim-storage.json')

// Treasury wallet setup
const getTreasuryWallet = () => {
    if (!process.env.TREASURY_PRIVATE_KEY) {
        throw new Error('TREASURY_PRIVATE_KEY not configured')
    }

    // Ensure private key has 0x prefix
    let privateKey = process.env.TREASURY_PRIVATE_KEY
    if (!privateKey.startsWith('0x')) {
        privateKey = `0x${privateKey}`
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`)
    return createWalletClient({
        account,
        chain: mantleSepoliaTestnet,
        transport: http()
    })
}

// Read/Write claim storage
const readClaimData = (): Record<string, string> => {
    try {
        const data = fs.readFileSync(STORAGE_PATH, 'utf-8')
        return JSON.parse(data)
    } catch {
        return {}
    }
}

const writeClaimData = (data: Record<string, string>) => {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(data, null, 2))
}

export async function POST(req: Request) {
    try {
        const { address } = await req.json()

        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 })
        }

        // Normalize address
        const userAddress = address.toLowerCase()

        // Check cooldown
        const claimData = readClaimData()
        const lastClaimTime = claimData[userAddress]

        if (lastClaimTime) {
            const timeSinceLastClaim = Date.now() - new Date(lastClaimTime).getTime()
            if (timeSinceLastClaim < COOLDOWN_MS) {
                const remainingTime = COOLDOWN_MS - timeSinceLastClaim
                const nextClaimDate = new Date(Date.now() + remainingTime)

                return NextResponse.json({
                    success: false,
                    error: 'Cooldown active',
                    remainingMs: remainingTime,
                    nextClaimTime: nextClaimDate.toISOString()
                }, { status: 429 })
            }
        }

        // Transfer tokens from treasury
        const treasuryWallet = getTreasuryWallet()

        const hash = await treasuryWallet.writeContract({
            address: GUARD_TOKEN_ADDRESS as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'transfer',
            args: [address as `0x${string}`, parseEther(CLAIM_AMOUNT)]
        })

        // Update claim timestamp
        claimData[userAddress] = new Date().toISOString()
        writeClaimData(claimData)

        return NextResponse.json({
            success: true,
            txHash: hash,
            amount: CLAIM_AMOUNT,
            nextClaimTime: new Date(Date.now() + COOLDOWN_MS).toISOString()
        })

    } catch (error: any) {
        console.error('Claim error:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Claim failed'
        }, { status: 500 })
    }
}

// GET endpoint to check claim status
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const address = searchParams.get('address')

        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 })
        }

        const userAddress = address.toLowerCase()
        const claimData = readClaimData()
        const lastClaimTime = claimData[userAddress]

        if (!lastClaimTime) {
            return NextResponse.json({
                canClaim: true,
                remainingMs: 0
            })
        }

        const timeSinceLastClaim = Date.now() - new Date(lastClaimTime).getTime()
        const canClaim = timeSinceLastClaim >= COOLDOWN_MS

        return NextResponse.json({
            canClaim,
            lastClaimTime,
            remainingMs: canClaim ? 0 : COOLDOWN_MS - timeSinceLastClaim,
            nextClaimTime: new Date(new Date(lastClaimTime).getTime() + COOLDOWN_MS).toISOString()
        })

    } catch (error: any) {
        console.error('Status check error:', error)
        return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
    }
}
