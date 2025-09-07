// components/proprietaire/ParcellesGrid.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ParcelleProprietaire, FilterOptions } from "@/types/ui/proprietaire";
import ParcelleCard from "./ParcelleCard";
import { useMemo } from "react";

interface ParcellesGridProps {
  parcelles: ParcelleProprietaire[];
  filters: FilterOptions;
  onViewDetails: (parcelle: ParcelleProprietaire) => void;
  onViewMap: (parcelle: ParcelleProprietaire) => void;
  onGeneratePDF: (parcelle: ParcelleProprietaire) => void;
  onExportAllPDF: () => void;
}

export default function ParcellesGrid({ 
  parcelles, 
  filters, 
  onViewDetails, 
  onViewMap, 
  onGeneratePDF,
  onExportAllPDF 
}: ParcellesGridProps) {
  
  const filteredParcelles = useMemo(() => {
    return parcelles.filter(parcelle => {
      // Filtre par lotissement
      if (filters.lotissement && parcelle.bloc.lotissement.nom !== filters.lotissement) {
        return false;
      }

      // Filtre par superficie minimum
      if (filters.superficieMin && parcelle.superficie < filters.superficieMin) {
        return false;
      }

      // Filtre par recherche (numéro de parcelle)
      if (filters.search && !parcelle.numero.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // // Filtre par statut
      // if (filters.statut && parcelle.statut !== filters.statut) {
      //   return false;
      // }

      return true;
    });
  }, [parcelles, filters]);

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Mes Parcelles ({filteredParcelles.length})
          </CardTitle>
          {/* <Button 
            onClick={onExportAllPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button> */}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {filteredParcelles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <FileText className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucune parcelle trouvée
            </h3>
            <p className="text-slate-500">
              Aucune parcelle ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParcelles.map((parcelle) => (
              <ParcelleCard
                key={parcelle.id}
                parcelle={parcelle}
                onViewDetails={onViewDetails}
                onViewMap={onViewMap}
                onGeneratePDF={onGeneratePDF}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}