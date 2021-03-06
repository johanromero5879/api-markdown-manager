import {Request, Response, NextFunction} from 'express'
import {
    controller,
    httpPost,
    httpGet,
    request,
    response,
    next,
    httpPatch
} from 'inversify-express-utils'
import {inject} from "inversify";

import {TYPES} from "../../../dependency-injection/types";
import {RoleFinder} from "../application/RoleFinder";
import {RoleCreator} from "../application/RoleCreator";
import {RoleUpdater} from "../application/RoleUpdater";

@controller('/roles', TYPES.TokenMiddleware, TYPES.AdminMiddleware)
export class RolesController {
    @inject(TYPES.RoleFinder) private roleFinder: RoleFinder
    @inject(TYPES.RoleCreator) private roleCreator: RoleCreator
    @inject(TYPES.RoleUpdater) private roleUpdater: RoleUpdater

    @httpGet('/')
    async findAll(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const roles = await this.roleFinder.findAll()
            res.json(roles)
        }catch (error) {
            next(error)
        }
    }

    @httpPost('/')
    async create(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const newType = await this.roleCreator.create(req.body)
            res.status(201).json(newType)
        }catch(error) {
            next(error)
        }
    }

    @httpPatch('/')
    async update(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const role = await this.roleUpdater.update(req.params.id, req.body)
            res.json(role)
        }catch(error) {
            next(error)
        }
    }

    @httpGet('/:id')
    async find(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            const role = await this.roleFinder.findById(req.params.id)
            res.json(role)
        }catch (error) {
            next(error)
        }
    }
}
