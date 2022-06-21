import {inject, injectable} from "inversify";
import {RoleRepository} from "../domain/RoleRepository";
import {TYPES} from "../../../dependency-injection/types";
import {Role} from "../domain/Role";
import {RoleValidator} from "../domain/RoleValidator";

@injectable()
export class RoleUpdater {
    @inject(TYPES.RoleRepository) private repository: RoleRepository
    @inject(TYPES.RoleValidator) private validator: RoleValidator

    async update(role: Role) {

        return role
    }
}
