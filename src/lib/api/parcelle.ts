import { Parcelle } from "@/types/parcelle";

export async function fetchUserParcelles(): Promise<Parcelle[]> {
  // Remplacez par un vrai appel API
  return [
    {
      id: '1',
      numero: 'P001',
      status: 'active',
      lotissement: 'Cité Verte',
      bloc: 'Bloc A',
      superficie: 500,
      perimetre: 90,
    },
    // ... autres parcelles
  ];
}