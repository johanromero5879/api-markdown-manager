import { sign, verify, decode } from 'jsonwebtoken'
import {injectable} from "inversify";

@injectable()
export class JWTAdapter {

    createAccessToken(payload: object) {
        return sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
    }

    createRefreshToken(payload: object) {
        return sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
    }

    verifyAccessToken(token: string) {
        return verify(token, process.env.ACCESS_TOKEN_SECRET)
    }

    verifyRefreshToken(token: string) {
        return verify(token, process.env.REFRESH_TOKEN_SECRET)
    }

    decode(token: string) {
        return decode(token)
    }
}
