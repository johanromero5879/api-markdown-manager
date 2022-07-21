export interface DocumentChange {
    title: string
    content: string,
    modified_at: Date,
    modified_by: any
}

export interface Document {
    _id?: any,
    title: string,
    content: string,
    created_by: any,
    created_at: Date,
    modified_by?: any,
    modified_at?: Date,
    history: DocumentChange[]
}
