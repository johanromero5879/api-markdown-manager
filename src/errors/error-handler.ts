import {BaseError} from "./BaseError";
import {NextFunction, Request, Response} from "express";
import {NotFoundError} from "./NotFoundError";

export const logError = (error) => {
    if(error.message) {
        console.error(error.message)
    }
}

export const returnErrorMiddleware = (error, req: Request, res: Response, next: NextFunction) => {
    if(process.env.NODE_ENV !== 'production') {
        logError(error)
    }

    if(process.env.NODE_ENV === 'production' && error.onlyDev) {
        error = new NotFoundError({ message: 'Resource not found' })
    }

    const statusCode = error.statusCode || 500
    if(error.message) {
        res.status(statusCode).send(error.message)
    }else{
        res.sendStatus(statusCode)
    }
}

export const isOperationalError = (error) => {
    if(error instanceof BaseError) {
        return error.isOperational
    }
    return false
}
