import express, {json, Router, Express, Response, Request} from 'express'
import http from 'http'

import {registerRoutes} from "./routes";
import {logErrorMiddleware, returnError} from "./errors/error-handler";

export default class Server {
    private express: Express
    private router: Router
    private httpServer: http.Server

    constructor(port: string) {
        // Settings
        this.express = express()
        this.router = Router()

        this.express.set('port', port)

        // Routes
        this.express.use(json())
        this.express.use('/api', this.router)

        this.setupRoutes()

        // Middlewares handle errors
        this.express.use(logErrorMiddleware )
        this.express.use(returnError)
    }

    private setupRoutes() {
        registerRoutes(this.router)

        this.express.get('/api', (req: Request, res: Response) => {
            res.send("Markdown manager API")
        })

    }

    async listen() {
        this.httpServer = await this.express.listen(this.express.get('port'))
        console.log(`Server is running on port ${ this.express.get('port') }`)
    }

    stop() {
        this.httpServer?.close()
    }
}
