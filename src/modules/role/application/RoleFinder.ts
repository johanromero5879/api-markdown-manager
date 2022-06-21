import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {RoleRepository} from "../domain/RoleRepository";
import NotFoundError from "../../../errors/NotFoundError";

@injectable()
export class RoleFinder {
    @inject(TYPES.RoleRepository) private repository: RoleRepository

    async findByName(name: string) {
        const role = await this.repository.getByName(name)

        if(!role) {
            throw new NotFoundError(`Role ${name} not found`)
        }

        return role
    }
}
