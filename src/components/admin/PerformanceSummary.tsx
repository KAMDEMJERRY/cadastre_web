// components/dashboard/PerformanceSummary.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar } from "lucide-react";

export default function PerformanceSummary() {
  const performanceData = [
    { label: "Nouvelles ventes", value: "+15%", description: "Ce mois" },
    { label: "Utilisateurs actifs", value: "+8%", description: "Ce mois" },
    { label: "Revenus", value: "+23%", description: "Ce mois" }
  ];

  const scheduledActions = [
    {
      title: "Sauvegarde hebdomadaire",
      schedule: "Prochaine: Dimanche 23:00",
      status: "Programmée",
      statusClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    },
    {
      title: "Rapport mensuel",
      schedule: "À générer: 31 janvier",
      status: "En attente",
      statusClass: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Performance ce Mois</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            {performanceData.map((item, index) => (
              <div key={index}>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-sm text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-50">
            <Calendar className="h-5 w-5" />
            <span>Actions Planifiées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">{action.title}</p>
                  <p className="text-sm text-slate-500">{action.schedule}</p>
                </div>
                <Badge className={action.statusClass}>
                  {action.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}