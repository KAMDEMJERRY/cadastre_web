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
  mockActivities 
} from "@/data/mockData";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardHeader />

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
    </div>
  );
}