import {injectable} from "inversify";

import MongoRepository from "../../shared/infrastructure/MongoRepository";
import {RoleRepository} from "../domain/RoleRepository";
import {Role} from "../domain/Role";
import {ObjectId} from "mongodb";
import {ConflictError} from "../../../errors/ConflictError";

@injectable()
export class MongoRoleRepository extends MongoRepository<Role> implements RoleRepository {
    protected moduleName: string = 'roles'

    async findById(id: string): Promise<Role> {
        this.validateID(id)
        return await this.collection.findOne({ _id: new ObjectId(id) }) as Role
    }

    async findByName(name: string): Promise<Role> {
        const query = { name: { $regex: new RegExp(name, 'i') } }
        return await this.collection.findOne(query) as Role
    }

    async findAll(): Promise<Role[]> {
        return await this.collection.find().sort('name').toArray() as Role[]
    }

    async insert(role: Role): Promise<Role> {
        await this.validateNameDuplicated(role.name)
        role._id = (await this.collection.insertOne(role)).insertedId
        return role
    }

    async update(id: string, role: Role): Promise<Role> {
        this.validateID(id)
        await this.validateNameDuplicated(role.name, id)

        return (await this.collection
            .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: role }, { returnDocument: 'after' })).value as Role
    }

    async existsById(id: string): Promise<boolean> {
        this.validateID(id)
        return !!(await this.collection.findOne({ _id: new ObjectId(id) }));
    }

    async validateNameDuplicated(name: string, id = null) {
        const query = {
            name: { $regex: new RegExp(name, 'i') }
        }

        const role = await this.collection.findOne(query) as Role

        if(role && role._id != id) {
            throw new ConflictError({ message: `Role ${name.toLowerCase()} already exists` })
        }
    }
}
