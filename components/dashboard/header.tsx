import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ShieldCheck } from 'lucide-react'

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b px-6 bg-sidebar/50 backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                    Mantle Deploy Guard
                </h1>
            </Link>

            <div className="flex items-center gap-4">
                <ConnectButton showBalance={false} />
            </div>
        </header>
    )
}
