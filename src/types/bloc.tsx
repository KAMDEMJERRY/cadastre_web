import { BaseGeometry } from "./geometry";
import { Lotissement } from "./lotissement";
import { Parcelle } from "./parcelle";

// Modèle Bloc
export interface Bloc extends BaseGeometry {
  name: string;
  bloc_lotissement: number | Lotissement; // ID ou objet complet
  description?: string;
}



export interface BlocDetailed extends Omit<Bloc, 'id' | 'bloc_lotissement'> {
  id: number;
  bloc_lotissement: Lotissement;
  parcelles?: Parcelle[];
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


export interface BlocFilters {
  name?: string;
  bloc_lotissement?: number;
  superficie_min?: number;
  superficie_max?: number;
}
