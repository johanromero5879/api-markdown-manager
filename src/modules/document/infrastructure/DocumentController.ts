import {Request, Response, NextFunction} from "express";
import {controller, httpPost, request, response, next, httpGet} from "inversify-express-utils";
import {inject} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {DocumentCreator} from "../application/DocumentCreator";
import {Document} from '../domain/Document'
import {DocumentFinder} from "../application/DocumentFinder";
import {BadRequestError} from "../../../errors/BadRequestError";

@controller('/documents')
export class DocumentController {
    @inject(TYPES.DocumentCreator) private documentCreator: DocumentCreator
    @inject(TYPES.DocumentFinder) private documentFinder: DocumentFinder

    @httpPost('/', TYPES.TokenMiddleware)
    async create(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            let document: Document = req.body

            // Set current logged user as author of new document
            document.created_by = req['user']._id

            document = await this.documentCreator.insert(document)
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
            const search = req.query.search
            const limit = parseInt(req.query.limit+'') || 5

            if(!search) {
                throw new BadRequestError({ message: 'Search filter is missing' })
            }

            if(!(limit >= 1 && limit <= 100)) {
                throw new BadRequestError({ message: 'Limit range out of the range 1-100' })
            }

            const documents = await this.documentFinder.findByTitle(search+'', limit)
            res.json(documents)
        }catch (error) {
            next(error)
        }
    }

    @httpGet('/:id')
    async findById(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const document = await this.documentFinder.findById(req.params.id)
            res.json(document)
        }catch (error) {
            next(error)
        }
    }
}
