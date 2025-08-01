import { Bloc } from "./bloc";
import { BaseGeometry } from "./geometry";
import { User } from "./user";

// Modèle Parcelle
export interface Parcelle extends BaseGeometry {
  name: string;
  parcelle_bloc: number | Bloc; // ID ou objet complet
  proprietaire: number | User; // ID ou objet complet
}

export interface ParcelleDetailed extends Omit<Parcelle, 'id' | 'parcelle_bloc' | 'proprietaire'> {
  id: number;
  parcelle_bloc: Bloc;
  proprietaire: User;
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

export interface ParcelleFilters {
  name?: string;
  parcelle_bloc?: number;
  proprietaire?: number;
  superficie_min?: number;
  superficie_max?: number;
}
