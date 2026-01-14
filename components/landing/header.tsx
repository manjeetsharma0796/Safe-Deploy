'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
    return (
        <header className="absolute top-0 w-full z-50 h-20 flex items-center justify-between px-6 md:px-12 backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold tracking-tight">Safe Deploy</span>
            </Link>

            <Link href="/dashboard">
                <Button variant="ghost" className="font-medium hover:bg-primary/10 hover:text-primary">
                    Go to Dashboard
                </Button>
            </Link>
        </header>
    )
}
