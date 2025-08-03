// components/dashboard/tabs/ToolsTab.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, Download, FileText, Map, Navigation, Layers, MapPin, Users, Bell, 
  TrendingUp, Calendar, Settings, Activity, CheckCircle, Clock, Building2,
  AlertCircle
} from "lucide-react";

const toolsCategories = [
  {
    title: "Import/Export",
    description: "Gestion des données en lot",
    icon: Upload,
    tools: [
      { icon: Upload, label: "Importer des parcelles (CSV)" },
      { icon: Download, label: "Exporter toutes les données" },
      { icon: FileText, label: "Générer rapport complet" }
    ]
  },
  {
    title: "Cartographie",
    description: "Outils géospatiaux",
    icon: Map,
    tools: [
      { icon: Navigation, label: "Vue cartographique complète" },
      { icon: Layers, label: "Gestionnaire de couches" },
      { icon: MapPin, label: "Calculateur de surface" }
    ]
  },
  {
    title: "Administration",
    description: "Configuration système",
    icon: Settings,
    tools: [
      { icon: Users, label: "Gestion des rôles" },
      { icon: Bell, label: "Configuration notifications" },
      { icon: FileText, label: "Logs système" }
    ]
  },
  {
    title: "Statistiques Avancées",
    description: "Analyses et rapports",
    icon: TrendingUp,
    tools: [
      { icon: Calendar, label: "Rapports mensuels" },
      { icon: TrendingUp, label: "Analyse des ventes" },
      { icon: MapPin, label: "Statistiques par zone" }
    ]
  },
  {
    title: "Maintenance",
    description: "Outils de maintenance",
    icon: AlertCircle,
    tools: [
      { icon: CheckCircle, label: "Vérifier intégrité des données" },
      { icon: Clock, label: "Sauvegarde automatique" },
      { icon: Settings, label: "Optimiser base de données" }
    ]
  },
  {
    title: "Documents & PDF",
    description: "Génération de documents",
    icon: FileText,
    tools: [
      { icon: FileText, label: "Attestations de propriété" },
      { icon: Building2, label: "Plans de lotissement" },
      { icon: MapPin, label: "Certificats de localisation" }
    ]
  }
];

export default function ToolsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolsCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-50">
                  <IconComponent className="h-5 w-5" />
                  <span>{category.title}</span>
                </CardTitle>
                <CardDescription>
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.tools.map((tool, toolIndex) => {
                  const ToolIcon = tool.icon;
                  return (
                    <Button key={toolIndex} variant="outline" className="w-full justify-start">
                      <ToolIcon className="h-4 w-4 mr-2" />
                      {tool.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Section indicateurs de santé système */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-50">
            <Activity className="h-5 w-5" />
            <span>État du Système</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.8%</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Disponibilité</p>
              <div className="mt-2">
                <Progress value={99.8} className="h-2" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1.2GB</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Stockage utilisé</p>
              <div className="mt-2">
                <Progress value={24} className="h-2" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">156ms</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Temps de réponse moyen</p>
              <div className="mt-2">
                <Progress value={68} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}