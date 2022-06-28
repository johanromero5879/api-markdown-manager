import {Router, Request, Response} from "express";

import {container} from "../dependency-injection/inversify.config";
import {TYPES} from "../dependency-injection/types";
import {AuthPostController} from "../modules/auth/infraestructure/AuthPostController";

export const register = (router: Router) => {
    const postController = container.get<AuthPostController>(TYPES.AuthPostController)
    router.post('/auth/login', (req: Request, res: Response, next) => postController.login(req, res, next))
}
