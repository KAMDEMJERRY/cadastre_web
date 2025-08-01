import { Parcelle } from "@/types/parcelle";
import { apiClient } from "../client";


export const parcelleService = {
  
  async getByProprietaire(): Promise<Parcelle[]> {
    const response = await apiClient.get<Parcelle[]>('/cadastre/parcelle');  
    return response;
  },

  async  getByProprietaireAndParcelleId(id: number): Promise<Parcelle> {
    const response = await apiClient.get<Parcelle>(`/cadastre/parcelle/${id}`);
    return response;
  },

  // Methodes pour l'admin
  async getByAdmin(): Promise<Parcelle[]>{
      const response = await apiClient.get<Parcelle[]>(`/cadastre/parcelle`);
      return response;
  },
  
  async postByAdmin(parcelleData: Omit<Parcelle, 'id'>): Promise<Parcelle>{
      const  response = await apiClient.post<Parcelle>(`/cadastre/parcelle`, parcelleData);
      return response;
  },
  
  async updateByAdmin(id: number, parcelleData: Omit<Parcelle, 'id'>): Promise<Parcelle> {
    const response = await apiClient.put<Parcelle>(`/cadastre/parcelle/${id}`, parcelleData);
    return response;
  },

  async deleteByAdmin(id: number): Promise<void> {
    await apiClient.delete(`/cadastre/parcelle/${id}`);
  },


}


 