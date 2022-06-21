import { Router, Request, Response } from 'express'

import { container } from '../dependency-injection/inversify.config'
import {TYPES} from "../dependency-injection/types";
import {RolePostController} from "../modules/role/infraestructure/RolePostController";
import {RoleGetController} from "../modules/role/infraestructure/RoleGetController";
import {RolePutController} from "../modules/role/infraestructure/RolePutController";

export const register = (router: Router) => {
    const postController = container.get<RolePostController>(TYPES.RolePostController)
    const getController = container.get<RoleGetController>(TYPES.RoleGetController)
    const putController = container.get<RolePutController>(TYPES.RolePutController)

    router.route('/roles')
        .post((req: Request, res: Response, next) => {
            postController.create(req, res, next)
        })
        .get((req: Request, res: Response, next) => {
            getController.findAll(req, res, next)
        })

    router.route('/roles/:id')
        .get((req: Request, res:Response, next) => {
            getController.find(req, res, next)
        })
        .put((req: Request, res: Response, next) => {
            putController.update(req, res, next)
        })
}
