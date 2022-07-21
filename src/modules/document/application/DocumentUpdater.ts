import {injectable, inject} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {DocumentRepository} from "../domain/DocumentRepository";
import {Document} from '../domain/Document'
import Validator from "../../shared/domain/Validator";
import {BadRequestError} from "../../../errors/BadRequestError";

@injectable()
export class DocumentUpdater {
    @inject(TYPES.DocumentRepository) private repository: DocumentRepository
    @inject(TYPES.DocumentUpdatedValidator) private validator: Validator

    async update(id: string, document: Document) {
        const errors = this.validator.getMessageError(document)
        if(errors) {
            throw new BadRequestError({ message: errors })
        }

        return await this.repository.update(id, document)
    }
}
