import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {DocumentRepository} from "../domain/DocumentRepository";
import {BadRequestError} from "../../../errors/BadRequestError";
import {NotFoundError} from "../../../errors/NotFoundError";

@injectable()
export class DocumentFinder {
    @inject(TYPES.DocumentRepository) private repository: DocumentRepository

    async findAll() {
        return await this.repository.findAll()
    }

    async findByTitle(search: string, limit: number) {

        if(!(limit >= 1 && limit <= 100)) {
            throw new BadRequestError({ message: 'Limit range out of the range 1-100' })
        }

        return await this.repository.findTitles(search, limit)
    }

    async findById(id: string) {
        const document = await this.repository.findById(id)

        if(!document) {
            throw new NotFoundError({ message: `ID Document ${id} not found` })
        }

        return document
    }
}
