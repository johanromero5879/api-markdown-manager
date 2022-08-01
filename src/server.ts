import {json} from 'express'
import http, { createServer } from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Server as SocketServer } from 'socket.io'

import { container } from './dependency-injection/inversify.config'
import { InversifyExpressServer } from 'inversify-express-utils'

import {returnErrorMiddleware} from "./errors/error-handler";
import {allowedOrigins} from './config/allowedOrigins'

export default class Server {
    private server: InversifyExpressServer
    private readonly httpServer: http.Server
    private readonly port: string | number
    private readonly io: SocketServer

    constructor(port: string | number) {
        this.port = port
        this.server = new InversifyExpressServer(container, null, { rootPath: '/api' })

        // Cors options
        let corsOptions = {}
        if(process.env.NODE_ENV !== 'production') {
            corsOptions = {
                origin: allowedOrigins,
                credentials: true
            }
        }

        // Settings middlewares
        this.server.setConfig((app) => {
            app.set('io', this.io)
            app.use(json())
            app.use(cookieParser())

            app.use(cors(corsOptions))

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

        // Create http server
        this.httpServer = createServer(this.server.build())
        // Web sockets
        this.io = new SocketServer(this.httpServer, { cors: corsOptions })
    }

    listen() {
        this.httpServer.listen(this.port)
        console.log(`Server is running on port ${ this.port }`)
    }

    stop() {
        this.httpServer?.close()
    }
}
