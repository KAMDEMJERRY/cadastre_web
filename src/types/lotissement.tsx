import { User } from "./user";

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


export interface Coordonnees {
  lat: number;
  lng: number;
}


export interface Parcelle {
  id: string;
  numero: string;
  lotissement: string;
  bloc: string;
  superficie: number;
  perimetre: number;
  coordinates: [number, number][];
  proprietaire: User;
}