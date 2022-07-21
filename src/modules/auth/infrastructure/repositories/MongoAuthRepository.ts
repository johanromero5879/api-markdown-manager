import {injectable} from "inversify";
import MongoRepository from "../../../shared/infrastructure/MongoRepository";
import {AuthRepository} from "../../domain/AuthRepository";
import {User} from "../../../user/domain/User";
import {ObjectId} from "mongodb";

@injectable()
export class MongoAuthRepository extends MongoRepository<User> implements AuthRepository{
    protected moduleName: string = 'users'

    async findByUsername(username: string): Promise<User> {
        const result = await this.collection.aggregate([
            { $match: { username } },
            { $limit: 1 },
            { $lookup: { from: 'roles', localField: 'role', foreignField: '_id', as: 'role' } },
            { $unwind: '$role' },
            { $project: { last_login: 0, 'role._id': 0 } }
        ]).toArray()

        return result[0] as User
    }

    async findById(id: string): Promise<User> {
        this.validateID(id)

        const result = await this.collection.aggregate([
            { $match: { _id: new ObjectId(id) } },
            { $limit: 1 },
            { $lookup: { from: 'roles', localField: 'role', foreignField: '_id', as: 'role' } },
            { $unwind: '$role' },
            { $project: { password: 0, last_login: 0, 'role._id': 0 } }
        ]).toArray()

        return result[0] as User
    }

    async updateLastLogin(id: string): Promise<void> {
        await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: { last_login: new Date() } })
    }

}
