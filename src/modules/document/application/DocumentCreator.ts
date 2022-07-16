import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {Document} from '../domain/Document'
import {DocumentRepository} from "../domain/DocumentRepository";
import {DocumentValidator} from "../domain/DocumentValidator";
import {BadRequestError} from "../../../errors/BadRequestError";

@injectable()
export class DocumentCreator {
    @inject(TYPES.DocumentRepository) private repository: DocumentRepository
    @inject(TYPES.DocumentValidator) private validator: DocumentValidator

    async insert(document: Document) {
        const errors = this.validator.getMessageError(document)
        if(errors) {
            throw new BadRequestError({ message: errors })
        }
        return await this.repository.insert(document)
    }
}
