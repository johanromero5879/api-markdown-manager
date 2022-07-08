import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {TYPES} from "../../../dependency-injection/types";

import MongoRepository from "../../shared/infrastructure/MongoRepository";
import {UserRepository} from "../domain/UserRepository";
import {User} from "../domain/User";
import {RoleRepository} from "../../role/domain/RoleRepository";
import {NotFoundError} from "../../../errors/NotFoundError";
import {ConflictError} from "../../../errors/ConflictError";

@injectable()
export class MongoUserRepository extends MongoRepository implements UserRepository {
    @inject(TYPES.RoleRepository) private roleRepository: RoleRepository
    protected moduleName: string = 'users'

    async findAll(): Promise<User[]> {
        return await this.collection.aggregate([
            { $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role'
                } },
            { $unwind: '$role' },
            { $project: { password: 0, last_login: 0, 'role.max_session_inactivity': 0 } },
        ]).toArray() as User[]
    }

    async findById(id: string): Promise<User> {
        await this.validateID(id)

        // Looking up user with id given and their role attributes from roles collection
        const result = await this.collection.aggregate([
            { $match: { _id: new ObjectId(id) }},
            { $limit: 1 },
            { $lookup: {
                from: 'roles',
                localField: 'role',
                foreignField: '_id',
                as: 'role'
            } },
            { $unwind: '$role' },
            { $project: { password: 0, last_login: 0, 'role.max_session_inactivity': 0 } },
        ]).toArray()

        return result[0] as User
    }

    async insert(user: User): Promise<User> {
        await this.validateUsernameDuplicated(user.username)

        if(!await this.roleRepository.existsById(user.role)) {
            throw new NotFoundError({ message: `Role ID ${user.role} not found` })
        }

        user.role = new ObjectId(user.role)
        user._id = (await this.collection.insertOne(user)).insertedId

        delete user.password
        return user
    }

    async validateUsernameDuplicated(username: string, id = null) {
        const user = await this.collection.findOne({username}) as User

        if(user && user._id != id) {
            throw new ConflictError({ message: `Username ${username} already exists` })
        }
    }

    async existsById(id: string): Promise<boolean> {
        return !!(await this.findById(id))
    }
}
