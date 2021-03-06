import {Role} from "./Role";

export interface RoleRepository {
    findById(id: string): Promise<Role>
    findByName(name: string): Promise<Role>
    findAll(): Promise<Role[]>
    insert(role: Role): Promise<Role>
    update(id: string, role: Role): Promise<Role>
    existsById(id: string): Promise<boolean>
}
