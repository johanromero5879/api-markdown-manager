export interface ErrorOptions {
    message?: string,
    onlyDev?: boolean
}

export abstract class BaseError extends Error{
    statusCode: number
    isOperational: boolean
    options: ErrorOptions

    protected constructor(options?: ErrorOptions) {
        super(options?.message)
        this.options = options
    }
}
