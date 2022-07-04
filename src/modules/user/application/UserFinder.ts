import {injectable, inject} from "inversify";
import {TYPES} from "../../../dependency-injection/types";
import {UserRepository} from "../domain/UserRepository";
import NotFoundError from "../../../errors/NotFoundError";

@injectable()
export class UserFinder {
    @inject(TYPES.UserRepository) private repository: UserRepository

    async findAll() {
        return await this.repository.findAll()
    }

    async findById(id: string) {
        const user = await this.repository.findById(id)
        if(!user) {
            throw new NotFoundError({ message: `User ID ${id} not found` })
        }
        return user
    }
}
