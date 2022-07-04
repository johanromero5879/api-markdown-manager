import {inject, injectable} from "inversify";
import {RoleRepository} from "../domain/RoleRepository";
import {TYPES} from "../../../dependency-injection/types";
import {Role} from "../domain/Role";
import Validator from "../../shared/domain/Validator";
import BadRequestError from "../../../errors/BadRequestError";

@injectable()
export class RoleUpdater {
    @inject(TYPES.RoleRepository) private repository: RoleRepository
    @inject(TYPES.RoleUpdatedValidator) private validator: Validator

    async update(id: string, role: Role) {
        const errors = this.validator.getMessageError(role)
        if(errors) {
            throw new BadRequestError({ message: errors })
        }
        return await this.repository.update(id, role)
    }
}
