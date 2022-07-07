export interface TokenRepository {
    add(userId: string, token: string): Promise<void>
    getAll(userId: string): Promise<string[]>
    exists(userId: string, token: string): Promise<boolean>
    removeAll(userId: string): Promise<void>
    remove(userId: string, token: string): Promise<void>
}
