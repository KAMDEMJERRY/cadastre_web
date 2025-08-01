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


// Type pour les statistiques (optionnel)
export interface GeometryStats {
  total_superficie: number;
  total_perimetre: number;
  moyenne_superficie: number;
  count: number;
}