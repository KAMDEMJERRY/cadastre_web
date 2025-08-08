import { Bloc } from "./bloc";
import { BaseGeometry } from "./geometry";


// Modèle Lotissement
export interface Lotissement extends BaseGeometry {
  name: string;
  addresse?: string;
  description?: string;
}

// Modèle Rue
export interface Rue extends BaseGeometry {
  name: string;
}

// Types pour les réponses API avec relations étendues
export interface LotissementDetailed extends Omit<Lotissement, 'id'> {
  id: number;
  blocs?: Bloc[];
}

// Types pour les formulaires (création/modification)
export interface LotissementForm {
  name: string;
  addresse?: string;
  description?: string;
  longeur?: number;
  superficie_m2: number;
  perimetre_m: number;
  geom?: GeoJSON.Polygon;
}

export interface APILotissementResponse{
  type: string;
  count: number;
  next?: string;
  previous?: string;
  features: APILotissementFeature[];
}

export interface APILotissementFeature{
  id: number;
  properties: Omit<Lotissement, 'id'>;
  type: string;
}

export interface RueForm {
  name: string;
  longeur?: number;
  superficie_m2: number;
  perimetre_m: number;
  geom?: GeoJSON.Polygon;
}

// Types pour les réponses API paginées
export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Types pour les filtres de recherche
export interface LotissementFilters {
  name?: string;
  addresse?: string;
  superficie_min?: number;
  superficie_max?: number;
}


export interface RueFilters {
  name?: string;
  superficie_min?: number;
  superficie_max?: number;
}


