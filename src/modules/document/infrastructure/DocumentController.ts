import {Request, Response, NextFunction} from "express";
import {controller, httpPost, request, response, next} from "inversify-express-utils";
import {inject} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {DocumentCreator} from "../application/DocumentCreator";
import {Document} from '../domain/Document'

@controller('/documents', TYPES.TokenMiddleware)
export class DocumentController {
    @inject(TYPES.DocumentCreator) private documentCreator: DocumentCreator

    @httpPost('/')
    async create(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            let document: Document = req.body

            // Set current logged user as author of new document
            document.created_by = req['user']._id

            document = await this.documentCreator.insert(document)
            res.status(201).json(document)
        }catch(error) {
            console.log(error)
            next(error)
        }
    }
}
