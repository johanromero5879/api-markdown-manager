import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {DocumentRepository} from "../domain/DocumentRepository";
import {BadRequestError} from "../../../errors/BadRequestError";

@injectable()
export class DocumentFinder {
    @inject(TYPES.DocumentRepository) private repository: DocumentRepository

    async findAll() {
        return await this.repository.findAll()
    }

    async findByTitle(search: string, limit: number) {
        if(!search) {
            throw new BadRequestError({ message: 'Search filter is missing' })
        }

        if(!(limit >= 1 && limit <= 100)) {
            throw new BadRequestError({ message: 'Limit range out of the range 1-100' })
        }

        return await this.repository.findTitles(search, limit)
    }

    async findById(id: string) {
        return await this.repository.findById(id)
    }
}
