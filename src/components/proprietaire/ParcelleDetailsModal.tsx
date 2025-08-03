// components/proprietaire/ParcelleDetailsModal.tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, FileText, Download, X } from "lucide-react";
import { ParcelleProprietaire } from "@/types/proprietaire";

interface ParcelleDetailsModalProps {
  parcelle: ParcelleProprietaire | null;
  isOpen: boolean;
  onClose: () => void;
  onGeneratePDF: (parcelle: ParcelleProprietaire) => void;
  onViewMap: (parcelle: ParcelleProprietaire) => void;
}

export default function ParcelleDetailsModal({ 
  parcelle, 
  isOpen, 
  onClose, 
  onGeneratePDF, 
  onViewMap 
}: ParcelleDetailsModalProps) {
  if (!parcelle) return null;

  const getStatusBadge = (statut: string) => {
    const variants = {
      'actif': 'bg-green-100 text-green-800',
      'en_attente': 'bg-orange-100 text-orange-800',
      'suspendu': 'bg-red-100 text-red-800'
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

  const infoSections = [
    {
      title: "Localisation",
      items: [
        { label: "Pays", value: parcelle.localisation.pays },
        { label: "Région", value: parcelle.localisation.region },
        { label: "Département", value: parcelle.localisation.departement },
        { label: "Arrondissement", value: parcelle.localisation.arrondissement },
        { label: "Quartier", value: parcelle.localisation.quartier }
      ]
    },
    {
      title: "Identification",
      items: [
        { label: "Numéro de parcelle", value: parcelle.numero },
        { label: "Nom du bloc", value: parcelle.bloc.nom },
        { label: "Lotissement", value: parcelle.bloc.lotissement.nom },
        { label: "Adresse", value: parcelle.bloc.lotissement.adresse }
      ]
    },
    {
      title: "Caractéristiques",
      items: [
        { label: "Superficie", value: `${parcelle.superficie.toLocaleString()} m²` },
        { label: "Périmètre", value: `${parcelle.perimetre} m` },
        { label: "Statut", value: getStatusLabel(parcelle.statut) },
        { label: "Plan de localisation", value: parcelle.planLocalisation ? "Disponible" : "Non disponible" }
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                Parcelle {parcelle.numero}
              </DialogTitle>
              <DialogDescription className="text-slate-600 mt-2">
                {parcelle.bloc.lotissement.nom} - {parcelle.bloc.nom}
              </DialogDescription>
            </div>
            <Badge className={getStatusBadge(parcelle.statut)}>
              {getStatusLabel(parcelle.statut)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {infoSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex flex-col space-y-1">
                    <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-slate-300"
          >
            <X className="h-4 w-4 mr-2" />
            Fermer
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onViewMap(parcelle)}
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Localiser sur la carte
          </Button>
          {parcelle.planLocalisation && (
            <Button 
              variant="outline" 
              onClick={() => window.open(parcelle.planLocalisation, '_blank')}
              className="border-green-300 text-green-600 hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Plan de localisation
            </Button>
          )}
          <Button 
            onClick={() => onGeneratePDF(parcelle)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Générer PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}