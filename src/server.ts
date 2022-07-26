import {json} from 'express'
import { readFileSync } from 'fs'
import https, { createServer } from 'https'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Server as SocketServer } from 'socket.io'

import { container } from './dependency-injection/inversify.config'
import { InversifyExpressServer } from 'inversify-express-utils'

import {returnErrorMiddleware} from "./errors/error-handler";
import {allowedOrigins} from './config/allowedOrigins'

export default class Server {
    private server: InversifyExpressServer
    private readonly httpServer: https.Server
    private readonly port: string | number
    private readonly httpCredentials: object
    private readonly io: SocketServer

    constructor(port: string | number) {
        this.port = port
        this.server = new InversifyExpressServer(container, null, { rootPath: '/api' })

        // Web sockets
        this.io = new SocketServer()

        // Settings middlewares
        this.server.setConfig((app) => {
            app.set('io', this.io)
            app.use(json())
            app.use(cookieParser())

            app.use(cors({
                origin: allowedOrigins,
                credentials: true
            }))

            app.use((req, res, next) => {
                // Prevent XSS
                res.setHeader("Content-Security-Policy", "script-src 'none'")
                next()
            })

        })

        // Middlewares handle errors
        this.server.setErrorConfig((app) => {
            app.use(returnErrorMiddleware)
        })

        // HTTPS Credentials
        this.httpCredentials = {
            cert: readFileSync('security/cert.pem'),
            key: readFileSync('security/key.pem'),
        }

        // Create http server
        this.httpServer = createServer(this.httpCredentials, this.server.build())
    }

    listen() {
        this.httpServer.listen(this.port)
        this.io.listen(this.httpServer, { cors: { origin: allowedOrigins } })

        console.log(`Server is running on port ${ this.port }`)
    }

    stop() {
        this.httpServer?.close()
    }
}
