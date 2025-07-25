import LotissementsMap from './components/LotissementsMap';
import CreateLotissementForm from './components/CreateLotissementForm';
import LotissementsTable from './components/LotissementsTable';

export default function LotissementsPage() {
  return (
    <>
      {/* Page Title */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Lotissements</h2>
        <p className="text-gray-600">Créez, modifiez, supprimez et visualisez les lotissements</p>
      </section>

      {/* Map */}
      <section className="mb-8">
        <LotissementsMap />
      </section>

      {/* Create Form */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <CreateLotissementForm />
      </section>

      {/* Lotissements List */}
      <section className="bg-white p-6 rounded-lg shadow">
        <LotissementsTable />
      </section>
    </>
  );
}