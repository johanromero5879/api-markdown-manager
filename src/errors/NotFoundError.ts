import {BaseError} from "./BaseError";

export default class NotFoundError extends BaseError {
    constructor(
        message: string,
        name = 'Not Found',
        statusCode = 404,
        isOperational = true
    ) {
        super(name, statusCode, isOperational, message)
    }
}
