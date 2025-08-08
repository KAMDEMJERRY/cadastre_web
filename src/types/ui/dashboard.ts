// types/dashboard.ts
export interface LotissementData {
  id: number;
  nom: string;
  adresse: string;
  nombreBlocs: number;
  nombreParcelles: number;
  description: string;
  dateCreation: string;
  longueur: number | null;
  superficie_m2: number | null;
  perimetre_m: number | null;
  geom?: GeoJSON.Polygon | null; // Optional geometry field
  statut: 'actif' | 'en_cours' | 'suspendu';
}

export interface ParcelleData {
  id: string;
  numero: string;
  bloc: string;
  lotissement: string;
  proprietaire: string;
  superficie: number;
  statut: 'libre' | 'vendue' | 'reservee';
}


export interface ProfileAdministrateur{
  idCadastrale: string;
  nom: string;
  email: string;
}
export interface UtilisateurData {
  id: number;
  nom: string;
  email: string;
  cni: string;
  type: 'proprietaire' | 'administrateur';
  statut: 'actif' | 'inactif' | 'suspendu';
  nombreParcelles: number;
}

export interface ActivityData {
  id: number;
  action: string;
  details: string;
  user: string;
  time: string;
  type: 'success' | 'info' | 'warning';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // Lucide icon component
}

export interface StatsData {
  totalLotissements: number;
  totalBlocs: number;
  totalParcelles: number;
  totalUtilisateurs: number;
  parcellesVendues: number;
  parcellesLibres: number;
  revenus: string;
  croissanceMensuelle: number;
}