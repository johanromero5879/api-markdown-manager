import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";
import {UserRepository} from "../domain/UserRepository";
import {User} from "../domain/User";
import Validator from "../../shared/domain/Validator";
import BadRequestError from "../../../errors/BadRequestError";

@injectable()
export class UserCreator {
    @inject(TYPES.UserRepository) private repository: UserRepository
    @inject(TYPES.UserValidator) private validator: Validator

    async create(user: User) {
        const errors = this.validator.getMessageError(user)
        if(errors) {
            throw new BadRequestError(errors)
        }
        return await this.repository.insert(user)
    }
}
