import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export interface Contract {
    _id?: string
    userAddress: string
    name: string
    code: string
    deployedAddress?: string
    network: string
    createdAt: Date
    updatedAt: Date
}

// GET - Fetch user's contracts
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const address = searchParams.get('address')

        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 })
        }

        const db = await getDatabase()
        const contracts = await db
            .collection('contracts')
            .find({ userAddress: address.toLowerCase() })
            .sort({ updatedAt: -1 })
            .toArray()

        return NextResponse.json({ contracts })
    } catch (error: any) {
        console.error('Get contracts error:', error)
        return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 })
    }
}

// POST - Save a new contract
export async function POST(req: Request) {
    try {
        const { userAddress, name, code, deployedAddress, network } = await req.json()

        if (!userAddress || !name || !code) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const db = await getDatabase()

        const contract: Contract = {
            userAddress: userAddress.toLowerCase(),
            name,
            code,
            deployedAddress,
            network: network || 'sepolia',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await db.collection('contracts').insertOne(contract)

        return NextResponse.json({
            success: true,
            contractId: result.insertedId.toString()
        })
    } catch (error: any) {
        console.error('Save contract error:', error)
        return NextResponse.json({ error: 'Failed to save contract' }, { status: 500 })
    }
}

// DELETE - Remove a contract
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        const address = searchParams.get('address')

        if (!id || !address) {
            return NextResponse.json({ error: 'ID and address required' }, { status: 400 })
        }

        const db = await getDatabase()

        // Only allow deletion by owner
        const result = await db.collection('contracts').deleteOne({
            _id: new ObjectId(id),
            userAddress: address.toLowerCase()
        })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Delete contract error:', error)
        return NextResponse.json({ error: 'Failed to delete contract' }, { status: 500 })
    }
}
