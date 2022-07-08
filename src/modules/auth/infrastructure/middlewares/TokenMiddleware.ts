import { Request, Response, NextFunction } from 'express'
import {inject, injectable} from "inversify";
import {BaseMiddleware} from "inversify-express-utils";

import {TYPES} from "../../../../dependency-injection/types";
import {UnauthorizedError} from "../../../../errors/UnauthorizedError";
import {JWTAdapter} from "../../../shared/infrastructure/JWTAdapter";
import {ForbiddenError} from "../../../../errors/ForbiddenError";

@injectable()
export class TokenMiddleware extends BaseMiddleware {
    @inject(TYPES.JWTAdapter) private jwtAdapter: JWTAdapter

    handler(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.header('authorization') || req.header('Authorization')
        if(!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedError({ onlyDev: true })
        }

        const token = authHeader && authHeader.split(' ')[1]

        // Verify if access token were sent in request
        if(!token) {
            throw new UnauthorizedError({ message: 'Token no provided', onlyDev: true })
        }

        try {
            const payload = this.jwtAdapter.verifyAccessToken(token)
            req['user'] = payload['user']
            next()
        }catch(error) {
            throw new ForbiddenError({ message: error.message, onlyDev: true })
        }
    }
}
