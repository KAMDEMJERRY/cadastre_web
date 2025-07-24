import Header from '@/components/features/dashboard/Header';
import StatsGrid from '@/components/features/dashboard/StatsGrid';
import FiltersSection from '@/components/features/dashboard/FilterGrid';
import ParcellesGrid from '@/components/features/dashboard/ParcellesGrid';
import { fetchUserParcelles } from '@/lib/api/parcelle';

export default async function DashboardPage() {
  const parcelles = await fetchUserParcelles();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Parcelles</h1>
          <p className="text-lg text-gray-600">
            Gérez et consultez vos propriétés cadastrales
          </p>
        </div>

        <StatsGrid />
        <FiltersSection />
        <ParcellesGrid parcelles={parcelles} />
      </main>
    </div>
  );
}