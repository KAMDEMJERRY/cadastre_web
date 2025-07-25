import Link from 'next/link';

const proprietaires = [
  {
    id: 1,
    nom: 'Jean-Pierre KAMGANG',
    cni: '123456789',
    email: 'jeanpierre@example.com',
    type: 'Privé',
  },
  {
    id: 2,
    nom: 'Domaine Public',
    cni: '-',
    email: '-',
    type: 'Public',
  },
];

export default function ProprietairesTable() {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Liste des Propriétaires</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Nom</th>
            <th className="p-2">CNI</th>
            <th className="p-2">Email</th>
            <th className="p-2">Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {proprietaires.map((proprietaire) => (
            <tr key={proprietaire.id} className="border-b">
              <td className="p-2">{proprietaire.nom}</td>
              <td className="p-2">{proprietaire.cni}</td>
              <td className="p-2">{proprietaire.email}</td>
              <td className="p-2">{proprietaire.type}</td>
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