import Button from '@/components/ui/Button1';

type Parcelle = {
  id: string;
  numero: string;
  status: 'active' | 'pending';
  lotissement: string;
  bloc: string;
  superficie: number;
  perimetre: number;
};

export default function ParcelleCard({ parcelle }: { parcelle: Parcelle }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-500 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">Parcelle {parcelle.numero}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          parcelle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {parcelle.status === 'active' ? 'Actif' : 'En attente'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Lotissement</p>
          <p className="font-semibold">{parcelle.lotissement}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Bloc</p>
          <p className="font-semibold">{parcelle.bloc}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Superficie</p>
          <p className="font-semibold">{parcelle.superficie} m²</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Périmètre</p>
          <p className="font-semibold">{parcelle.perimetre} m</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" variant="primary">
          Voir détails
        </Button>
        <Button className="flex-1" variant="outline">
          Localiser
        </Button>
      </div>
    </div>
  );
}