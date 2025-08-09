// components/dashboard/DashboardTabs.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { LotissementData, ParcelleData, UtilisateurData, ActivityData } from "@/types/ui/dashboard";
import LotissementsTab from "./tabs/LotissementsTab";
import ParcellesTab from "./tabs/ParcellesTab";
import UtilisateursTab from "./tabs/UtilisateursTab";
import ToolsTab from "./tabs/ToolsTab";
import BlocsTab from "./tabs/BlocsTab";

interface DashboardTabsProps {
  lotissements: LotissementData[];
  parcelles: ParcelleData[];
  utilisateurs: UtilisateurData[];
  activities: ActivityData[];
}

export default function DashboardTabs({  
  parcelles, 
  utilisateurs, 
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="lotissements" className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList className="grid w-full max-w-2xl grid-cols-5 bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="lotissements" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Lotissements
          </TabsTrigger>
          <TabsTrigger value="blocs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Blocs
          </TabsTrigger>
          <TabsTrigger value="parcelles" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Parcelles
          </TabsTrigger>
          <TabsTrigger value="utilisateurs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Utilisateurs
          </TabsTrigger>
          {/* <TabsTrigger value="activite" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Activité
          </TabsTrigger> */}
          <TabsTrigger value="outils" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Outils
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center space-x-2">
          <Input placeholder="Rechercher..." className="w-64" />
          <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>
      </div>

      <TabsContent value="lotissements">
        <LotissementsTab  />
      </TabsContent>

      <TabsContent value="blocs">
        <BlocsTab  />
      </TabsContent>

      <TabsContent value="parcelles">
        <ParcellesTab parcelles={parcelles} />
      </TabsContent>

      <TabsContent value="utilisateurs">
        <UtilisateursTab utilisateurs={utilisateurs} />
      </TabsContent>

      {/* <TabsContent value="activite">
        <ActivityTab activities={activities} />
      </TabsContent> */}

      <TabsContent value="outils">
        <ToolsTab />
      </TabsContent>
    </Tabs>
  );
}