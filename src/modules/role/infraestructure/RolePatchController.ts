import {Request, Response} from 'express'
import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";
import {RoleUpdater} from "../application/RoleUpdater";

@injectable()
export class RolePatchController {
    @inject(TYPES.RoleUpdater) private roleUpdater: RoleUpdater

    async update(req: Request, res: Response, next) {
        try {
            const role = await this.roleUpdater.update(req.params.id, req.body)
            res.json(role)
        }catch(error) {
            next(error)
        }
    }

}
