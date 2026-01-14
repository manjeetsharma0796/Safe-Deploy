import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=mantle&vs_currencies=usd', {
            next: { revalidate: 60 } // Cache for 60 seconds
        })

        if (!res.ok) {
            throw new Error(`Coingecko API failed: ${res.status}`)
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Price fetch error:', error)
        // Return a fallback or 500
        // Fallback static price to prevent UI breakage if API is rate limited
        return NextResponse.json({ mantle: { usd: 0.85 } })
    }
}
