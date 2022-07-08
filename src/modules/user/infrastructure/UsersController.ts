import {Request, Response, NextFunction} from 'express'
import {controller, httpPost, httpGet, request, response, next} from 'inversify-express-utils'
import {inject} from "inversify";

import {TYPES} from "../../../dependency-injection/types";
import {UserCreator} from "../application/UserCreator";
import {UserFinder} from "../application/UserFinder";

@controller('/users')
export class UsersController {
    @inject(TYPES.UserFinder) private userFinder: UserFinder
    @inject(TYPES.UserCreator) private userCreator: UserCreator

    @httpGet('/', TYPES.TokenMiddleware, TYPES.AdminMiddleware)
    async findAll(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const users = await this.userFinder.findAll()
            res.json(users)
        }catch (error) {
            next(error)
        }
    }

    @httpPost('/')
    async create(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const user = await this.userCreator.create(req.body)
            res.status(201).json(user)
        }catch(error) {
            next(error)
        }
    }

    @httpGet('/:id', TYPES.TokenMiddleware, TYPES.AdminMiddleware)
    async findById(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const user = await this.userFinder.findById(req.params.id)
            res.json(user)
        }catch(error) {
            next(error)
        }
    }

}
