import {inject, injectable} from "inversify";
import {TYPES} from "../../../dependency-injection/types";

import {DocumentRepository} from "../domain/DocumentRepository";

@injectable()
export class DocumentFinder {
    @inject(TYPES.DocumentRepository) private repository: DocumentRepository

    async findAll() {
        return await this.repository.findAll()
    }

    async findByTitle(search: string, limit: number) {
        return await this.repository.findTitles(search, limit)
    }

    async findById(id: string) {
        return await this.repository.findById(id)
    }
}
