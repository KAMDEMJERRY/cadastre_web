// components/dashboard/actions/LotissementActions.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Map, AlertTriangle } from "lucide-react";
import { LotissementData } from "@/types/ui/dashboard";
import { Lotissement } from "@/types/lotissement";
import { getStatutBadge } from "@/utils/badge-variants";

// ============= COMPOSANT DE VUE DÉTAILLÉE =============
interface ViewLotissementProps {
  lotissement: Lotissement;
}

export function ViewLotissement({ lotissement }: ViewLotissementProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Voir les détails">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du lotissement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {lotissement.nom}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatutBadge(lotissement.statut)}>
                  {lotissement.statut}
                </Badge>
                <span className="text-sm text-slate-500">
                  Créé le {lotissement.dateCreation}
                </span>
              </div>
            </div>

            {lotissement.adresse && (
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Adresse
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {lotissement.adresse}
                </p>
              </div>
            )}

            {lotissement.description && (
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {lotissement.description}
                </p>
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">Blocs</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {lotissement.nombreBlocs}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">Parcelles</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {lotissement.nombreParcelles}
              </p>
            </div>
          </div>

          {/* Mesures */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {lotissement.longueur && (
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Longueur
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {lotissement.longueur} m
                </p>
              </div>
            )}
            {lotissement.superficie_m2 && (
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Superficie
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {lotissement.superficie_m2} m²
                </p>
              </div>
            )}
            {lotissement.perimetre_m && (
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Périmètre
                </label>
                <p className="text-slate-900 dark:text-slate-100">
                  {lotissement.perimetre_m} m
                </p>
              </div>
            )}
          </div>

          {/* GeoJSON */}
          {lotissement.geom && (
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Données géométriques
              </label>
              <div className="mt-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-md max-h-32 overflow-y-auto">
                <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {typeof lotissement.geom === 'string' 
                    ? lotissement.geom.substring(0, 300)
                    : JSON.stringify(lotissement.geom, null, 2).substring(0, 300)
                  }
                  {(typeof lotissement.geom === 'string' ? lotissement.geom : JSON.stringify(lotissement.geom)).length > 300 && '...'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============= COMPOSANT DE SUPPRESSION =============
interface DeleteLotissementProps {
  lotissement: Lotissement;
  onDelete: (id: number) => Promise<void>;
}

export function DeleteLotissement({ lotissement, onDelete, getLotissements }: DeleteLotissementProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(lotissement.id);
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du lotissement');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Supprimer">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Confirmer la suppression
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-slate-600 dark:text-slate-400">
            Êtes-vous sûr de vouloir supprimer le lotissement{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              "{lotissement.name}"
            </span>{' '}
            ?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Cette action est irréversible et supprimera également tous les blocs et parcelles associés.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============= COMPOSANT DE CARTOGRAPHIE =============
interface MapLotissementProps {
  lotissement: Lotissement;
}

export function MapLotissement({ lotissement }: MapLotissementProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hasGeometry = lotissement.geom && lotissement.geom.trim() !== '';

  const renderMap = () => {
    if (!hasGeometry) {
      return (
        <div className="h-64 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg">
          <p className="text-slate-500">Aucune donnée géométrique disponible</p>
        </div>
      );
    }

    try {
      const geoData = typeof lotissement.geom === 'string' 
        ? JSON.parse(lotissement.geom) 
        : lotissement.geom;

      // Extraction des coordonnées pour centrer la carte
      let coordinates = [];
      if (geoData.type === 'Feature' && geoData.geometry) {
        coordinates = geoData.geometry.coordinates;
      } else if (geoData.type === 'Polygon') {
        coordinates = geoData.coordinates;
      } else if (geoData.type === 'FeatureCollection' && geoData.features?.[0]) {
        coordinates = geoData.features[0].geometry.coordinates;
      }

      // Calculer le centre approximatif
      let centerLat = 0, centerLng = 0, count = 0;
      if (coordinates?.[0]) {
        coordinates[0].forEach(([lng, lat]: [number, number]) => {
          centerLng += lng;
          centerLat += lat;
          count++;
        });
        centerLat /= count;
        centerLng /= count;
      }

      return (
        <div className="space-y-4">
          {/* Informations de localisation */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Informations de localisation
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Latitude:</span>
                <span className="ml-2 text-slate-900 dark:text-slate-50">
                  {centerLat ? centerLat.toFixed(6) : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Longitude:</span>
                <span className="ml-2 text-slate-900 dark:text-slate-50">
                  {centerLng ? centerLng.toFixed(6) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Placeholder pour la carte */}
          <div className="h-64 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
            <div className="text-center">
              <Map className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">Carte interactive</p>
              <p className="text-xs text-slate-400 mt-1">
                Intégration Leaflet/Mapbox à venir
              </p>
            </div>
          </div>

          {/* Actions de la carte */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Voir sur Google Maps
            </Button>
            <Button size="sm" variant="outline">
              Exporter coordonnées
            </Button>
            <Button size="sm" variant="outline">
              Centrer sur parcelle
            </Button>
          </div>

          {/* Données GeoJSON */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Données GeoJSON
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md max-h-48 overflow-y-auto">
              <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                {JSON.stringify(geoData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="h-64 bg-red-50 dark:bg-red-900/20 flex items-center justify-center rounded-lg">
          <p className="text-red-600 dark:text-red-400">
            Erreur dans le format des données géométriques
          </p>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Voir sur la carte">
          <Map className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cartographie - {lotissement.nom}</DialogTitle>
        </DialogHeader>
        
        {renderMap()}
      </DialogContent>
    </Dialog>
  );
}