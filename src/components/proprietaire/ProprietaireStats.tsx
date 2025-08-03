// components/proprietaire/ProprietaireStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Layers, Home, CheckCircle } from "lucide-react";
import { StatsProprietaire } from "@/types/proprietaire";

interface ProprietaireStatsProps {
  stats: StatsProprietaire;
}

export default function ProprietaireStats({ stats }: ProprietaireStatsProps) {
  const getStatutIcon = (statut: string) => {
    return statut === 'à_jour' ? '✓' : statut === 'attente' ? '⏳' : '⚠️';
  };

  const getStatutColor = (statut: string) => {
    return statut === 'à_jour' ? 'text-green-600' : 
           statut === 'attente' ? 'text-orange-600' : 'text-red-600';
  };

  const statsConfig = [
    {
      title: "Total Parcelles",
      value: stats.totalParcelles,
      label: "Propriétés possédées",
      icon: MapPin,
      color: "text-blue-600"
    },
    {
      title: "Superficie Totale",
      value: stats.superficieTotale.toLocaleString(),
      label: "m² de terrain",
      icon: Layers,
      color: "text-green-600"
    },
    {
      title: "Lotissements",
      value: stats.nombreLotissements,
      label: "Différents lotissements",
      icon: Home,
      color: "text-purple-600"
    },
    {
      title: "Statut",
      value: getStatutIcon(stats.statutGeneral),
      label: stats.statutGeneral === 'à_jour' ? 'Toutes à jour' : 
             stats.statutGeneral === 'attente' ? 'En attente' : 'Action requise',
      icon: CheckCircle,
      color: getStatutColor(stats.statutGeneral)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300 hover:shadow-blue-100 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                  {stat.title}
                </h3>
                <IconComponent className="h-5 w-5 text-slate-400" />
              </div>
              <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}