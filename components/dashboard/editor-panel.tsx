'use client'

import Editor from '@monaco-editor/react'
import { Loader2 } from 'lucide-react'

interface EditorPanelProps {
    code: string
    onChange: (value: string | undefined) => void
}

export function EditorPanel({ code, onChange }: EditorPanelProps) {
    return (
        <div className="h-full w-full rounded-md border border-border/50 overflow-hidden bg-card/50 shadow-sm relative group">
            <div className="absolute top-2 right-4 z-10 opacity-50 text-xs font-mono">
                Solidity 0.8.x
            </div>
            <Editor
                height="100%"
                defaultLanguage="solidity"
                theme="vs-dark"
                value={code}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    fontFamily: "'Geist Mono', monospace",
                }}
                loading={
                    <div className="flex bg-background h-full w-full items-center justify-center text-muted-foreground">
                        <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading Editor...
                    </div>
                }
            />
        </div>
    )
}
