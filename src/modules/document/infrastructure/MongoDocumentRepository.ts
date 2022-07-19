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

    async findAll(): Promise<Document[]> {
        return await this.collection.aggregate([
            { $lookup: {
                from: 'users',
                localField: 'created_by',
                foreignField: '_id',
                as: 'created_by'
            } },
            { $unwind: '$created_by' },
            { $lookup: {
                from: 'users',
                localField: 'modified_by',
                foreignField: '_id',
                as: 'modified_by'
            } },
            { $unwind: '$modified_by' },
            { $project: {
                _id: 1,
                title: 1,
                content: 1,
                'created_by.username': 1,
                'created_by.fullname': 1,
                'modified_by.username': 1,
                'modified_by.fullname': 1
            } }
        ]).toArray() as Document[]
    }

    async findById(id: string): Promise<Document> {
        await this.validateID(id)

        const result = await this.collection.aggregate([
            { $match: { _id: new ObjectId(id) } },
            { $lookup: {
                    from: 'users',
                    localField: 'created_by',
                    foreignField: '_id',
                    as: 'created_by'
                } },
            { $unwind: '$created_by' },
            { $lookup: {
                    from: 'users',
                    localField: 'modified_by',
                    foreignField: '_id',
                    as: 'modified_by'
                } },
            { $unwind: '$modified_by' },
            { $project: {
                _id: 1,
                title: 1,
                content: 1,
                'created_by.username': 1,
                'created_by.fullname': 1,
                'modified_by.username': 1,
                'modified_by.fullname': 1
            } }
        ]).toArray()

        return result[0] as Document
    }

    async findTitles(search: string, limit: number): Promise<Document[]> {
        return await this.collection.aggregate([
            { $match: { title: { $regex: `${search}`, $options: 'i' } } },
            { $sort: { title: 1 } },
            { $limit: limit },
            { $lookup: {
                from: 'users',
                localField: 'created_by',
                foreignField: '_id',
                as: 'created_by'
            } },
            { $unwind: '$created_by' },
            { $lookup: {
                    from: 'users',
                    localField: 'modified_by',
                    foreignField: '_id',
                    as: 'modified_by'
                } },
            { $unwind: '$modified_by' },
            { $project: {
                _id: 1,
                title: 1
            } }
        ]).toArray() as Document[]
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
