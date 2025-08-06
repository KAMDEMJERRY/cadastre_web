import { APILotissementFeature, Lotissement } from '@/types/lotissement';
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


  async getByProprietaire(id: number): Promise<Lotissement> {
    const response = await apiClient.get<Lotissement>(`/cadastre/lotissement/${id}`);
    return response;
  }

}

export function transformToLotissement(feature: APILotissementFeature){
  console.log("Transforming feature to Lotissement: ", feature);
  const properties = feature.properties;
  return{
    id: feature.id,
    name: properties.name,
    addresse: properties.addresse,
    description: properties.description,
    longeur: properties.longeur,
    superficie_m2: properties.superficie_m2,
    perimetre_m: properties.perimetre_m,
    geometry: properties.geometry || null,
  };
}