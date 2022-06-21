import {Role} from "./Role";

export interface RoleRepository {
    findById(id: string): Promise<Role>
    findByName(name: string): Promise<Role>
    findAll(): Promise<Role[]>
    insert(role: Role): Promise<Role>
}
