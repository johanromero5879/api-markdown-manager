import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import MongoRepository from "../../shared/infrastructure/MongoRepository";
import {DocumentRepository} from "../domain/DocumentRepository";
import {Document} from '../domain/Document'
import {UserRepository} from "../../user/domain/UserRepository";
import {NotFoundError} from "../../../errors/NotFoundError";
import {ObjectId} from "mongodb";


@injectable()
export class MongoDocumentRepository extends MongoRepository<Document> implements DocumentRepository {
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
        this.validateID(id)

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

        delete document.history
        return document
    }

    async update(id: string, document: Document): Promise<Document> {
        this.validateID(id)

        // Get current data from document for save it as change in history
        const oldDocument = await this.collection.findOne({ _id: new ObjectId(id) }) as Document

        if(!oldDocument) {
            throw new NotFoundError({ message: `Document ID ${ id } not found` })
        }

        if(!await this.userRepository.existsById(document.modified_by)){
            throw new NotFoundError({ message: `Owner ID not found` })
        }

        // Save actual data in an object for adding in changes history
        const change = {
            title: oldDocument.title,
            content: oldDocument.content,
            modified_at: oldDocument.modified_at,
            modified_by: oldDocument.modified_by
        }

        // Cast modified_by to ObjectID and set modified_at to current date
        document.modified_by = new ObjectId(document.modified_by)
        document.modified_at = new Date()

        document = (await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: document,
                $push: { history: change }
            },
            { returnDocument: 'after', projection: { history: 0 } })).value

        return document
    }

    async delete(id: string): Promise<Document> {
        this.validateID(id)
        return (await this.collection.findOneAndDelete({ _id: new ObjectId(id) }, { projection: { history: 0 } })).value
    }

}
