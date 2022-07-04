import {BaseError, ErrorOptions} from "./BaseError";

export class UnauthorizedError extends BaseError {
    constructor(options?: ErrorOptions) {
        super(options)
        this.name = 'Unauthorized'
        this.statusCode = 401
        this.isOperational = true
    }
}
