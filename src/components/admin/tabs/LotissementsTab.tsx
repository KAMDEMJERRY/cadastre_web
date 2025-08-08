// components/dashboard/tabs/LotissementsTab.tsx
import { Card, CardContent } from "@/components/ui/card";
import LotissementForm from "../LotissementForm";
import { ViewLotissement, DeleteLotissement, MapLotissement } from "../LotissementActions";
import { useLotissement } from "@/hooks/useLotissementAdmin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function LotissementsTab() {
  const {lotissements,createLotissement, fetchLotissements, updateLotissement ,deleteLotissement, nombreBlocs, nombreParcelles} = useLotissement();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Gestion des Lotissements
        </h3>
        
        <LotissementForm 
          mode="create" 
          createLotissement={createLotissement}
          updateLotissement={updateLotissement}
          fetchLotissements={fetchLotissements}

        />
      </div>
      
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
           <div className="rounded-md border overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Blocs</TableHead>
                    <TableHead>Parcelles</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lotissements?.map((lotissement) => (
                    <TableRow key={lotissement.id}>
                      <TableCell>
                        <div className="font-medium">{lotissement.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Créé le {lotissement.created_at}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lotissement.addresse}
                      </TableCell>
                      <TableCell>
                        {nombreBlocs.get(lotissement.id)}
                      </TableCell>
                      <TableCell>
                        {nombreParcelles.get(lotissement.id)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ViewLotissement lotissement={lotissement} />
                          <LotissementForm mode="edit" lotissement={lotissement} />
                          <MapLotissement lotissement={lotissement} />
                          <DeleteLotissement lotissement={lotissement} onDelete={deleteLotissement} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!lotissements || lotissements.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Aucun lotissement trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}