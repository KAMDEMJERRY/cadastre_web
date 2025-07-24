export type Parcelle = {
  id: string;
  numero: string;
  status: 'active' | 'pending';
  lotissement: string;
  bloc: string;
  superficie: number;
  perimetre: number;
  // Ajoutez d'autres champs au besoin
};

export type ParcelleFilters = {
  lotissement: string;
  superficie: string;
  search: string;
  statut: string;
};