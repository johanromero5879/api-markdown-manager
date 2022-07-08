import { config } from 'dotenv'
config() // Setup environment variables

import { connectDB } from './database'
import Server from './server'
import { logError, isOperationalError } from './errors/error-handler'
import { createRoles } from './initialSetup'

const start = async () => {
    // Connect to db
    await connectDB()

    // Initial setup
    await createRoles()

    // Start server
    const server = new Server(process.env.PORT || 3000)
    server.listen()
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


