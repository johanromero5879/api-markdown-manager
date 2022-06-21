import { Router, Request, Response } from 'express'

import { container } from '../dependency-injection/inversify.config'
import {TYPES} from "../dependency-injection/types";
import {RolePostController} from "../modules/role/infraestructure/RolePostController";

export const register = (router: Router) => {
    router.route('/role')
        .post((req: Request, res: Response, next) => {
            container.get<RolePostController>(TYPES.RolePostController).create(req, res, next)
        })
}
