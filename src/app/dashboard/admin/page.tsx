'use client';
// pages/dashboard.tsx ou app/dashboard/page.tsx
import DashboardHeader from "@/components/admin/DashboardHeader";
import StatsCards from "@/components/admin/StatsCards";
import DashboardTabs from "@/components/admin/DashboardTabs";
import PerformanceSummary from "@/components/admin/PerformanceSummary";
import { 
  mockStats, 
  mockLotissements, 
  mockParcelles, 
  mockUtilisateurs, 
  mockActivities, 
  mockAdministrateurProfile
} from "@/data/mockData";
import { useUser } from "@/hooks/useUser";
import { useRouter } from 'next/navigation';
import { mapUserToAdminProfile } from "@/utils/mappers/userMapper";
import { LotissementsProvider } from "@/context/LotissementContext";
import { BlocProvider } from "@/context/BlocContext";
import { ParcelleProvider } from "@/context/ParcellesContext";

export default function AdminDashboard() {
  const router = useRouter()
  const {user, logout} = useUser();

  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      // Redirection ou autre logique de déconnexion
    }
    router.push('/login');
  };
  return (
    <LotissementsProvider>
      <BlocProvider>
        <ParcelleProvider>
              <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                  <DashboardHeader profile={user ? mapUserToAdminProfile(user):mockAdministrateurProfile} onLogout={handleLogout} />
                  <main className="pt-32 sm:pt-36 md:pt-40 pb-8">
                    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                      <StatsCards stats={mockStats} />
                      
                      <DashboardTabs 
                        lotissements={mockLotissements}
                        parcelles={mockParcelles}
                        utilisateurs={mockUtilisateurs}
                        activities={mockActivities}
                      />

                      <PerformanceSummary />
                    </div>
                  </main>
                </div>
               
        </ParcelleProvider>
      
      </BlocProvider>
    </LotissementsProvider>
    
  );
}