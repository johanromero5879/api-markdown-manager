import { Router, Request, Response } from 'express'

import { container } from '../dependency-injection/inversify.config'
import {TYPES} from "../dependency-injection/types";
import {RolePostController} from "../modules/role/infraestructure/RolePostController";
import {RoleGetController} from "../modules/role/infraestructure/RoleGetController";

export const register = (router: Router) => {
    router.route('/roles')
        .post((req: Request, res: Response, next) => {
            container.get<RolePostController>(TYPES.RolePostController).create(req, res, next)
        })

    router.route('/roles/:name')
        .get((req: Request, res:Response, next) => {
            container.get<RoleGetController>(TYPES.RoleGetController).find(req, res, next)
        })

}
