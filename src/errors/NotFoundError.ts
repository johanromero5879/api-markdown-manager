import {BaseError, ErrorOptions} from "./BaseError";

export class NotFoundError extends BaseError {
    constructor(options?: ErrorOptions) {
        super(options)
        this.name = 'Not Found'
        this.statusCode = 404
        this.isOperational = true
    }
}
