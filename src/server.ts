import {json} from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { container } from './dependency-injection/inversify.config'
import { InversifyExpressServer } from 'inversify-express-utils'

import {returnErrorMiddleware} from "./errors/error-handler";

export default class Server {
    private server: InversifyExpressServer
    private httpServer: http.Server
    private readonly port: string | number

    constructor(port: string | number) {
        this.port = port
        this.server = new InversifyExpressServer(container, null, { rootPath: '/api' })

        // Settings middlewares
        this.server.setConfig((app) => {
            app.use(json())

            app.use(cookieParser())

            app.use(cors({
                credentials: true
            }))
        })

        // Middlewares handle errors
        this.server.setErrorConfig((app) => {
            app.use(returnErrorMiddleware)
        })
    }

    listen() {
        this.httpServer = this.server.build().listen(this.port)
        console.log(`Server is running on port ${ this.port }`)
    }

    stop() {
        this.httpServer?.close()
    }
}
