export type Lotissement = {
  id: string;
  nom: string;
  adresse: string;
  dateCreation: string;
};

export type Bloc = {
  id: string;
  nom: string;
  lotissementId: string;
  nombreParcelles: number;
};

export type Parcelle = {
  id: string;
  numero: string;
  blocId: string;
  superficie: number;
  proprietaireId: string | null;
};