import {injectable, inject} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {Credentials} from "../domain/Credentials";
import {AuthRepository} from "../domain/AuthRepository";
import Validator from "../../shared/domain/Validator";
import BadRequestError from "../../../errors/BadRequestError";
import {BcryptAdapter} from "../../shared/application/BcryptAdapter";
import NotFoundError from "../../../errors/NotFoundError";

@injectable()
export class AuthUser {
    @inject(TYPES.AuthRepository) private repository: AuthRepository
    @inject(TYPES.CredentialsValidator) private validator: Validator
    @inject(TYPES.BcryptAdapter) private bcryptAdapter: BcryptAdapter

    async validate(credentials: Credentials) {
        const errors = this.validator.getMessageError(credentials)
        if(errors) {
            throw new BadRequestError({ message: errors, onlyDev: true })
        }

        const user = await this.repository.findByUsername(credentials.username)
        if(!user) {
            throw new NotFoundError({ message: `Username ${credentials.username} not found`, onlyDev: true })
        }

        if(!this.bcryptAdapter.compare(credentials.password, user.password)){
            throw new NotFoundError({ message: 'Credentials are not valid', onlyDev: true})
        }

        delete user.password
        user._id = user._id.toString()

        return user
    }

    async findById(id: string) {
        const user = await this.repository.findById(id)
        if(!user) {
            throw new NotFoundError()
        }

        return user
    }
}
