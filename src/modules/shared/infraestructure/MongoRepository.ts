import {Collection, MongoClient, ObjectId} from "mongodb";
import { injectable } from "inversify";
import BadRequestError from "../../../errors/BadRequestError";

@injectable()
export default abstract class MongoRepository {
    private client: MongoClient

    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI)
    }

    protected abstract moduleName(): string

    protected collection(): Collection {
        return this.client.db().collection(this.moduleName())
    }

    protected validateID(id: string) {
        if(!ObjectId.isValid(id)) {
            throw new BadRequestError(`ID ${id} is not valid`)
        }
    }
}
