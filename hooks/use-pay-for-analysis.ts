import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { GUARD_TOKEN_ADDRESS, ERC20_ABI, TREASURY_ADDRESS } from '@/lib/token-config'
import { useState } from 'react'

import { toast } from 'sonner'

export function usePayForAnalysis() {
    const { writeContract, data: hash, isPending, error } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    const pay = () => {
        console.log("Initiating payment to:", GUARD_TOKEN_ADDRESS)
        const toastId = toast.loading('Initiating Transaction...')
        try {
            writeContract({
                address: GUARD_TOKEN_ADDRESS as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'transfer',
                args: [TREASURY_ADDRESS as `0x${string}`, parseEther('1')], // 1 Token
            }, {
                onError: (err) => {
                    console.error("WriteContract Error:", err)
                    toast.error(`Transaction Failed: ${err.message}`, { id: toastId })
                },
                onSuccess: (tx) => {
                    console.log("Transaction sent:", tx)
                    toast.success('Transaction Sent! Waiting for confirmation...', { id: toastId })
                }
            })
        } catch (e) {
            console.error("Payment Hook Error:", e)
            toast.error('Failed to initiate transaction', { id: toastId })
        }
    }

    return {
        pay: () => {
            if (!writeContract) {
                console.error("writeContract is not defined. Are you connected?")
                return
            }
            pay()
        },
        isPending,
        isConfirming,
        isConfirmed,
        error,
        hash
    }
}
