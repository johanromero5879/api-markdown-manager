import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {RoleRepository} from "../domain/RoleRepository";
import {NotFoundError} from "../../../errors/NotFoundError";

@injectable()
export class RoleFinder {
    @inject(TYPES.RoleRepository) private repository: RoleRepository

    async findByName(name: string) {
        const role = await this.repository.findByName(name)

        if(!role) {
            throw new NotFoundError({ message: `Role ${name} not found` })
        }

        return role
    }

    async findById(id: string) {
        const role = await this.repository.findById(id)

        if(!role) {
            throw new NotFoundError({ message: `ID Role ${id} not found` })
        }

        return role
    }

    async findAll() {
        return await this.repository.findAll()
    }
}
