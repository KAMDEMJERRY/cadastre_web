import { APIBlocFeature, APIBlocResponse, Bloc } from "@/types/bloc";
import { apiClient } from "../client";

export const blocService = {

  async getByAdmin(): Promise<Bloc[]> {
    const response = await apiClient.get<APIBlocResponse>(`/cadastre/bloc`);
    const blocs = processBlocs(response);
    console.log(blocs);
    return blocs;
  },

  async postByAdmin(blocData: Omit<Bloc, 'id'>): Promise<Bloc> {
    const response = await apiClient.post<Bloc>(`/cadastre/bloc/`, blocData);
    return response;
  },

  async updateByAdmin(id: number, blocData: Omit<Bloc, 'id'>): Promise<Bloc> {
    const response = await apiClient.put<Bloc>(`/cadastre/bloc/${id}/`, blocData);
    return response;
  },

  async deleteByAdmin(id: number): Promise<void> {
    await apiClient.delete(`/cadastre/bloc/${id}/`);
  },

  async getByProprietaire(id: number) : Promise<Bloc>{
    const response = await apiClient.get<Bloc>(`/cadastre/bloc/${id}/`);
    return response;
  }

}
export function processBlocs(apiResponse: APIBlocResponse): Bloc[] {
  if((!apiResponse.features) || !Array.isArray(apiResponse.features)){
    console.warn("Aucun bloc trouve dans la reponse");
    return [];
  }
  return apiResponse.features
              .filter(feature => isValidBloc(feature))
              .map(feature => transformToBloc(feature));
}

export function isValidBloc(feature: APIBlocFeature): boolean{
  console.log("isValidBloc called with feature:", feature);
  return !!(feature && feature.properties);
}


export function transformToBloc(feature: APIBlocFeature): Bloc{
  console.log("Transforming feature to Bloc:", feature);
  const properties = feature.properties;
  return{
    id: feature.id,
    name: properties.name,
    bloc_lotissement: properties.bloc_lotissement,
    description: properties.description,
    longeur: properties.longeur,
    superficie_m2: properties.superficie_m2,
    perimetre_m: properties.perimetre_m,
    geometry: properties.geometry || null,
    created_at: properties.created_at,
    updated_at: properties.updated_at
  }
}


