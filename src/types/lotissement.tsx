import { User } from "./user";

// Types de base
export interface BaseGeometry {
  id?: number;
  longeur?: number;
  superficie_m2: number;
  perimetre_m: number;
  geom?: GeoJSON.Polygon | null;
  created_at?: string;
  updated_at?: string;
}

// Modèle Lotissement
export interface Lotissement extends BaseGeometry {
  name: string;
  addresse?: string;
  description?: string;
}

// Modèle Bloc
export interface Bloc extends BaseGeometry {
  name?: string;
  bloc_lotissement: number | Lotissement; // ID ou objet complet
  description?: string;
}

// Modèle Parcelle
export interface Parcelle extends BaseGeometry {
  name?: string;
  parcelle_bloc: number | Bloc; // ID ou objet complet
  proprietaire: number | User; // ID ou objet complet
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

export interface BlocDetailed extends Omit<Bloc, 'id' | 'bloc_lotissement'> {
  id: number;
  bloc_lotissement: Lotissement;
  parcelles?: Parcelle[];
}

export interface ParcelleDetailed extends Omit<Parcelle, 'id' | 'parcelle_bloc' | 'proprietaire'> {
  id: number;
  parcelle_bloc: Bloc;
  proprietaire: User;
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

export interface BlocForm {
  name?: string;
  bloc_lotissement: number;
  description?: string;
  longeur?: number;
  superficie_m2: number;
  perimetre_m: number;
  geom?: GeoJSON.Polygon;
}

export interface ParcelleForm {
  name?: string;
  parcelle_bloc: number;
  proprietaire: number;
  longeur?: number;
  superficie_m2: number;
  perimetre_m: number;
  geom?: GeoJSON.Polygon;
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

export interface BlocFilters {
  name?: string;
  bloc_lotissement?: number;
  superficie_min?: number;
  superficie_max?: number;
}

export interface ParcelleFilters {
  name?: string;
  parcelle_bloc?: number;
  proprietaire?: number;
  superficie_min?: number;
  superficie_max?: number;
}

export interface RueFilters {
  name?: string;
  superficie_min?: number;
  superficie_max?: number;
}

// Type pour les erreurs API
export interface ApiError {
  message: string;
  field?: string;
  code?: string;
}

// Type pour les réponses d'erreur
export interface ErrorResponse {
  errors: ApiError[];
  detail?: string;
}

// Types utilitaires pour les sélecteurs
export interface SelectOption {
  value: number;
  label: string;
}

// Type pour les statistiques (optionnel)
export interface GeometryStats {
  total_superficie: number;
  total_perimetre: number;
  moyenne_superficie: number;
  count: number;
}