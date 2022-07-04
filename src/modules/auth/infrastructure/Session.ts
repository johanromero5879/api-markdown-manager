import { interfaces } from 'inversify-express-utils'

export class Session implements interfaces.Principal {
    public details

    public constructor(details) {
        this.details = details
    }

    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public isResourceOwner(resourceId: unknown): Promise<boolean> {
        return Promise.resolve(resourceId === 1111);
    }

    public isInRole(role: string): Promise<boolean> {
        return Promise.resolve(role === "admin");
    }
}
