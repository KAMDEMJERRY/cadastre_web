import Link from 'next/link';

const parcelles = [
  {
    id: 1,
    numero: 'P001',
    bloc: 'Bloc A',
    proprietaire: 'Jean-Pierre KAMGANG',
    superficie: '500 m²',
  },
  {
    id: 2,
    numero: 'P002',
    bloc: 'Bloc B',
    proprietaire: 'Domaine Public',
    superficie: '300 m²',
  },
];

export default function ParcellesTable() {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Liste des Parcelles</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Numéro</th>
            <th className="p-2">Bloc</th>
            <th className="p-2">Propriétaire</th>
            <th className="p-2">Superficie</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcelles.map((parcelle) => (
            <tr key={parcelle.id} className="border-b">
              <td className="p-2">{parcelle.numero}</td>
              <td className="p-2">{parcelle.bloc}</td>
              <td className="p-2">{parcelle.proprietaire}</td>
              <td className="p-2">{parcelle.superficie}</td>
              <td className="p-2">
                <Link href="#" className="text-blue-600 hover:underline">
                  Modifier
                </Link>{' '}
                |{' '}
                <Link href="#" className="text-red-600 hover:underline">
                  Supprimer
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}