import AdminHeader from '@/components/features/admin/AdminHeader';
import AdminNavCards from '@/components/features/dashboard/admin/AdminNavCards';
import QuickActions from '@/components/features/dashboard/admin/QuickActions';
import LotissementsTable from '@/components/features/dashboard/admin/LotissementsTable';
import { fetchLotissements } from '@/lib/api/lotissement';

export default async function AdminDashboard() {
  const lotissements = await fetchLotissements();

  return (<>
      

    <div className="bg-gray-100 min-h-screen">
      
      <main className="max-w-7xl mx-auto p-6">
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Interface Administrateur</h2>
          <p className="text-gray-600">Gérez les lotissements, blocs, parcelles et propriétaires</p>
        </section>

        <AdminNavCards />
        <QuickActions />
        <LotissementsTable data={lotissements} />
      </main>
    </div>
  </>
      
  );
}