import {BaseError, ErrorOptions} from "./BaseError";

export class ConflictError extends BaseError {
    constructor(options?: ErrorOptions) {
        super(options)
        this.name = 'Conflict'
        this.statusCode = 409
        this.isOperational = true
    }
}
