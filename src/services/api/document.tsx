/* eslint-disable @typescript-eslint/no-explicit-any */
import { PARCELLEDOC_URL } from "@/utils/constants/end_points";
import { apiClient } from "../client";
import { APIDocumentResponse } from "@/types/document";
import { Document } from "@/types/document";

export const documentService = {
  async getByParcelleId(parcelle_id: number): Promise<Document> {
    const response = await apiClient.get<Document>(
      PARCELLEDOC_URL + `/parcelleDoc/?parcelle_id=${parcelle_id}`
    );
    return response;
  },

  async getById(doc_id: number) {
    const response = await apiClient.get(
      PARCELLEDOC_URL + "/" + String(doc_id) + "/"
    );
    return response;
  },

  async post(document: Omit<Document, "id">): Promise<Document> {
    console.log("Document:", document);
    const response = await apiClient.post<Document>(PARCELLEDOC_URL+"/", document);
    return response;
  },

  async put(doc_id: number, document: any) {
    const response = apiClient.post(
      PARCELLEDOC_URL + "/" + String(doc_id) + "/",
      document
    );
    return response;
  },

  async get(): Promise<Document[]> {
    const response = await apiClient.get<APIDocumentResponse>(
      PARCELLEDOC_URL + "/"
    );
    const documents = response.results;
    return documents;
  },
};
