type Bloc = {
  id: string;
  name: string;
  lotissement: string;
  rues: string[];
};

export async function fetchBlocs(): Promise<Bloc[]> {
  // Remplacer par un vrai appel API
  return [
    {
      id: '1',
      name: 'Bloc A',
      lotissement: 'Cité Verte',
      rues: ['Rue 1', 'Rue 2'],
    },
    {
      id: '2',
      name: 'Bloc B',
      lotissement: 'Mvog-Ada',
      rues: ['Rue 3'],
    },
  ];
}

export async function fetchBlocById(id: string): Promise<Bloc> {
  // Remplacer par un vrai appel API
  return {
    id,
    name: `Bloc ${id}`,
    lotissement: 'Cité Verte',
    rues: ['Rue 1', 'Rue 2'],
  };
}