import {BaseError, ErrorOptions} from "./BaseError";

export default class BadRequestError extends BaseError {
    constructor(options?: ErrorOptions) {
        super(options)
        this.name = 'Bad Request'
        this.statusCode = 400
        this.isOperational = true
    }
}
