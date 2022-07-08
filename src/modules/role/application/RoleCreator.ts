import { injectable, inject } from "inversify";

import { TYPES } from "../../../dependency-injection/types";
import {BadRequestError} from "../../../errors/BadRequestError";
import {RoleRepository} from "../domain/RoleRepository";
import {Role} from "../domain/Role";
import {RoleValidator} from "../domain/RoleValidator";

@injectable()
export class RoleCreator {
    @inject(TYPES.RoleRepository) private repository: RoleRepository
    @inject(TYPES.RoleValidator) private validator: RoleValidator

    async create(role: Role) {
        const errors = this.validator.getMessageError(role)
        if(errors) {
            throw new BadRequestError({ message: errors })
        }
        return await this.repository.insert(role)
    }
}
