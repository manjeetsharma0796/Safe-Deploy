import { useQuery } from '@tanstack/react-query'

export function useMantlePrice() {
    return useQuery({
        queryKey: ['mantle-price'],
        queryFn: async () => {
            try {
                const res = await fetch('/api/price')
                const data = await res.json()
                return data.mantle.usd as number
            } catch (error) {
                console.error('Failed to fetch MNT price', error)
                return null
            }
        },
        refetchInterval: 30000,
    })
}
