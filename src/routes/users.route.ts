import {Request, Response, Router} from "express";
import {Container} from "inversify";

import {TYPES} from "../dependency-injection/types";
import {UserPostController} from "../modules/user/infraesctucture/UserPostController";
import {UserGetController} from "../modules/user/infraesctucture/UserGetController";

export const register = (router: Router, container: Container) => {
    const postController = container.get<UserPostController>(TYPES.UserPostController)
    const getController = container.get<UserGetController>(TYPES.UserGetController)

    router.route('/users')
        .post((req: Request, res: Response, next) => postController.create(req, res, next))
        .get((req: Request, res: Response, next) => getController.findAll(req, res, next))

    router.route('/users/:id')
        .get((req: Request, res: Response, next) => getController.findById(req, res, next))
}
