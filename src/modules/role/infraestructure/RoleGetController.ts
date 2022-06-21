import {inject, injectable} from "inversify";
import {Response, Request} from "express";
import {RoleFinder} from "../application/RoleFinder";
import {TYPES} from "../../../dependency-injection/types";

@injectable()
export class RoleGetController {
    @inject(TYPES.RoleFinder) private roleFinder: RoleFinder

    async find(req: Request, res: Response, next) {
        try{
            const name = req.params.name.replace(/-/g, ' ')
            const role = await this.roleFinder.findByName(name)
            res.json(role)
        }catch (error) {
            next(error)
        }
    }
}
