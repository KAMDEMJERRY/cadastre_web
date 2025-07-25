import { fetchBlocById } from '@/lib/api/admin.blocs';
import { BlocForm } from '@/components/features/admin/BlocForm';

export default async function BlocDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const bloc = await fetchBlocById(params.id);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-800">
          Modification du Bloc {bloc.name}
        </h2>
        <p className="text-gray-600">
          Lotissement: {bloc.lotissement}
        </p>
      </section>

      <BlocForm initialData={bloc} />
    </div>
  );
}