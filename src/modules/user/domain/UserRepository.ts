import {User} from "./User";

export interface UserRepository {
    findById(id: string): Promise<User>
    findAll(): Promise<User[]>
    insert(user: User): Promise<User>
    existsById(id: string): Promise<boolean>
}
