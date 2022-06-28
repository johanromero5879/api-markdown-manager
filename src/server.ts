import express, {json, Router, Express, Response, Request} from 'express'
import http from 'http'

import { container } from './dependency-injection/inversify.config'
import {registerRoutes} from "./routes";
import {logErrorMiddleware, returnError} from "./errors/error-handler";

export default class Server {
    private app: Express
    private router: Router
    private httpServer: http.Server

    constructor(port: string) {
        // Settings
        this.app = express()
        this.router = Router()

        this.app.set('port', port)

        // Routes
        this.app.use(json())
        this.app.use('/api', this.router)

        this.setupRoutes()

        // Middlewares handle errors
        if(process.env.NODE_ENV === 'development') {
            this.app.use(logErrorMiddleware)
        }
        this.app.use(returnError)
    }

    private setupRoutes() {
        registerRoutes(this.router, container)

        this.app.get('/api', (req: Request, res: Response) => {
            res.send("Markdown manager API")
        })

    }

    async listen() {
        this.httpServer = await this.app.listen(this.app.get('port'))
        console.log(`Server is running on port ${ this.app.get('port') }`)
    }

    stop() {
        this.httpServer?.close()
    }
}
