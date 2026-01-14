import { useQuery } from '@tanstack/react-query'

const MANTLE_RPC = 'https://rpc.mantle.xyz'

export function useHealthCheck() {
    return useQuery({
        queryKey: ['health-check'],
        queryFn: async () => {
            const start = performance.now()
            try {
                const res = await fetch(MANTLE_RPC, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_blockNumber',
                        params: [],
                        id: 1,
                    }),
                })
                const end = performance.now()
                if (!res.ok) throw new Error('RPC Failed')
                return {
                    ok: true,
                    latency: Math.round(end - start),
                    status: 'Optimal'
                }
            } catch (error) {
                return {
                    ok: false,
                    latency: 0,
                    status: 'Offline'
                }
            }
        },
        refetchInterval: 10000, // Check every 10s
    })
}
