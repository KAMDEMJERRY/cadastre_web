import { DEFAULT_USER } from "@/data/user";
import { Parcelle } from "@/types/lotissement";




export async function fetchUserParcelles(): Promise<Parcelle[]> {
  // Remplacez par un vrai appel API
  return [
    {
      id: '1',
      numero: 'P001',
      lotissement: 'Cité Verte',
      bloc: 'Bloc A',
      superficie: 500,
      perimetre: 90,
      coordinates: [],
      proprietaire: DEFAULT_USER
    },
    // ... autres parcelles
  ];
}


export async function fetchParcelleById(id: string): Promise<Parcelle> {
  // Remplacer par un vrai appel API
  return {
    id,
    numero: 'P001',
    lotissement: 'Cité Verte',
    bloc: 'Bloc A',
    superficie: 500,
    perimetre: 90,
    coordinates: [
      [3.848, 11.502],
      [3.8485, 11.5025],
      [3.8485, 11.503],
      [3.848, 11.503],
    ],
    proprietaire: {
      id: 'prop-1',
      username: 'Jean-Pierre KAMGANG',
      firstname: 'Jean-Pierre',
      lastname: 'KAMGANG',
      email: 'jeanpierre@example.com',
      role: 'proprietaire'
    },
  };
}