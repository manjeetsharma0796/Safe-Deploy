'use client'

import { CompileResult } from '@/hooks/use-compile'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

interface CompilerOutputProps {
    result: CompileResult | null
    isLoading: boolean
}

const MAX_SIZE_KB = 24

export function CompilerOutput({ result, isLoading }: CompilerOutputProps) {
    if (isLoading) {
        return (
            <div className="text-center py-8 text-muted-foreground animate-pulse">
                Analyzing Solidity Code...
            </div>
        )
    }

    if (!result) {
        return (
            <div className="text-center py-8 text-muted-foreground text-sm">
                Click "Run Analysis" to compile and check code.
            </div>
        )
    }

    if ('errors' in result && result.success === false) {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-destructive font-medium text-sm">
                    <XCircle className="h-4 w-4" /> Compilation Failed
                </div>
                <ScrollArea className="h-[200px] w-full rounded-md border border-destructive/20 bg-destructive/10 p-4">
                    <pre className="text-xs font-mono text-destructive">
                        {result.errors.map((e: any) => e.formattedMessage).join('\n')}
                    </pre>
                </ScrollArea>
            </div>
        )
    }

    // Success case
    const { sizeInKB, contractName } = result as any // Casting for simplicity if TS complains
    const isSizeOk = sizeInKB <= MAX_SIZE_KB

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Target Contract</span>
                    <span className="font-mono font-medium text-primary">{contractName}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Bytecode Size</span>
                    <div className="flex items-center gap-2">
                        <span className={`font-mono text-sm ${isSizeOk ? 'text-foreground' : 'text-destructive'}`}>
                            {sizeInKB.toFixed(2)} KB
                        </span>
                        <Badge variant="outline" className={isSizeOk ? 'border-emerald-500/50 text-emerald-500' : 'border-destructive/50 text-destructive'}>
                            {isSizeOk ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                            {isSizeOk ? 'Pass' : 'Oversize'}
                        </Badge>
                    </div>
                </div>
            </div>

            {!isSizeOk && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-xs text-destructive flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                    Contract exceeds the 24KB Spurious Dragon limit. Enable optimization or refactor logic into libraries.
                </div>
            )}
        </div>
    )
}
