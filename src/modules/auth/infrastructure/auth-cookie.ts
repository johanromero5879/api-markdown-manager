import {Response} from "express";

export const createRefreshTokenCookie = (res: Response, refreshToken: string) => {
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    })
}

export const clearCookies = (res: Response) => {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
}
