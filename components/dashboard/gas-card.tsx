'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useConfig } from 'wagmi'
import { getPublicClient } from '@wagmi/core'
import { formatEther } from 'viem'
import { useMantlePrice } from '@/hooks/use-mantle-price'
import { Loader2, Fuel } from 'lucide-react'

interface GasCardProps {
    bytecode: string
}

export function GasCard({ bytecode }: GasCardProps) {
    const [estimatedGas, setEstimatedGas] = useState<bigint | null>(null)
    const [gasPrice, setGasPrice] = useState<bigint | null>(null)
    const [loading, setLoading] = useState(false)

    const config = useConfig()
    const { data: mntPrice } = useMantlePrice()

    useEffect(() => {
        async function estimate() {
            if (!bytecode) return
            setLoading(true)
            try {
                const client = getPublicClient(config)
                if (!client) return

                const price = await client.getGasPrice()
                setGasPrice(price)

                const formattedBytecode = bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`

                const gas = await client.estimateGas({
                    account: '0x0000000000000000000000000000000000000000',
                    data: formattedBytecode as `0x${string}`
                })
                setEstimatedGas(gas)
            } catch (err) {
                console.error("Gas estimation failed", err)
            } finally {
                setLoading(false)
            }
        }

        estimate()
    }, [bytecode, config])

    if (!bytecode) return null

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">Calculating deployment costs...</p>
            </div>
        )
    }

    if (!estimatedGas || !gasPrice) {
        return <div className="text-sm text-destructive p-4 text-center bg-destructive/10 rounded-md">Could not estimate gas. Ensure code is valid.</div>
    }

    const totalCostWei = estimatedGas * gasPrice
    const totalCostMnt = formatEther(totalCostWei)
    const totalCostUsd = mntPrice ? (parseFloat(totalCostMnt) * mntPrice).toFixed(4) : "0.00"

    // Simple visual scaling: assume 1M gas is "high" for a simple contract
    const gasUsagePercentage = Math.min((Number(estimatedGas) / 3000000) * 100, 100)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-xl border border-border/50 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Fuel className="h-12 w-12" />
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Estimated Cost (MNT)</div>
                    <div className="text-2xl font-mono font-bold text-foreground z-10">
                        {parseFloat(totalCostMnt).toFixed(6)} <span className="text-base font-sans text-muted-foreground">MNT</span>
                    </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl border border-border/50 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-4xl font-bold">$</span>
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Estimated Cost (USD)</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400 z-10">
                        ${totalCostUsd}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Gas Usage: <span className="text-foreground font-mono">{estimatedGas.toString()}</span> units</span>
                    <span>Limit: 30M</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${gasUsagePercentage > 80 ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${gasUsagePercentage}%` }}
                    />
                </div>
                <div className="text-xs text-center text-muted-foreground pt-1">
                    Current Gas Price: <span className="text-amber-400 font-mono">{formatEther(gasPrice, "gwei")} Gwei</span>
                </div>
            </div>
        </div>
    )
}
