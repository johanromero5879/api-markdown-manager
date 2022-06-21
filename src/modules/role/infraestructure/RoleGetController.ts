import {inject, injectable} from "inversify";
import {Response, Request} from "express";
import {RoleFinder} from "../application/RoleFinder";
import {TYPES} from "../../../dependency-injection/types";

@injectable()
export class RoleGetController {
    @inject(TYPES.RoleFinder) private roleFinder: RoleFinder

    async find(req: Request, res: Response, next) {
        try{
            const role = await this.roleFinder.findById(req.params.id)
            res.json(role)
        }catch (error) {
            next(error)
        }
    }

    async findAll(req: Request, res: Response, next) {
        try {
            const roles = await this.roleFinder.findAll()
            res.json(roles)
        }catch (error) {
            next(error)
        }
    }
}
