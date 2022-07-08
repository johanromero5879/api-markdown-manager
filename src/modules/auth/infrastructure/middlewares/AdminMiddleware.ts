import { Request, Response, NextFunction } from 'express'
import {injectable} from "inversify";

import {BaseMiddleware} from "inversify-express-utils";
import {UnauthorizedError} from "../../../../errors/UnauthorizedError";
import {ForbiddenError} from "../../../../errors/ForbiddenError";

@injectable()
export class AdminMiddleware extends BaseMiddleware {

    handler(req: Request, res: Response, next: NextFunction) {

        const userRole = req['user']?.role
        if(!userRole) {
            throw new UnauthorizedError({ onlyDev: true })
        }

        if(userRole.name.toLowerCase() !== 'administrator') {
            throw new ForbiddenError({ message: 'You must be administrator', onlyDev: true })
        }

        next()
    }
}
