import {Request, Response, NextFunction} from "express";
import {controller, httpPost, request, response, next, httpGet, httpPatch, httpDelete} from "inversify-express-utils";
import {inject} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {DocumentCreator} from "../application/DocumentCreator";
import {Document} from '../domain/Document'
import {DocumentFinder} from "../application/DocumentFinder";
import {DocumentUpdater} from "../application/DocumentUpdater";
import {ForbiddenError} from "../../../errors/ForbiddenError";
import {DocumentDeleter} from "../application/DocumentDeleter";

@controller('/documents')
export class DocumentController {
    @inject(TYPES.DocumentCreator) private documentCreator: DocumentCreator
    @inject(TYPES.DocumentFinder) private documentFinder: DocumentFinder
    @inject(TYPES.DocumentUpdater) private documentUpdater: DocumentUpdater
    @inject(TYPES.DocumentDeleter) private documentDeleter: DocumentDeleter

    @httpPost('/', TYPES.TokenMiddleware)
    async create(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            let document: Document = req.body

            // Set current logged user as author of new document
            document.created_by = req['user']._id

            document = await this.documentCreator.insert(document)

            // Emit document created to client sockets
            req.app.get('io').emit('document:created', document)

            res.status(201).json(document)
        }catch(error) {
            next(error)
        }
    }

    @httpGet('/')
    async findAll(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const documents = await this.documentFinder.findAll()
            res.json(documents)
        }catch (error) {
            next(error)
        }
    }

    @httpGet('/titles')
    async findByTitles(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const search = req.query.search?.toString()
            const limit = parseInt(req.query.limit+'') || 5

            const documents = await this.documentFinder.findByTitle(search, limit)
            res.json(documents)
        }catch (error) {
            next(error)
        }
    }

    @httpGet('/:id')
    async findById(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            let document = await this.documentFinder.findById(req.params.id)
            res.json(document)
        }catch (error) {
            next(error)
        }
    }

    @httpPatch('/:id', TYPES.TokenMiddleware)
    async update(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            let document = req.body

            // Set current logged user as author of modification
            document.modified_by = req['user']._id

            document = await this.documentUpdater.update(req.params.id, document)

            // Emit document created to client sockets
            req.app.get('io').emit('document:updated', document)

            res.json(document)
        }catch (error) {
            next(error)
        }
    }

    @httpDelete('/:id', TYPES.TokenMiddleware)
    async delete(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const owner = (await this.documentFinder.findById(req.params.id)).created_by
            const user = req['user']

            if(!(user.role.name === 'administrator' || owner.username === user.username)) {
                throw new ForbiddenError({ message: `You must be owner document or administrator` })
            }

            const document = await this.documentDeleter.delete(req.params.id)
            res.json(document)
        }catch (error) {
            next(error)
        }
    }
}
