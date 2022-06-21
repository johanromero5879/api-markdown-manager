import { config } from 'dotenv'
config() // Setup environment variables

import { connectDB } from './database'
import Server from './server'
import { logError, isOperationalError } from './errors/error-handler'

const start = async () => {
    try{
        await connectDB()
        await new Server(process.env.PORT || '3000').listen()
    }catch (e) {
        logError(e)
    }
}

process.on('unhandledRejection', error => {
    throw error
})

process.on('uncaughtException', error => {
    logError(error)
    if(!isOperationalError(error)) {
        process.exit(1)
    }
})

start()

