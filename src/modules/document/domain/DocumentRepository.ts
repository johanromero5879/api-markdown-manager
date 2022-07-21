import {Document} from "./Document";

export interface DocumentRepository {
    findById(id: string): Promise<Document>
    findAll(): Promise<Document[]>
    insert(document: Document): Promise<Document>
    findTitles(search: string, limit: number): Promise<Document[]>
    update(id: string, document: Document): Promise<Document>
}
