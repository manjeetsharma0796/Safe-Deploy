'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ShieldCheck, Gift, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function Header() {
    const { address, isConnected } = useAccount()
    const [canClaim, setCanClaim] = useState(false)
    const [isClaiming, setIsClaiming] = useState(false)
    const [remainingTime, setRemainingTime] = useState<string>('')
    const [remainingMs, setRemainingMs] = useState(0)

    // Check claim status
    useEffect(() => {
        if (!address) {
            setCanClaim(false)
            return
        }

        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/claim?address=${address}`)
                const data = await res.json()
                setCanClaim(data.canClaim)
                setRemainingMs(data.remainingMs || 0)
            } catch (error) {
                console.error('Failed to check claim status:', error)
            }
        }

        checkStatus()
        const interval = setInterval(checkStatus, 30000) // Check every 30s
        return () => clearInterval(interval)
    }, [address])

    // Update countdown timer
    useEffect(() => {
        if (remainingMs <= 0) {
            setRemainingTime('')
            return
        }

        const interval = setInterval(() => {
            setRemainingMs(prev => {
                const newRemaining = prev - 1000

                if (newRemaining <= 0) {
                    setRemainingTime('Ready!')
                    setCanClaim(true)
                    return 0
                }

                const hours = Math.floor(newRemaining / (1000 * 60 * 60))
                const minutes = Math.floor((newRemaining % (1000 * 60 * 60)) / (1000 * 60))

                if (hours > 0) {
                    setRemainingTime(`${hours}h ${minutes}m`)
                } else if (minutes > 0) {
                    setRemainingTime(`${minutes}m`)
                } else {
                    setRemainingTime('<1m')
                }

                return newRemaining
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [remainingMs > 0]) // Only re-run when transitioning from 0 to positive or vice versa

    const handleClaim = async () => {
        if (!address || !canClaim || isClaiming) return

        setIsClaiming(true)
        const toastId = toast.loading('Claiming 20 GUARD tokens...')

        try {
            const res = await fetch('/api/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address })
            })

            const data = await res.json()

            if (data.success) {
                toast.success('20 GUARD tokens claimed successfully!', { id: toastId, duration: 5000 })
                setCanClaim(false)
                setRemainingMs(24 * 60 * 60 * 1000) // Reset to 24h
            } else {
                toast.error(`Claim failed: ${data.error}`, { id: toastId })
                if (data.remainingMs) {
                    setRemainingMs(data.remainingMs)
                }
            }
        } catch (error: any) {
            console.error('Claim error:', error)
            toast.error('Failed to claim tokens', { id: toastId })
        } finally {
            setIsClaiming(false)
        }
    }

    return (
        <div className="flex w-full items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                    Safe Deploy
                </h1>
            </Link>

            <div className="flex items-center gap-3">
                {isConnected && (
                    <Button
                        size="sm"
                        onClick={handleClaim}
                        disabled={!canClaim || isClaiming}
                        variant={canClaim ? "default" : "secondary"}
                        className="h-9 px-4 font-semibold shadow-md"
                    >
                        {isClaiming ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Claiming...
                            </>
                        ) : canClaim ? (
                            <>
                                <Gift className="mr-2 h-4 w-4" />
                                Claim 20 GUARD
                            </>
                        ) : (
                            <>
                                <Gift className="mr-2 h-4 w-4 opacity-50" />
                                {remainingTime || 'Claimed'}
                            </>
                        )}
                    </Button>
                )}
                <ConnectButton showBalance={false} />
            </div>
        </div>
    )
}
