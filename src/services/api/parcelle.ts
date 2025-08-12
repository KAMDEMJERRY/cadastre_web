import { APIParcelleFeature, APIParcelleResponse, Parcelle } from "@/types/parcelle";
import { apiClient } from "../client";
import { mapParcelleDataToStatProprietaires, mapParcellesToParcelleData } from "@/utils/mappers/parcelleMapper";
import { ParcelleProprietaire } from "@/types/ui/proprietaire";


export const parcelleService = {
  
  async getByProprietaire(): Promise<ParcelleProprietaire[]> {
    const response = await apiClient.get<APIParcelleResponse>('/cadastre/parcelle');  
    console.log("Response from parcelleService.getByProprietaire:", response);
    const parcelles =  processParcelles(response);
    console.log("parcelles", parcelles);
    const parcellesProp = mapParcellesToParcelleData(parcelles);
    return parcellesProp;
  },

  async  getByProprietaireAndParcelleId(id: number): Promise<Parcelle> {
    const response = await apiClient.get<Parcelle>(`/cadastre/parcelle/${id}`);
    
    return response;
  },

  // Methodes pour l'admin
  async getByAdmin(): Promise<Parcelle[]>{
      const response = await apiClient.get<APIParcelleResponse>(`/cadastre/parcelle`);
      console.log("Response from parcelleService.getByProprietaire:", response);
      const parcelles =  processParcelles(response);
      console.log("parcelles", parcelles);
      return parcelles;
  },
  
  async postByAdmin(parcelleData: Omit<Parcelle, 'id'>): Promise<Parcelle>{
      const  response = await apiClient.post<Parcelle>(`/cadastre/parcelle/`, parcelleData);
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

// Fonction de traitement principale
 export function processParcelles(apiResponse: APIParcelleResponse): Parcelle[]{
    if (!apiResponse.features || !Array.isArray(apiResponse.features)){
      console.warn('Aucune parcelle trouvee dans la reponse');
      return [];
    }

    return apiResponse.features
                      .filter(feature=> isValidParcelle(feature))
                      .map(feature=> transformToParcelle(feature));
 }

 // Validation d'une parcelle
 function isValidParcelle(feature: APIParcelleFeature): boolean{
     console.log("isValidParcelle called with feature:", feature);
     const valid = !!(
      feature.id &&
      feature.properties
    );
    console.log("isValidParcelle result:", valid);
    return valid;
 }

 // Transformation d'une feature API en Parcelle
 function transformToParcelle(feature: APIParcelleFeature): Parcelle {
  console.log("Transforming feature to Parcelle:", feature);
  const properties = feature.properties;
  return {
    id: feature.id,
    name: properties.name,
    parcelle_bloc: properties.parcelle_bloc,
    proprietaire: properties.proprietaire,
    longeur: properties.longeur,
    superficie_m2: properties.superficie_m2,
    perimetre_m: properties.perimetre_m,
    geometry: properties.geometry || null,
    created_at: properties.created_at,
    updated_at: properties.updated_at
  };
 }


