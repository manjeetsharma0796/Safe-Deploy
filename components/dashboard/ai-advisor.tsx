'use client'
import { toast } from 'sonner'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Lightbulb, Info } from 'lucide-react'
import { useState, useEffect } from 'react'

interface AIAdvisorProps {
    code: string
}

export function AIAdvisor({ code }: AIAdvisorProps) {
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)



    useEffect(() => {
        const analyze = async () => {
            if (!code) return
            setLoading(true)
            const toastId = toast.loading('Consulting Gemini AI...')

            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code })
                })
                const data = await res.json()
                if (data.suggestions) {
                    setSuggestions(data.suggestions)
                    toast.success('AI Analysis Completed', { id: toastId })
                } else if (data.error) {
                    toast.error(`Analysis Failed: ${data.error}`, { id: toastId })
                }
            } catch (error) {
                console.error("Analysis failed", error)
                toast.error('Failed to reach AI service', { id: toastId })
            } finally {
                setLoading(false)
            }
        }

        // Debounce slightly to avoid spamming API on every keystroke if typing
        const timer = setTimeout(analyze, 1000)
        return () => clearTimeout(timer)
    }, [code])

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-sm">Gemini Flash Analysis</h4>
                    <p className="text-xs text-muted-foreground">AI-powered smart contract auditing</p>
                </div>
            </div>

            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="space-y-4 pb-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-40 space-y-4">
                            <div className="relative">
                                <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-xs text-muted-foreground animate-pulse">Consulting the oracle...</p>
                        </div>
                    ) : suggestions.length > 0 ? suggestions.map((s, i) => (
                        <div key={i} className="group p-4 bg-muted/30 border border-border/50 rounded-xl hover:border-indigo-500/50 hover:shadow-[0_0_15px_-5px_var(--primary)] transition-all duration-300">
                            <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-sm text-foreground group-hover:text-indigo-400 transition-colors">{s.title}</h5>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.impact === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    s.impact === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    }`}>
                                    {s.impact} Impact
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center p-4 border border-dashed border-border/50 rounded-xl">
                            <div className="h-10 w-10 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
                                <Lightbulb className="h-5 w-5 text-emerald-500" />
                            </div>
                            <p className="text-sm font-medium">No Issues Found</p>
                            <p className="text-xs text-muted-foreground mt-1">Gemini didn't detect any critical vulnerabilities.</p>
                        </div>
                    )}

                    <div className="px-4 py-3 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="text-xs text-muted-foreground flex items-start gap-2">
                            <Info className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                            <span>Powered by Google Gemini 1.5 Flash. AI can make mistakes, always verify.</span>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
