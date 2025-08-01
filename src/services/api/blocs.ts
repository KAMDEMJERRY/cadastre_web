import { Bloc } from "@/types/bloc";
import { apiClient } from "../client";

export const blocService = {

  async getByAdmin(): Promise<Bloc[]> {
    const response = await apiClient.get<Bloc[]>(`/cadastre/bloc`);
    return response;
  },

  async postByAdmin(blocData: Omit<Bloc, 'id'>): Promise<Bloc> {
    const response = await apiClient.post<Bloc>(`/cadastre/bloc`, blocData);
    return response;
  },

  async updateByAdmin(id: number, blocData: Omit<Bloc, 'id'>): Promise<Bloc> {
    const response = await apiClient.put<Bloc>(`/cadastre/bloc/${id}`, blocData);
    return response;
  },

  async deleteByAdmin(id: number): Promise<void> {
    await apiClient.delete(`/cadastre/bloc/${id}`);
  },
}