// components/dashboard/tabs/ActivityTab.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, MoreVertical } from "lucide-react";
import { ActivityData } from "@/types/dashboard";

interface ActivityTabProps {
  activities: ActivityData[];
}

export default function ActivityTab({ activities }: ActivityTabProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-50">
          <Activity className="h-5 w-5" />
          <span>Activité Récente du Système</span>
        </CardTitle>
        <CardDescription>
          Suivi des dernières opérations sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className={`p-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                  activity.type === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 
                  'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400'
                }`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{activity.action}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{activity.details}</p>
                  <p className="text-xs text-slate-500">Par {activity.user} • {activity.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}