import CreateProprietaireForm from './components/CreateProprietaireForm';
import ProprietairesTable from './components/ProprietairesTable';

export default function ProprietairesPage() {
  return (
    <>
      {/* Page Title */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Propriétaires</h2>
        <p className="text-gray-600">Enregistrez et associez des propriétaires aux parcelles</p>
      </section>

      {/* Create Propriétaire Form */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <CreateProprietaireForm />
      </section>

      {/* Propriétaires List */}
      <section className="bg-white p-6 rounded-lg shadow">
        <ProprietairesTable />
      </section>
    </>
  );
}