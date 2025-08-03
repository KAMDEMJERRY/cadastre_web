// types/proprietaire.ts
export interface ProprietaireProfile {
  id: string;
  idCadastrale: string;
  cni: string;
  nom: string;
  email: string;
  type: 'public' | 'privé';
  role: 'proprietaire';
  status: 'actif' | 'inactif' | 'suspendu';
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
  statut: 'actif' | 'en_attente' | 'suspendu';
  planLocalisation?: string;
  geometrie?: {
    coordinates: number[][];
    type: string;
  };
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