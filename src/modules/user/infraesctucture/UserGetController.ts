import {injectable, inject} from "inversify";
import {Request, Response} from "express";

import {UserFinder} from "../application/UserFinder";
import {TYPES} from "../../../dependency-injection/types";

@injectable()
export class UserGetController {
    @inject(TYPES.UserFinder) private userFinder: UserFinder

    async findById(req: Request, res: Response, next) {
        try {
            const user = await this.userFinder.findById(req.params.id)
            res.json(user)
        }catch(error) {
            next(error)
        }
    }
}
