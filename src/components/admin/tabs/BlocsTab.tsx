// components/dashboard/tabs/BlocsTab.tsx
import { Card, CardContent } from "@/components/ui/card";
import BlocForm from "../BlocForm";
import { ViewBloc, DeleteBloc, MapBloc } from "../BlocActions";
import { useBloc } from "@/hooks/useBlocsAdmin";
import { Bloc } from "@/types/bloc";
import { useLotissement } from "@/hooks/useLotissementAdmin";

export default function BlocsTab() {
  const { blocs, deleteBloc, nombreParcelles } = useBloc();
  const {lotissements} = useLotissement();
  // Ajoutez ce log pour débugger
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Gestion des Blocs
        </h3>
        
        <BlocForm mode="create" />
      </div>
      
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto max-h-96">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lotissement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parcelles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                { blocs?.map((bloc:Bloc) => {
                  console.log(bloc);
                  const lotissement = lotissements?.find(lotissement => lotissement.id === bloc.bloc_lotissement);

                  return (
                    <tr key={bloc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900 dark:text-slate-50">{bloc.name}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Créé le {bloc.created_at}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {bloc.description || "Aucune description"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-50">
                        {lotissement?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-50">
                        {nombreParcelles?.get(bloc.id) || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <div className="flex items-center space-x-2">
                          <ViewBloc bloc={bloc} />
                          <BlocForm mode="edit" bloc={bloc} />
                          <MapBloc bloc={bloc} />
                          <DeleteBloc bloc={bloc} onDelete={deleteBloc} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(!blocs || blocs.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                      Aucun bloc trouvé
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