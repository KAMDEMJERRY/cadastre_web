import { APILotissementFeature, APILotissementResponse, Lotissement } from '@/types/lotissement';
import { apiClient } from '../client';

export const LotissementService = {

  async getByAdmin(): Promise<Lotissement[]> {
    const response = await apiClient.get<APILotissementResponse>(`/cadastre/lotissement`);
    const lotissements = processLotissements(response);
    return lotissements;
  },

  async postByAdmin(lotissementData: Omit<Lotissement, 'id'>): Promise<Lotissement> {
    console.log("postByAdmin", lotissementData);
    const response = await apiClient.post<Lotissement>(`/cadastre/lotissement/`, lotissementData);
    return response;
  },

  async updateByAdmin(id: number, lotissementData: Omit<Lotissement, 'id'>): Promise<Lotissement> {
    const response = await apiClient.put<Lotissement>(`/cadastre/lotissement/${id}/`, lotissementData);
    return response;
  },

  async deleteByAdmin(id: number): Promise<void> {
     try {
          // Maintenant cela fonctionne correctement avec les réponses vides
          await apiClient.delete(`/cadastre/lotissement/${id}/`);
          console.log(`Lotissement ${id} supprimé avec succès`);
      } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          throw error;
      }
  },


  async getByProprietaire(id: number): Promise<Lotissement> {
    const response = await apiClient.get<Lotissement>(`/cadastre/lotissement/${id}/`);
    return response;
  }

}

export function processLotissements(apiResponse: APILotissementResponse): Lotissement[] {
  if (!apiResponse.features || !Array.isArray(apiResponse.features)) {
    console.warn('Aucun lotissement trouve dans la reponse');
    return [];
  }

  return apiResponse.features
    .filter(feature => isValidLotissement(feature))
    .map(feature => transformToLotissement(feature));
} 

export function isValidLotissement(feature: APILotissementFeature): boolean {
  console.log("isValidLotissement called with feature:", feature);
  return !!(feature && feature.properties); 
}

export function transformToLotissement(feature: APILotissementFeature){
  console.log("Transforming feature to Lotissement: ", feature);
  const properties = feature.properties;
  const dataString = properties.created_at;
  let date: Date = new Date();
  if (typeof dataString == 'string') {
     date = new Date(dataString);
  }

  return{
    id: feature.id,
    name: properties.name,
    addresse: properties.addresse,
    description: properties.description,
    longeur: properties.longeur,
    superficie_m2: properties.superficie_m2,
    perimetre_m: properties.perimetre_m,
    geometry: properties.geometry || null,
    created_at: date.toLocaleDateString('fr-FR')
  };
}