// components/dashboard/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, MapPin, Layers } from "lucide-react";
import { StatsData } from "@/types/ui/dashboard";

interface StatsCardsProps {
  stats: StatsData;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statsConfig = [
    {
      title: "Lotissements",
      value: stats.totalLotissements,
      icon: Building2,
      badge: "+3 ce mois",
      badgeClass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    },
    {
      title: "Blocs",
      value: stats.totalBlocs,
      icon: Layers,
      badge: "+12 ce mois",
      badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    },
    {
      title: "Parcelles Totales",
      value: stats.totalParcelles,
      icon: MapPin,
      subtitle: `${stats.parcellesVendues} vendues • ${stats.parcellesLibres} libres`
    },
    {
      title: "Utilisateurs/Propriétaires",
      value: stats.totalUtilisateurs,
      icon: Users,
      badge: `+${stats.croissanceMensuelle}%`,
      badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stat.title}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</div>
              {stat.badge && (
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={stat.badgeClass}>
                    {stat.badge}
                  </Badge>
                </div>
              )}
              {stat.subtitle && (
                <div className="text-xs text-slate-500 mt-1">
                  {stat.subtitle}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}