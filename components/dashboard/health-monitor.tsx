'use client'

import { Activity } from 'lucide-react'
import { useHealthCheck } from '@/hooks/use-health-check'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export function HealthMonitor() {
    const { data, isLoading } = useHealthCheck()

    if (isLoading) return <Skeleton className="h-10 w-full" />

    const latency = data?.latency || 0
    const isOptimal = data?.ok && latency < 200
    const isDegraded = data?.ok && latency >= 200

    return (
        <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                    {data?.ok && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOptimal ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${data?.ok ? (isOptimal ? 'bg-emerald-500' : 'bg-yellow-500') : 'bg-red-500'}`}></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold tracking-tight">Mantle Sepolia RPC</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Infrastructure Status</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <div className={`text-sm font-mono font-bold ${isOptimal ? 'text-emerald-500' : isDegraded ? 'text-yellow-500' : 'text-red-500'}`}>
                        {data?.ok ? `${latency} ms` : 'ERR'}
                    </div>
                </div>
                <Badge variant={isOptimal ? 'default' : 'secondary'} className={isOptimal ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/50' : data?.ok ? 'bg-yellow-500/15 text-yellow-500 border-yellow-500/50' : 'bg-red-500/15 text-red-500 border-red-500/50'}>
                    {data?.ok ? (isOptimal ? 'Healthy' : 'Degraded') : 'Down'}
                </Badge>
            </div>
        </div>
    )
}
