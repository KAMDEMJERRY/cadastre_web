import Link from 'next/link';

const lotissements = [
  {
    id: 1,
    nom: 'Cité Verte',
    adresse: 'Yaoundé',
    dateCreation: '2023-01-15',
  },
  {
    id: 2,
    nom: 'Mvog-Ada',
    adresse: 'Yaoundé',
    dateCreation: '2023-03-10',
  },
];

export default function LotissementsTable() {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Liste des Lotissements</h3>
        <button className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors">
          Exporter en CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Création</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lotissements.map((lotissement) => (
              <tr key={lotissement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lotissement.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lotissement.adresse}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lotissement.dateCreation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href="#" className="text-blue-600 hover:text-blue-900 hover:underline mr-3">
                    Modifier
                  </Link>
                  <Link href="#" className="text-red-600 hover:text-red-900 hover:underline">
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