import {Request, Response, NextFunction} from 'express'
import {
    controller,
    httpPost,
    request,
    response,
    next,
    httpGet,
    BaseHttpController
} from 'inversify-express-utils'
import {inject} from "inversify";

import {TYPES} from "../../../../dependency-injection/types";
import {AuthUser} from "../../application/AuthUser";
import {JWTAdapter} from "../../../shared/infrastructure/JWTAdapter";
import {AuthToken} from "../../application/AuthToken";
import { createRefreshTokenCookie, clearCookies } from '../auth-cookie'

@controller('/auth')
export class AuthController extends BaseHttpController {
    @inject(TYPES.AuthUser) private authUser: AuthUser
    @inject(TYPES.AuthToken) private authToken: AuthToken
    @inject(TYPES.JWTAdapter) private jwtAdapter: JWTAdapter

    @httpPost('/')
    async login(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const user = await this.authUser.validate(req.body)

            const refreshToken = this.jwtAdapter.createRefreshToken({user_id: user._id})
            const accessToken = this.jwtAdapter.createAccessToken({ user })

            // Detect token reuse if there is a cookie
            if(req.cookies?.refresh_token) {
                const tokenFound = await this.authToken.exists(user._id, req.cookies?.refresh_token)

                // Refresh token reuse detected
                if(!tokenFound) {
                    console.log('Reuse detected')
                    await this.authToken.removeAll(user._id)
                    clearCookies(res)
                }
            }
            // Save refreshToken in db
            await this.authToken.save(user._id, refreshToken)

            createRefreshTokenCookie(res, refreshToken)
            res.status(201).json({ access_token: accessToken })
        }catch(error) {
            next(error)
        }
    }

    @httpGet('/user', TYPES.TokenMiddleware)
    async getUser(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const user = this.httpContext.user.details
            res.json(user)
        }catch(error) {
            next(error)
        }
    }
}
