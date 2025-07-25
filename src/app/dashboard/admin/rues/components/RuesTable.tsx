import Link from 'next/link';

const rues = [
  {
    id: 1,
    nom: 'Rue de la Paix',
    type: 'rue',
    longueur: '450m',
    quartier: 'Centre-ville',
    revetement: 'Asphalte'
  },
  {
    id: 2,
    nom: 'Avenue des Cocotiers',
    type: 'avenue',
    longueur: '1200m',
    quartier: 'Résidentiel',
    revetement: 'Béton'
  },
];

export default function RuesTable() {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Liste des Rues</h3>
        <button className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
          Exporter
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Longueur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quartier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revêtement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rues.map((rue) => (
              <tr key={rue.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rue.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{rue.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rue.longueur}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rue.quartier}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rue.revetement}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href="#" className="text-blue-600 hover:text-blue-900 mr-3">
                    Modifier
                  </Link>
                  <Link href="#" className="text-red-600 hover:text-red-900">
                    Supprimer
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}