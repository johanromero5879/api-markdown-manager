import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {DocumentRepository} from "../domain/DocumentRepository";
import {NotFoundError} from "../../../errors/NotFoundError";

@injectable()
export class DocumentDeleter {
    @inject(TYPES.DocumentRepository) private repository: DocumentRepository

    async delete(id: string) {
        const document = await this.repository.delete(id)
        if(!document) {
            throw new NotFoundError({ message: `ID Document ${id} not found` })
        }
        return document
    }
}
