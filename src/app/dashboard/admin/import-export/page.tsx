import ImportSection from './components/ImportSection';
import ExportSection from './components/ExportSection';

export default function ImportExportPage() {
  return (
    <>
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Import/Export Données Cadastrales</h2>
        <p className="text-gray-600">Importez ou exportez des données cadastrales pour la gestion des parcelles</p>
      </section>

      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <ImportSection />
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <ExportSection />
      </section>
    </>
  );
}