import CreateParcelleForm from './components/CreateParcelleForm';
import ParcellesTable from './components/ParcellesTable';

export default function ParcellesPage() {
  return (
    <>
      {/* Page Title */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Parcelles</h2>
        <p className="text-gray-600">Créez, modifiez et assignez des parcelles</p>
      </section>

      {/* Create Parcelle Form */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <CreateParcelleForm />
      </section>

      {/* Parcelles List */}
      <section className="bg-white p-6 rounded-lg shadow">
        <ParcellesTable />
      </section>
    </>
  );
}