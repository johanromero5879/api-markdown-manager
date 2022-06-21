import {Request, Response} from "express";
import {inject, injectable} from "inversify";

import { TYPES } from "../../../dependency-injection/types";
import {RoleCreator} from "../application/RoleCreator";

@injectable()
export class RolePostController {
    @inject(TYPES.RoleCreator) private roleCreator: RoleCreator

    async create(req: Request, res: Response, next) {
        try {
            const newType = await this.roleCreator.create(req.body)
            res.status(201).json(newType)
        }catch(error) {
            next(error)
        }
    }
}
