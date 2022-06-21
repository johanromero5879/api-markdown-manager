import {injectable} from "inversify";


import MongoRepository from "../../shared/infraestructure/MongoRepository";
import {RoleRepository} from "../domain/RoleRepository";
import {Role} from "../domain/Role";
import NotFoundError from "../../../errors/NotFoundError";
import BadRequestError from "../../../errors/BadRequestError";

@injectable()
export class MongoRoleRepository extends MongoRepository implements RoleRepository {

    async getById(id: string): Promise<Role> {
        this.validateID(id)

        const role = await this.collection().findOne({ _id: id }) as Role

        if(!role) {
            throw new NotFoundError(`ID Role ${id} not found`)
        }

        return role
    }

    async getByName(name: string): Promise<Role> {
        const role = await this.collection().findOne({ name }) as Role
        if(!role) {
            throw new NotFoundError(`Role ${name} not found`)
        }
        return role
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
        return "roles"
    }

}
