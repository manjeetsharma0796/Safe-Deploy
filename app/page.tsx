'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Zap, Activity, BrainCircuit, ArrowRight, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from '@/components/landing/header'

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors"
        >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </motion.div>
    )
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center text-center p-4">
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mb-3">
                {number}
            </div>
            <h3 className="font-medium mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background z-0" />
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                            Live on Mantle Sepolia
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
                            Deploy with <span className="text-emerald-500">Confidence</span> on Mantle
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            The ultimate pre-flight diagnostic dashboard for smart contract developers. Analyze gas costs, check infrastructure health, and optimize size before you deploy.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/dashboard">
                                <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-[0_0_30px_-5px_var(--primary)] hover:shadow-[0_0_30px_0px_var(--primary)] transition-shadow duration-300">
                                    Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="h-12 px-8" asChild>
                                <a href="https://docs.mantle.xyz" target="_blank" rel="noreferrer">Read Mantle Docs</a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Zap}
                            title="Gas Estimation"
                            description="Real-time deployment cost estimates in $MNT and USD based on live network conditions."
                        />
                        <FeatureCard
                            icon={Activity}
                            title="Infrastructure Check"
                            description="Monitor RPC node latency and connectivity to ensure a smooth deployment experience."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Size Analysis"
                            description="Verify your bytecode fits within the 24KB Spurious Dragon limit before transaction failure."
                        />
                        <FeatureCard
                            icon={BrainCircuit}
                            title="AI Advisor"
                            description="Automated static analysis to suggest gas-saving optimizations specific to Mantle OVM."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-muted/20 border-y border-border/50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[28px] left-[20%] right-[20%] h-[2px] bg-border/50 -z-10" />

                        <StepCard
                            number="1"
                            title="Connect Wallet"
                            description="Link your wallet to access Mantle Sepolia network."
                        />
                        <StepCard
                            number="2"
                            title="Pay with GUARD"
                            description="Use 1 GUARD Token to unlock the analysis engine."
                        />
                        <StepCard
                            number="3"
                            title="Analyze & Deploy"
                            description="Get your pre-flight report and deploy confidently."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-border/50 text-center text-muted-foreground text-sm">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="font-bold text-foreground">Mantle Deploy Guard</span>
                </div>
                <p>&copy; 2026 Mantle Hackathon Project. Built with Next.js, Wagmi & RainbowKit.</p>
            </footer>
        </div>
    )
}
