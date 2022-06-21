export abstract class BaseError extends Error {
    statusCode: number
    isOperational: boolean

    protected constructor(name: string, statusCode: number, isOperational: boolean, message: string) {
        super(message)
        this.name = name
        this.statusCode = statusCode
        this.isOperational = isOperational
    }
}
