import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";
import {UserRepository} from "../domain/UserRepository";
import {User} from "../domain/User";
import Validator from "../../shared/domain/Validator";
import BadRequestError from "../../../errors/BadRequestError";
import {BcryptAdapter} from "../../shared/application/BcryptAdapter";

@injectable()
export class UserCreator {
    @inject(TYPES.UserRepository) private repository: UserRepository
    @inject(TYPES.UserValidator) private validator: Validator
    @inject(TYPES.BcryptAdapter) private bcryptAdapter: BcryptAdapter

    async create(user: User) {
        const errors = this.validator.getMessageError(user)
        if(errors) {
            throw new BadRequestError({ message: errors })
        }
        user.password = this.bcryptAdapter.hash(user.password)
        return await this.repository.insert(user)
    }
}
