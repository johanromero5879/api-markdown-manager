import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import MongoRepository from "../../shared/infrastructure/MongoRepository";
import {DocumentRepository} from "../domain/DocumentRepository";
import {Document} from '../domain/Document'
import {UserRepository} from "../../user/domain/UserRepository";
import {NotFoundError} from "../../../errors/NotFoundError";
import {ObjectId} from "mongodb";


@injectable()
export class MongoDocumentRepository extends MongoRepository implements DocumentRepository {
    @inject(TYPES.UserRepository) private userRepository: UserRepository

    protected moduleName: string = 'documents'

    findAll(): Promise<Document[]> {
        return Promise.resolve([]);
    }

    findById(id: string): Promise<Document> {
        return Promise.resolve(undefined);
    }

    findTitles(search: string, limit: number): Promise<Document[]> {
        return Promise.resolve([]);
    }

    async insert(document: Document): Promise<Document> {
        // Verify if author exists
        if(!await this.userRepository.existsById(document.created_by)) {
            throw new NotFoundError({ message: `Author ID not found` })
        }

        // Transform user id string to objectid
        document.created_by = new ObjectId(document.created_by)
        document.modified_by = document.created_by

        // Setting default date at created_at and modified_at by current server date
        const today = new Date()
        document.created_at = today
        document.modified_at = today

        // Set an empty changes history in new document
        document.history = []

        document._id = (await this.collection.insertOne(document)).insertedId

        return document
    }

}
