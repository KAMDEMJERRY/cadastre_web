

export interface Document {
    id:number;
    document: string
    parcelle:number
}

export interface APIDocumentResponse{
    count: number;
    next?: string;
    previous?: string;
    results: Document[];
}
