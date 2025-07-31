import Header from '@/app/dashboard/proprietaire/components/Header';
import StatsGrid from '@/app/dashboard/proprietaire/components/StatsGrid';
import FiltersSection from '@/app/dashboard/proprietaire/components/FilterGrid';
import ParcellesGrid from '@/app/dashboard/proprietaire/components/ParcellesGrid';
import { fetchUserParcelles } from '@/services/api/parcelle';

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