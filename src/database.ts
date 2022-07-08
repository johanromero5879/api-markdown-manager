import { MongoClient } from 'mongodb'

export const connectDB = async () => {
    await MongoClient.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
}

