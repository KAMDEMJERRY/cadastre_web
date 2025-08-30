// components/dashboard/tabs/LotissementsTab.tsx
import { Card, CardContent } from "@/components/ui/card";
import LotissementForm from "../LotissementForm";
import { ViewLotissement, DeleteLotissement, MapLotissement } from "../LotissementActions";
import { useLotissement } from "@/hooks/useLotissementAdmin";

export default function LotissementsTab() {
  const {lotissements, deleteLotissement, nombreBlocs, nombreParcelles} = useLotissement();
  console.log("TabLotissement");  
  console.log(nombreBlocs, nombreParcelles);
  console.log("TabLotissement");  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Gestion des Lotissements
        </h3>
        
        <LotissementForm mode="create" />
      </div>
      
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
           <div className="rounded-md border overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Adresse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Blocs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parcelles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {lotissements?.map((lotissement) => {
                    console.log(lotissement);
                    return (
                      <tr key={lotissement.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900 dark:text-slate-50">{lotissement.name}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Créé le {lotissement.created_at}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {lotissement.addresse}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-50">
                          {nombreBlocs.get(lotissement.id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-50">
                          {nombreParcelles.get(lotissement.id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <div className="flex items-center space-x-2">
                            <ViewLotissement lotissement={lotissement} />
                            <LotissementForm mode="edit" lotissement={lotissement} />
                            <MapLotissement lotissement={lotissement} />
                            <DeleteLotissement lotissement={lotissement} onDelete={deleteLotissement} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {(!lotissements || lotissements.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                        Aucun lotissement trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}