/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/DashboardTabs.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LotissementsTab from "./tabs/LotissementsTab";
import ParcellesTab from "./tabs/ParcellesTab";
import UtilisateursTab from "./tabs/UtilisateursTab";
import ToolsTab from "./tabs/ToolsTab";
import BlocsTab from "./tabs/BlocsTab";
import FilterDialog from "./FilterDialog";
import { useUser, useUsers } from "@/hooks/useUser";
import { filterStrategies, useTabFilter } from "@/hooks/useSearchFilter";

import { useLotissement } from "@/hooks/useLotissementAdmin";
import { useParcelle } from "@/hooks/useParcellesAdmin";
import { useBloc } from "@/hooks/useBlocsAdmin";
import { DashboardFilterProps } from "@/app/dashboard/admin/types/filters";



export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<keyof typeof filterStrategies>("lotissements");
  const { users } = useUsers();
  const { lotissements } = useLotissement();
  const { parcelles } = useParcelle();
  const { blocs } = useBloc();

  const getCurrentData = () => {
    switch (activeTab) {
      case "lotissements": return lotissements ?? [];
      case "parcelles": return parcelles ?? [];
      case "proprietaires":
      case "administrateurs": return users ?? [];
      case "blocs": return blocs ?? [];
      default: return [];
    }
  };

  const {
    filteredData,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
    resultsCount,
    totalCount,
    isFilterOpen,
    setIsFilterOpen
  } = useTabFilter(
    activeTab,
    getCurrentData() as any
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as keyof typeof filterStrategies);
    setSearchQuery("");
    resetFilters?.();
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
      <TableHeader
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        resultsCount={resultsCount}
        totalCount={totalCount}
      />
{/* 
      <TableFilterBadges
        searchQuery={searchQuery}
        filters={filters}
        setSearchQuery={setSearchQuery}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        resultsCount={resultsCount}
        totalCount={totalCount}
      /> */}

      <TableContent activeTab={activeTab} filteredItems={filteredData} />
    </Tabs>
  );
}
function TableHeader({
    activeTab,
  searchQuery,
  setSearchQuery,
  filters,
  updateFilter,
  resetFilters,
  isFilterOpen,
  setIsFilterOpen,
  resultsCount,
  totalCount
}:DashboardFilterProps) {

  
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between">
      <TabsList className="flex w-full justify-between bg-slate-100 dark:bg-slate-800 p-1">
        <TabsTrigger
          value="lotissements"
          className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
        >
          Lotissements
        </TabsTrigger>

        <TabsTrigger
          value="blocs"
          className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
        >
          Blocs
        </TabsTrigger>

        <TabsTrigger
          value="parcelles"
          className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
        >
          Parcelles
        </TabsTrigger>

        {(user?.role === "agent" || user?.role === "admin") && (
          <TabsTrigger
            value="proprietaires"
            className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
          >
            Proprietaires
          </TabsTrigger>
        )}

        {user?.role === "admin" && (
          <TabsTrigger
            value="administrateurs"
            className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
          >
            Administrateurs
          </TabsTrigger>
        )}

        <TabsTrigger
          value="outils"
          className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
        >
          Outils
        </TabsTrigger>
      </TabsList>

        {/* <div className="flex items-center space-x-2 ml-4">
        <Input
          placeholder="Rechercher..."
          className="w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
   {updateFilter && resetFilters && setIsFilterOpen && (
  <FilterDialog
    activeTab={activeTab}
    filters={filters}
    onUpdateFilter={updateFilter}
    onResetFilters={resetFilters}
    isOpen={isFilterOpen ?? false}
    setIsOpen={setIsFilterOpen}
    resultsCount={resultsCount ?? 0}
    totalCount={totalCount ?? 0}
  />
)}
    </div> */}
    </div>
  );
}


function TableContent({
  activeTab,
  filteredItems
}: {
  activeTab: string;
  filteredItems: any[];
}) {
  return (
    <>
      <TabsContent value="lotissements">
        <LotissementsTab />
      </TabsContent>

      <TabsContent value="blocs">
        <BlocsTab />
      </TabsContent>

      <TabsContent value="parcelles">
        <ParcellesTab />
      </TabsContent>

      <TabsContent value="proprietaires">
        <UtilisateursTab userType="proprietaire" />
      </TabsContent>

      <TabsContent value="administrateurs">
        <UtilisateursTab userType="admin" />
      </TabsContent>

      <TabsContent value="outils">
        <ToolsTab />
      </TabsContent>
    </>
  );
}




