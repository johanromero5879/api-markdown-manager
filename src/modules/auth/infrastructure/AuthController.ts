import {Request, Response, NextFunction} from 'express'
import {
    controller,
    httpPost,
    request,
    response,
    next,
    httpGet,
    BaseHttpController,
    httpDelete
} from 'inversify-express-utils'
import {inject} from "inversify";

import {TYPES} from "../../../dependency-injection/types";
import {AuthLogin} from "../application/AuthLogin";
import {JWTAdapter} from "../../shared/infrastructure/JWTAdapter";
import {UnauthorizedError} from "../../../errors/UnauthorizedError";
import {ForbiddenError} from "../../../errors/ForbiddenError";
import RedisRepository from "../../shared/infrastructure/RedisRepository";

@controller('/auth')
export class AuthController extends BaseHttpController {
    @inject(TYPES.AuthLogin) private authLogin: AuthLogin
    @inject(TYPES.JWTAdapter) private jwtAdapter: JWTAdapter
    @inject(TYPES.RedisRepository) private redisRepository: RedisRepository

    @httpPost('/session')
    async login(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const user = await this.authLogin.login(req.body)

            const refreshToken = this.jwtAdapter.createRefreshToken({ user })
            const access_token = this.jwtAdapter.createAccessToken({ user })

            // save refreshToken in db
            //await this.redisRepository.set(user.username, refreshToken)

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 2 * 60 * 60 * 1000 // 2 hours
            })

            res.status(201).json({ access_token })
        }catch(error) {
            next(error)
        }
    }

    @httpGet('/session', TYPES.ValidatorTokenMiddleware)
    async getSession(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const user = this.httpContext.user.details
            res.json(user)
        }catch(error) {
            next(error)
        }
    }

    @httpDelete('/session')
    async logout(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        this.clearCookies(res)
        res.sendStatus(204)
    }

    @httpGet('/token')
    async createAccessToken(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const refreshToken = req.cookies?.refresh_token
            if(!refreshToken) {
                throw new UnauthorizedError({ onlyDev: true })
            }

            const payload = this.jwtAdapter.verifyRefreshToken(refreshToken)
            const access_token = this.jwtAdapter.createAccessToken({ user: payload['user'] })
            res.json({ access_token })
        }catch(error) {
            this.clearCookies(res)
            next(error)
        }
    }

    private clearCookies(res: Response) {
        res.clearCookie('refresh_token', {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production'
        })
    }
}
