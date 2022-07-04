import { Request, Response, NextFunction } from 'express'
import {inject, injectable} from "inversify";
import {BaseMiddleware} from "inversify-express-utils";

import {TYPES} from "../../../dependency-injection/types";
import {UnauthorizedError} from "../../../errors/UnauthorizedError";
import {JWTAdapter} from "../../shared/infrastructure/JWTAdapter";
import {ForbiddenError} from "../../../errors/ForbiddenError";
import {Session} from "./Session";

@injectable()
export class ValidatorTokenMiddleware extends BaseMiddleware {
    @inject(TYPES.JWTAdapter) private jwtAdapter: JWTAdapter

    handler(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.header('Authorization')
        const token = authHeader && authHeader.split(' ')[1]

        if(!token) {
            throw new UnauthorizedError({ message: 'Token no provided', onlyDev: true })
        }

        try {
            const payload = this.jwtAdapter.verifyAccessToken(token)
            this.httpContext.user = new Session(payload['user'])
            next()
        }catch(error) {
            throw new ForbiddenError({ message: error.message, onlyDev: true })
        }
    }
}
