import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {TYPES} from "../../../dependency-injection/types";

import MongoRepository from "../../shared/infraestructure/MongoRepository";
import {UserRepository} from "../domain/UserRepository";
import {User} from "../domain/User";
import BadRequestError from "../../../errors/BadRequestError";
import {RoleRepository} from "../../role/domain/RoleRepository";
import NotFoundError from "../../../errors/NotFoundError";


@injectable()
export class MongoUserRepository extends MongoRepository implements UserRepository {
    @inject(TYPES.RoleRepository) private roleRepository: RoleRepository

    async findById(id: string): Promise<User> {
        await this.validateID(id)

        // Looking up user with id given and their role attributes from roles collection
        const result = await this.collection().aggregate([
            { $match: { _id: new ObjectId(id) }},
            { $limit: 1 },
            { $lookup: {
                from: 'roles',
                localField: 'role',
                foreignField: '_id',
                as: 'role'
            } },
            { $unwind: '$role' },
            { $project: { 'password': 0 } },
        ]).toArray()

        return result[0] as User
    }

    async insert(user: User): Promise<User> {
        await this.validateUsernameDuplicated(user.username)

        if(!await this.roleRepository.existsById(user.role)) {
            throw new NotFoundError(`Role ID ${user.role} not found`)
        }

        user.role = new ObjectId(user.role)
        user._id = (await this.collection().insertOne(user)).insertedId

        delete user.password
        return user
    }

    async validateUsernameDuplicated(username: string, id = null) {
        const user = await this.collection().findOne({username}) as User

        if(user && user._id != id) {
            throw new BadRequestError(`Username ${username} already exists`)
        }
    }

    protected moduleName(): string {
        return 'users'
    }

}
