import { useMutation } from '@tanstack/react-query'

export type CompileResult = {
    success: true
    contractName: string
    bytecode: string
    abi: any[]
    sizeInBytes: number
    sizeInKB: number
    gasEstimates: any
} | {
    success: false
    errors: any[]
}

export function useCompile() {
    return useMutation({
        mutationFn: async (sourceCode: string) => {
            const res = await fetch('/api/compile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sourceCode }),
            })
            const data = await res.json()
            return data as CompileResult
        },
    })
}
