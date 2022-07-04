import { sign, verify } from 'jsonwebtoken'
import {injectable} from "inversify";

@injectable()
export class JWTAdapter {

    private createToken(payload: object, secret: string, expiresIn: string | number) {
        return sign(payload, secret, { expiresIn })
    }

    private verifyToken(token: string, secret: string) {
        return verify(token, secret)
    }

    createAccessToken(payload: object) {
        return this.createToken(payload, process.env.ACCESS_TOKEN_SECRET, '30s')
    }

    createRefreshToken(payload: object) {
        return this.createToken(payload, process.env.REFRESH_TOKEN_SECRET, '2m')
    }

    verifyAccessToken(token: string) {
        return this.verifyToken(token, process.env.ACCESS_TOKEN_SECRET)
    }

    verifyRefreshToken(token: string) {
        return this.verifyToken(token, process.env.REFRESH_TOKEN_SECRET)
    }
}
