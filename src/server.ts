import {json} from 'express'
import { readFileSync } from 'fs'
import https, { createServer } from 'https'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { container } from './dependency-injection/inversify.config'
import { InversifyExpressServer } from 'inversify-express-utils'

import {returnErrorMiddleware} from "./errors/error-handler";

export default class Server {
    private server: InversifyExpressServer
    private httpsServer: https.Server
    private readonly port: string | number
    private httpsCredentials: object

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

            app.get('/', (req, res) => res.send('Holiwis'))
        })

        // Middlewares handle errors
        this.server.setErrorConfig((app) => {
            app.use(returnErrorMiddleware)
        })

        // HTTPS Credentials
        this.httpsCredentials = {
            cert: readFileSync('security/cert.pem'),
            key: readFileSync('security/key.pem'),
        }
    }

    listen() {
        this.httpsServer = createServer(this.httpsCredentials, this.server.build())
        this.httpsServer.listen(this.port)
        console.log(`Server is running on port ${ this.port }`)
    }

    stop() {
        this.httpsServer?.close()
    }
}
