import {Collection, MongoClient, ObjectId} from "mongodb";
import { injectable } from "inversify";
import BadRequestError from "../../../errors/BadRequestError";

@injectable()
export default abstract class MongoRepository {
    private client: MongoClient
    protected abstract moduleName: string

    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI)
    }

    protected get collection(): Collection {
        return this.client.db().collection(this.moduleName)
    }

    protected validateID(id: string) {
        if(!ObjectId.isValid(id)) {
            throw new BadRequestError({ message: `ID ${id} in collection ${ this.moduleName } is not valid` })
        }
    }
}
