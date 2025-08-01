import { Lotissement } from '@/types/lotissement';
import { apiClient } from '../client';

export const LotissementService = {

  async getByAdmin(): Promise<Lotissement[]> {
    const response = await apiClient.get<Lotissement[]>(`/cadastre/lotissement`);
    return response;
  },

  async postByAdmin(lotissementData: Omit<Lotissement, 'id'>): Promise<Lotissement> {
    const response = await apiClient.post<Lotissement>(`/cadastre/lotissement`, lotissementData);
    return response;
  },

  async updateByAdmin(id: number, lotissementData: Omit<Lotissement, 'id'>): Promise<Lotissement> {
    const response = await apiClient.put<Lotissement>(`/cadastre/lotissement/${id}`, lotissementData);
    return response;
  },

  async deleteByAdmin(id: number): Promise<void> {
    await apiClient.delete(`/cadastre/lotissement/${id}`);
  },

}