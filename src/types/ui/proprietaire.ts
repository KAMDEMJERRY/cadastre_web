import { AccountType, UserRole } from "../user";

// types/proprietaire.ts
export interface ProprietaireProfile {
  idCadastrale: string | undefined;
  cni: string | null | undefined;
  nom: string;
  email: string;
  type: AccountType;
  role: UserRole;
  status: boolean;
}

export interface ParcelleProprietaire {
  id: string;
  numero: string;
  bloc: {
    nom: string;
    lotissement: {
      nom: string;
      adresse: string;
    };
  };
  superficie: number;
  perimetre: number;
  planLocalisation?: string;
  geometrie?: GeoJSON.Polygon,
  localisation: {
    pays: string;
    region: string;
    departement: string;
    arrondissement: string;
    quartier: string;
  };
}

export interface StatsProprietaire {
  totalParcelles: number;
  superficieTotale: number;
  nombreLotissements: number;
  statutGeneral: 'à_jour' | 'attente' | 'problème';
}

export interface FilterOptions {
  lotissement: string;
  superficieMin: number | null;
  search: string;
  statut: string;
}