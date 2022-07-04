import {BaseError, ErrorOptions} from "./BaseError";

export class ForbiddenError extends BaseError {
    constructor(options?: ErrorOptions) {
        super(options)
        this.name = 'Forbidden'
        this.statusCode = 403
        this.isOperational = true
    }
}
