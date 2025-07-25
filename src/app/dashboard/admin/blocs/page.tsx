import { BlocForm } from '@/components/features/admin/BlocForm';
import { BlocTable } from '@/components/features/admin/BlocTable';
import { fetchBlocs } from '@/lib/api/admin.blocs';

export default async function BlocsPage() {
  const blocs = await fetchBlocs();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Blocs</h2>
        <p className="text-gray-600">
          Créez, modifiez et supprimez des blocs dans les lotissements
        </p>
      </section>

      <BlocForm />

      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Liste des Blocs</h3>
        <BlocTable blocs={blocs} />
      </section>
    </div>
  );
}