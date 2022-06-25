import {injectable, inject} from "inversify";
import {TYPES} from "../../../dependency-injection/types";
import {UserCreator} from "../application/UserCreator";
import {Request, Response} from "express";

@injectable()
export class UserPostController {
    @inject(TYPES.UserCreator) private userCreator: UserCreator

    async create(req: Request, res: Response, next) {
        try {
            const user = await this.userCreator.create(req.body)
            res.status(201).json(user)
        }catch(error) {
            next(error)
        }
    }
}
