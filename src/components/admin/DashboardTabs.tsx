// components/dashboard/DashboardTabs.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LotissementData, ParcelleData, UtilisateurData, ActivityData } from "@/types/ui/dashboard";
import LotissementsTab from "./tabs/LotissementsTab";
import ParcellesTab from "./tabs/ParcellesTab";
import UtilisateursTab from "./tabs/UtilisateursTab";
import ToolsTab from "./tabs/ToolsTab";
import BlocsTab from "./tabs/BlocsTab";
import FilterDialog from "./FilterDialog";
import { useUser } from "@/hooks/useUser";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface DashboardTabsProps {
  lotissements: LotissementData[];
  parcelles: ParcelleData[];
  utilisateurs: UtilisateurData[];
  activities: ActivityData[];
}

export default function DashboardTabs({
  lotissements,
  parcelles,
  utilisateurs,
  activities,
}: DashboardTabsProps) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("lotissements");

  // Configuration des champs de recherche par onglet
  const getSearchFields = (tab: string) => {
    switch (tab) {
      case 'lotissements':
        return ['name', 'addresse'];
      case 'parcelles':
        return ['numero', 'proprietaire', 'lotissement'];
      case 'proprietaires':
      case 'administrateurs':
        return ['full_name', 'email', 'username', 'num_telephone'];
      case 'blocs':
        return ['name', 'lotissement'];
      default:
        return [];
    }
  };

  // Obtenir les données selon l'onglet actif
  const getCurrentData = () => {
    switch (activeTab) {
      case 'lotissements':
        return lotissements;
      case 'parcelles':
        return parcelles;
      case 'proprietaires':
      case 'administrateurs':
        return utilisateurs;
      case 'blocs':
        return []; // À remplacer par vos données de blocs
      default:
        return [];
    }
  };

  const {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    filteredItems,
    isFilterOpen,
    setIsFilterOpen,
    resetFilters,
    resultsCount,
    totalCount
  } = useSearchFilter(
    getCurrentData(),
    getSearchFields(activeTab),
    activeTab
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Réinitialiser la recherche et les filtres lors du changement d'onglet
    setSearchQuery('');
    resetFilters();
  };

  return (
    <Tabs key="dashboard-tabs" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList className="flex w-full justify-between bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger value="lotissements" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Lotissements
          </TabsTrigger>
          <TabsTrigger value="blocs" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Blocs
          </TabsTrigger>
          <TabsTrigger value="parcelles" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Parcelles
          </TabsTrigger>
          {(user?.role === "agent" || user?.role === "admin") && (
            <TabsTrigger value="proprietaires" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              Proprietaires
            </TabsTrigger>
          )}
          {user?.role === "admin" && (
            <TabsTrigger value="administrateurs" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              Administrateurs
            </TabsTrigger>
          )}
          <TabsTrigger value="outils" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Outils
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center space-x-2 ml-4">
          <Input 
            placeholder="Rechercher..." 
            className="w-64" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FilterDialog
            activeTab={activeTab}
            filters={filters}
            onUpdateFilter={updateFilter}
            onResetFilters={resetFilters}
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            resultsCount={resultsCount}
            totalCount={totalCount}
          />
        </div>
      </div>

      {/* Affichage des filtres actifs */}
      {(searchQuery || Object.values(filters).some(f => f !== 'all')) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-600">Filtres actifs :</span>
          
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Recherche: "{searchQuery}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchQuery('')}
              />
            </Badge>
          )}
          
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Statut: {filters.status === 'active' ? 'Actifs' : 'Inactifs'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('status', 'all')}
              />
            </Badge>
          )}
          
          {filters.role !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Rôle: {filters.role}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('role', 'all')}
              />
            </Badge>
          )}
          
          {filters.dateRange !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Période: {filters.dateRange === 'today' ? "Aujourd'hui" : 
                       filters.dateRange === 'week' ? 'Cette semaine' : 'Ce mois'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('dateRange', 'all')}
              />
            </Badge>
          )}

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-red-600 hover:text-red-700"
          >
            Tout effacer
          </Button>
        </div>
      )}

      {/* Compteur de résultats */}
      {(searchQuery || Object.values(filters).some(f => f !== 'all')) && (
        <div className="text-sm text-slate-600">
          <strong>{resultsCount}</strong> résultat(s) sur <strong>{totalCount}</strong>
        </div>
      )}

      <TabsContent value="lotissements">
        <LotissementsTab  />
      </TabsContent>

      <TabsContent value="blocs">
        <BlocsTab  />
      </TabsContent>

      <TabsContent value="parcelles">
        <ParcellesTab />
      </TabsContent>

      <TabsContent value="proprietaires">
        <UtilisateursTab  userType="proprietaire" />
      </TabsContent>

      <TabsContent value="administrateurs">
        <UtilisateursTab userType="admin" />
      </TabsContent>

      <TabsContent value="outils">
        <ToolsTab />
      </TabsContent>
    </Tabs>
  );
}