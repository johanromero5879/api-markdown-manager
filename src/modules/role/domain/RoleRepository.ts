import {Role} from "./Role";

export interface RoleRepository {
    getById(id: string): Promise<Role>
    getByName(name: string): Promise<Role>
    insert(role: Role): Promise<Role>
}
