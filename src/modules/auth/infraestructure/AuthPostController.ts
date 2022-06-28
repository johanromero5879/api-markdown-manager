import {Request, Response} from 'express'
import {inject, injectable} from "inversify";

@injectable()
export class AuthPostController {

    login(req: Request, res: Response, next) {
        try {
            res.json('login post')
        }catch(error) {
            next(error)
        }
    }
}
