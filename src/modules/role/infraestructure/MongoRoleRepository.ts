import {injectable} from "inversify";

import MongoRepository from "../../shared/infraestructure/MongoRepository";
import {RoleRepository} from "../domain/RoleRepository";
import {Role} from "../domain/Role";
import BadRequestError from "../../../errors/BadRequestError";
import {ObjectId} from "mongodb";

@injectable()
export class MongoRoleRepository extends MongoRepository implements RoleRepository {

    async findById(id: string): Promise<Role> {
        this.validateID(id)
        return await this.collection().findOne({ _id: new ObjectId(id) }) as Role
    }

    async findByName(name: string): Promise<Role> {
        const query = { name: { $regex: new RegExp(name, 'i') } }
        return await this.collection().findOne(query) as Role
    }

    async findAll(): Promise<Role[]> {
        return await this.collection().find().toArray() as Role[]
    }

    async insert(role: Role): Promise<Role> {
        await this.validateNameDuplicated(role.name)
        role._id = (await this.collection().insertOne(role)).insertedId
        return role
    }

    async validateNameDuplicated(name: string) {
        const query = {
            name: { $regex: new RegExp(name, 'i') }
        }

        const role = await this.collection().findOne(query) as Role

        if(role) {
            throw new BadRequestError(`Role ${name.toLowerCase()} already exists`)
        }
    }

    protected moduleName(): string {
        return 'roles'
    }
}
