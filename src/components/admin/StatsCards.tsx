// components/dashboard/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Layers, MapPin, Users } from "lucide-react";
import { useLotissement } from "@/hooks/useLotissementAdmin";
import { useBloc } from "@/hooks/useBlocsAdmin";
import { useParcelle } from "@/hooks/useParcellesAdmin";
import { useUsers } from "@/hooks/useUser";

export default function StatsCards() {
  // Récupération des données
  const { lotissements, loading: loadingLotissements } = useLotissement();
  const { blocs, loading: loadingBlocs } = useBloc();
  const { parcelles, loading: loadingParcelles } = useParcelle();
  const { users, loading: loadingUsers } = useUsers();

  // Filtre des propriétaires seulement
  const proprietaires = users?.filter(user => user.role === 'proprietaire') || [];

  // Configuration des cartes de stats
  const statsConfig = [
    {
      title: "Lotissements",
      value: loadingLotissements ? '-' : lotissements?.length,
      icon: Building2,
      color: "text-green-500"
    },
    {
      title: "Blocs",
      value: loadingBlocs ? '-' : blocs?.length,
      icon: Layers,
      color: "text-blue-500"
    },
    {
      title: "Parcelles",
      value: loadingParcelles ? '-' : parcelles?.length,
      icon: MapPin,
      color: "text-orange-500"
    },
    {
      title: "Propriétaires",
      value: loadingUsers ? '-' : proprietaires.length,
      icon: Users,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}