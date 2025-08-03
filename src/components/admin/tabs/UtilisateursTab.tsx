// components/dashboard/tabs/UtilisateursTab.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Eye, Edit, Trash2 } from "lucide-react";
import { UtilisateurData } from "@/types/dashboard";
import { getStatutBadge } from "@/utils/badge-variants";

interface UtilisateursTabProps {
  utilisateurs: UtilisateurData[];
}

export default function UtilisateursTab({ utilisateurs }: UtilisateursTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Gestion des Utilisateurs</h3>
        <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>
      
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CNI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parcelles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {utilisateurs.map((utilisateur) => (
                  <tr key={utilisateur.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback>{utilisateur.nom.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium text-slate-900 dark:text-slate-50">{utilisateur.nom}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {utilisateur.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {utilisateur.cni}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatutBadge(utilisateur.type)}>
                        {utilisateur.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-50 text-center">
                      {utilisateur.nombreParcelles}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatutBadge(utilisateur.statut)}>
                        {utilisateur.statut}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}