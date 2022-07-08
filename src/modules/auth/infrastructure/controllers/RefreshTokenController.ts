import {Request, Response, NextFunction} from 'express'
import {inject} from "inversify";
import {TYPES} from "../../../../dependency-injection/types";
import {
    controller,
    request,
    response,
    next,
    httpGet
} from 'inversify-express-utils'

import {clearCookies, createRefreshTokenCookie} from "../cookie-utils";
import {UnauthorizedError} from "../../../../errors/UnauthorizedError";
import {ForbiddenError} from "../../../../errors/ForbiddenError";
import {AuthToken} from "../../application/AuthToken";
import {JWTAdapter} from "../../../shared/infrastructure/JWTAdapter";
import {AuthUser} from "../../application/AuthUser";

@controller('/token')
export class RefreshTokenController {
    @inject(TYPES.AuthUser) private authUser: AuthUser
    @inject(TYPES.AuthToken) private authToken: AuthToken
    @inject(TYPES.JWTAdapter) private jwtAdapter: JWTAdapter

    @httpGet('/')
    async refresh(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            let refreshToken = req.cookies?.refresh_token
            if(!refreshToken) {
                throw new UnauthorizedError({ onlyDev: true })
            }

            clearCookies(res)

            // Decode JWT for getting data
            const payload = this.jwtAdapter.decode(refreshToken)

            // Check if token exists in db
            const tokenFound = await this.authToken.exists(payload['user_id'], refreshToken)

            // Refresh token reuse detected
            if(!tokenFound) {
                await this.authToken.removeAll(payload['user_id'])
                throw new ForbiddenError({ onlyDev: true })
            }

            // Remove old refresh token
            await this.authToken.remove(payload['user_id'], refreshToken)

            // Evaluate JWT
            this.jwtAdapter.verifyRefreshToken(refreshToken)

            // Check if user_id brings its user from db
            const user = await this.authUser.findById(payload['user_id'])

            const accessToken = this.jwtAdapter.createAccessToken({ user })
            refreshToken = this.jwtAdapter.createRefreshToken({ user_id: user._id })

            // Save new refresh token into db
            await this.authToken.save(user._id, refreshToken)

            createRefreshTokenCookie(res, refreshToken)
            res.json({ access_token: accessToken })
        }catch(error) {
            next(error)
        }
    }
}
