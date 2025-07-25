import RuesMap from '@/app/dashboard/admin/rues/components/RuesMap';
import CreateRueForm from '@/app/dashboard/admin/rues/components/CreateRueForm';
import RuesTable from '@/app/dashboard/admin/rues/components/RuesTable';

export default function RuesPage() {
  return (
    <>
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Rues</h2>
        <p className="text-gray-600">Administrez le réseau viaire de votre commune</p>
      </section>

      <section className="mb-8">
        <RuesMap />
      </section>

      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <CreateRueForm />
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <RuesTable />
      </section>
    </>
  );
}