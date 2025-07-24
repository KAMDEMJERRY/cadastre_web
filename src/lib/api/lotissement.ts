import { Lotissement } from '@/types/lotissement';

export async function fetchLotissements(): Promise<Lotissement[]> {
  // Remplacer par un vrai appel API
  return [
    {
      id: '1',
      nom: 'Cité Verte',
      adresse: 'Yaoundé',
      dateCreation: '2023-01-15',
    },
    // Ajouter d'autres données mockées
  ];
}