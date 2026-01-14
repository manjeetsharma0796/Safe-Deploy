import 'dotenv/config'
import { MongoClient } from 'mongodb'

async function testConnection() {
    const uri = process.env.MONGODB_URI

    if (!uri) {
        console.log('❌ MONGODB_URI not found in .env')
        return
    }

    console.log('🔄 Connecting to MongoDB...')

    try {
        const client = new MongoClient(uri)
        await client.connect()

        // Ping the database
        await client.db().command({ ping: 1 })

        console.log('✅ MongoDB connection successful!')
        console.log('📦 Database: mantle-guard')

        // List collections if any
        const collections = await client.db().listCollections().toArray()
        console.log(`📁 Collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : '(none yet)'}`)

        await client.close()
    } catch (error: any) {
        console.log('❌ Connection failed:', error.message)
    }
}

testConnection()
