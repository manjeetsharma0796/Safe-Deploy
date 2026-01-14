import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable to preserve connection across HMR
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    // In production, create a new connection
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
    const client = await clientPromise
    return client.db('mantle-guard')
}
