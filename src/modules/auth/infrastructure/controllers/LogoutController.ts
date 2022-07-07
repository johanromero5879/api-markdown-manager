import {Request, Response, NextFunction} from 'express'
import {inject} from "inversify";
import {TYPES} from "../../../../dependency-injection/types";
import {
    controller,
    request,
    response,
    next,
    httpDelete,
    BaseHttpController
} from 'inversify-express-utils'

import {clearCookies} from "../auth-cookie";
import {AuthToken} from "../../application/AuthToken";
import {JWTAdapter} from "../../../shared/infrastructure/JWTAdapter";

@controller('/logout')
export class LogoutController extends BaseHttpController {
    @inject(TYPES.AuthToken) private authToken: AuthToken
    @inject(TYPES.JWTAdapter) private jwtAdapter: JWTAdapter

    @httpDelete('/')
    async logout(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        const refreshToken = req.cookies?.refresh_token

        if(refreshToken) {
            const payload = this.jwtAdapter.decode(refreshToken)
            // Remove refresh token from db
            await this.authToken.remove(payload['user_id'], refreshToken)
        }

        //Clear user in httpContext
        this.httpContext.user = null

        clearCookies(res)
        res.sendStatus(204)
    }
}
