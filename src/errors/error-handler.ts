import {BaseError} from "./BaseError";
import {Request, Response} from "express";

export const logError = (error) => {
    console.error(error.message)
}

export const logErrorMiddleware = (error, req, res, next) => {
    logError(error)
    next(error)
}

export const returnError = (error, req: Request, res: Response, next) => {
    res.status(error.statusCode || 500).send(error.message)
}

export const isOperationalError = (error) => {
    if(error instanceof BaseError) {
        return error.isOperational
    }
    return false
}
