// components/proprietaire/ParcelleCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, FileText } from "lucide-react";
import { ParcelleProprietaire } from "@/types/proprietaire";

interface ParcelleCardProps {
  parcelle: ParcelleProprietaire;
  onViewDetails: (parcelle: ParcelleProprietaire) => void;
  onViewMap: (parcelle: ParcelleProprietaire) => void;
  onGeneratePDF: (parcelle: ParcelleProprietaire) => void;
}

export default function ParcelleCard({ 
  parcelle, 
  onViewDetails, 
  onViewMap, 
  onGeneratePDF 
}: ParcelleCardProps) {
  const getStatusBadge = (statut: string) => {
    const variants = {
      'actif': 'bg-green-100 text-green-800 hover:bg-green-200',
      'en_attente': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      'suspendu': 'bg-red-100 text-red-800 hover:bg-red-200'
    };
    return variants[statut as keyof typeof variants] || variants.actif;
  };

  const getStatusLabel = (statut: string) => {
    const labels = {
      'actif': 'Actif',
      'en_attente': 'En attente',
      'suspendu': 'Suspendu'
    };
    return labels[statut as keyof typeof labels] || 'Actif';
  };

  return (
    <Card className="bg-slate-50 border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Parcelle {parcelle.numero}
          </h3>
          <Badge className={getStatusBadge(parcelle.statut)}>
            {getStatusLabel(parcelle.statut)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
              Lotissement
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {parcelle.bloc.lotissement.nom}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
              Bloc
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {parcelle.bloc.nom}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
              Superficie
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {parcelle.superficie.toLocaleString()} m²
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
              Périmètre
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {parcelle.perimetre} m
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button 
            onClick={() => onViewDetails(parcelle)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir détails
          </Button>
          <Button 
            onClick={() => onViewMap(parcelle)}
            variant="outline"
            size="sm"
            className="border-slate-300 hover:bg-slate-50"
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => onGeneratePDF(parcelle)}
            variant="outline"
            size="sm"
            className="border-slate-300 hover:bg-slate-50"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}