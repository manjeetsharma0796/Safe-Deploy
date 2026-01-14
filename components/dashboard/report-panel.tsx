'use client'
import { toast } from 'sonner'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Rocket, Activity, Zap, BrainCircuit, PlayCircle } from 'lucide-react'
import { HealthMonitor } from './health-monitor'
import { useCompile } from '@/hooks/use-compile'
import { CompilerOutput } from './compiler-output'
import { GasCard } from './gas-card'
import { AIAdvisor } from './ai-advisor'
import { useAccount, useSwitchChain, useWalletClient, usePublicClient } from 'wagmi'
import { mantleSepoliaTestnet } from 'wagmi/chains'

import { usePayForAnalysis } from '@/hooks/use-pay-for-analysis'
import { Coins, Loader2 } from 'lucide-react'
import { useEffect } from 'react'

interface ReportPanelProps {
    code: string
}

export function ReportPanel({ code }: ReportPanelProps) {
    const [activeTab, setActiveTab] = useState('status')
    const { mutate: compile, data: compileResult, isPending: isCompiling } = useCompile()
    const { isConnected, chain } = useAccount()
    const { switchChain } = useSwitchChain()

    // Payment Hook
    const { pay, isPending: isPaying, isConfirming, isConfirmed, hash: txHash, error: paymentError } = usePayForAnalysis()

    // Track processed transaction to prevent repeated tab switching via Effect
    const lastProcessedTx = useRef<string | null>(null)



    // Trigger analysis when payment is confirmed
    useEffect(() => {
        if (isConfirmed && txHash && txHash !== lastProcessedTx.current) {
            console.log("Payment Confirmed! Running Analysis...", txHash)
            toast.success('Payment Confirmed! Analysis Started.')
            compile(code)
            setActiveTab('status')
            lastProcessedTx.current = txHash
        }
    }, [isConfirmed, txHash, code, compile])

    // Handles click
    const handleAnalyzeClick = () => {
        if (!isConnected) return // Should be handled by UI state ideally
        pay()
    }

    const { data: walletClient } = useWalletClient()
    const publicClient = usePublicClient()
    const [isDeploying, setIsDeploying] = useState(false)

    const handleDeploy = async () => {
        if (!compileResult || !('abi' in compileResult) || !walletClient || !publicClient) return

        setIsDeploying(true)
        const toastId = toast.loading('Deploying Contract...')

        try {
            const bytecode = compileResult.bytecode.startsWith('0x') ? compileResult.bytecode : `0x${compileResult.bytecode}`

            const hash = await walletClient.deployContract({
                abi: compileResult.abi,
                bytecode: bytecode as `0x${string}`,
                chain: mantleSepoliaTestnet,
                account: walletClient.account
            })

            console.log("Deployment Tx:", hash)
            toast.loading(`Transaction Sent! Waiting for confirmation...`, { id: toastId })

            const receipt = await publicClient.waitForTransactionReceipt({ hash })

            if (receipt.status === 'success') {
                toast.success(`Contract Deployed! Address: ${receipt.contractAddress}`, { id: toastId, duration: 8000 })
                console.log("Deployed Address:", receipt.contractAddress)
            } else {
                toast.error('Deployment Failed: Transaction Reverted', { id: toastId })
            }
        } catch (error: any) {
            console.error("Deployment Error:", error)
            toast.error(`Deployment Failed: ${error.message || 'Unknown error'}`, { id: toastId })
        } finally {
            setIsDeploying(false)
        }
    }

    const bytecode = (compileResult && 'bytecode' in compileResult) ? compileResult.bytecode : ''

    const isProcessing = isCompiling || isPaying || isConfirming

    console.log("Button State Debug:", {
        isProcessing,
        isDeploying,
        isCompiling,
        isPaying,
        isConfirming,
        bytecodePresent: !!bytecode,
        isConnected,
        chainId: chain?.id
    })

    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm rounded-md border border-border/50 shadow-sm relative overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0 w-full">
                <div className="p-6 border-b border-border/50 flex flex-col gap-6 shrink-0 bg-muted/20">
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Pre-Flight Diagnostic
                            </h3>
                            <p className="text-sm text-muted-foreground">Detailed code analysis & cost preview</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => {
                                if (!isConnected) {
                                    alert("Please connect your wallet first.")
                                    return
                                }
                                if (chain?.id !== mantleSepoliaTestnet.id) {
                                    switchChain({ chainId: mantleSepoliaTestnet.id })
                                    return
                                }
                                pay()
                            }}
                            disabled={isProcessing}
                            variant={isConnected && chain?.id === mantleSepoliaTestnet.id ? "default" : "secondary"}
                            className={`h-10 px-6 font-bold shadow-lg transition-all cursor-pointer ${!isConnected || chain?.id !== mantleSepoliaTestnet.id ? 'opacity-100' : 'shadow-primary/20 hover:shadow-primary/40'}`}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isPaying ? 'Confirm Wallet...' : isConfirming ? 'Tx Pending...' : 'Analyzing...'}
                                </>
                            ) : !isConnected ? (
                                "Connect to Analyze"
                            ) : chain?.id !== mantleSepoliaTestnet.id ? (
                                "Switch to Sepolia"
                            ) : (
                                <>
                                    <Coins className="mr-2 h-4 w-4 text-amber-400" />
                                    Pay 1 GUARD to Analyze
                                </>
                            )}
                        </Button>
                        {paymentError && (
                            <div className="absolute top-full mt-2 right-0 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-500 max-w-[200px] z-50">
                                Error: {paymentError.message.slice(0, 100)}...
                            </div>
                        )}
                    </div>
                    <TabsList className="grid w-full grid-cols-3 h-12 bg-background/50 border border-border/50">
                        <TabsTrigger value="status" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-semibold">
                            Infrastructure
                        </TabsTrigger>
                        <TabsTrigger value="gas" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-semibold">
                            Gas Estimates
                        </TabsTrigger>
                        <TabsTrigger value="optimize" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-semibold">
                            AI Advisor
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <TabsContent value="status" className="space-y-6 m-0 h-full animate-in fade-in-50 duration-300">
                        <Card className="bg-gradient-to-br from-background/50 to-muted/20 border-border/50">
                            <CardHeader className="py-4 border-b border-border/20">
                                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Network Health</CardTitle>
                            </CardHeader>
                            <CardContent className="py-4">
                                <HealthMonitor />
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-background/50 to-muted/20 border-border/50 min-h-[300px]">
                            <CardHeader className="py-4 border-b border-border/20">
                                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Compiler Output</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <CompilerOutput result={compileResult || null} isLoading={isCompiling} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="gas" className="m-0 h-full animate-in fade-in-50 duration-300">
                        <Card className="bg-gradient-to-br from-background/50 to-muted/20 border-border/50 h-full">
                            <CardHeader className="py-4 border-b border-border/20">
                                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Deployment Cost Estimation</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {bytecode ? (
                                    <GasCard bytecode={bytecode} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                        <Zap className="h-12 w-12 mb-4 opacity-20" />
                                        <p>Run analysis to calculate gas costs.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="optimize" className="m-0 h-full animate-in fade-in-50 duration-300">
                        <Card className="bg-gradient-to-br from-background/50 to-muted/20 border-border/50 h-full">
                            <CardHeader className="py-4 border-b border-border/20">
                                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Optimization Suggestions</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {bytecode ? (
                                    <AIAdvisor code={code} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                        <BrainCircuit className="h-12 w-12 mb-4 opacity-20" />
                                        <p>Run analysis to generate AI suggestions.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>

            <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-md shrink-0 z-10">
                <Button
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 shadow-lg shadow-emerald-500/20"
                    size="lg"
                    onClick={handleDeploy}
                    disabled={!bytecode || !isConnected || isCompiling || isDeploying}
                >
                    {isDeploying ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Deploying to Sepolia...
                        </>
                    ) : (
                        <>
                            <Rocket className="mr-2 h-5 w-5" />
                            {isConnected ? (chain?.id === 5003 ? 'Deploy to Mantle Sepolia' : 'Switch Network') : 'Connect Wallet to Deploy'}
                        </>
                    )}
                </Button>
                {isConnected && (chain?.id !== 5003) && (
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => switchChain?.({ chainId: mantleSepoliaTestnet.id })}>
                        Switch to Mantle Sepolia
                    </Button>
                )}
            </div>
        </div>
    )
}
