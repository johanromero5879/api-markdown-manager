import { MongoClient } from 'mongodb'
import * as redis from 'redis'

export const connectDB = async () => {
    await MongoClient.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
}

