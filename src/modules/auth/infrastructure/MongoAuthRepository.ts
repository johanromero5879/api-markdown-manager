import {injectable} from "inversify";
import MongoRepository from "../../shared/infrastructure/MongoRepository";
import {AuthRepository} from "../domain/AuthRepository";
import {User} from "../../user/domain/User";

@injectable()
export class MongoAuthRepository extends MongoRepository implements AuthRepository{
    protected moduleName: string = 'users'

    async findByUsername(username: string): Promise<User> {
        const result = await this.collection.aggregate([
            { $match: { username } },
            { $limit: 1 },
            { $lookup: { from: 'roles', localField: 'role', foreignField: '_id', as: 'role' } },
            { $unwind: '$role' },
            { $project: { _id: 0, 'role._id': 0 } }
        ]).toArray()

        return result[0] as User
    }

}
