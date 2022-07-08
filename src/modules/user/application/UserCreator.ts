import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {UserRepository} from "../domain/UserRepository";
import {User} from "../domain/User";
import Validator from "../../shared/domain/Validator";
import {BadRequestError} from "../../../errors/BadRequestError";
import {BcryptAdapter} from "../../shared/application/BcryptAdapter";
import {RoleRepository} from "../../role/domain/RoleRepository";

@injectable()
export class UserCreator {
    @inject(TYPES.UserRepository) private repository: UserRepository
    @inject(TYPES.RoleRepository) private roleRepository: RoleRepository
    @inject(TYPES.UserValidator) private validator: Validator
    @inject(TYPES.BcryptAdapter) private bcryptAdapter: BcryptAdapter

    async create(user: User) {
        const errors = this.validator.getMessageError(user)
        if(errors) {
            throw new BadRequestError({ message: errors })
        }

        // Search user by default and set its id in user.role
        const role = await this.roleRepository.findByName('user')
        user.role = role._id

        user.password = this.bcryptAdapter.hash(user.password)

        return await this.repository.insert(user)
    }
}
