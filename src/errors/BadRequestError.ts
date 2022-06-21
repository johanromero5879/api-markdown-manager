import {BaseError} from "./BaseError";

export default class BadRequestError extends BaseError {
    constructor(
        message: string,
        name = 'Bad Request',
        statusCode = 400,
        isOperational = true
    ) {
        super(name, statusCode, isOperational, message)
    }
}
