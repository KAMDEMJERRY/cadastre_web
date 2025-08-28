// components/dashboard/ParcelleActions.tsx
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, FileText, Download, MapPin, Square, Ruler, User as UserIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Parcelle } from "@/types/parcelle";
import { Bloc } from "@/types/bloc";
import { User } from "@/types/user";

interface ParcelleActionProps {
  parcelle: Parcelle;
}

interface DeleteParcelleProps extends ParcelleActionProps {
  onDelete: (parcelleId: number) => void;
}

// Helper functions pour extraire les informations
const getBlocInfo = (parcelle_bloc: number | Bloc) => {
  if (typeof parcelle_bloc === 'object') {
    return {
      name: parcelle_bloc.name,
      lotissement: typeof parcelle_bloc.bloc_lotissement === 'object' 
        ? parcelle_bloc.bloc_lotissement.name 
        : 'N/A'
    };
  }
  return {
    name: `Bloc ${parcelle_bloc}`,
    lotissement: 'N/A'
  };
};

const getProprietaireInfo = (proprietaire: number | User) => {
  if (typeof proprietaire === 'object') {
    return {
      name: proprietaire.full_name,
      email: proprietaire.email,
      role: proprietaire.role
    };
  }
  return {
    name: 'Non assigné',
    email: '',
    role: ''
  };
};

const formatSuperficie = (superficie: number) => {
  return superficie.toLocaleString('fr-FR') + ' m²';
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function ViewParcelle({ parcelle }: ParcelleActionProps) {
  const blocInfo = getBlocInfo(parcelle.parcelle_bloc);
  const proprietaireInfo = getProprietaireInfo(parcelle.proprietaire);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Square className="h-5 w-5 text-blue-500" />
            Parcelle {parcelle.name}
          </DialogTitle>
          <DialogDescription>
            Informations détaillées de la parcelle (ID: {parcelle.id})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 max-h-[600px] overflow-y-auto">
          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-slate-700">Nom de la parcelle:</span>
              <p className="text-slate-900 font-medium">{parcelle.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700">ID Parcelle:</span>
              <p className="text-slate-900 font-mono">{parcelle.id}</p>
            </div>
          </div>

          {/* Localisation */}
          <Separator />
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localisation
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-slate-700">Bloc:</span>
                <p className="text-slate-900">{blocInfo.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Lotissement:</span>
                <p className="text-slate-900">{blocInfo.lotissement}</p>
              </div>
            </div>
          </div>

          {/* Propriétaire */}
          <Separator />
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Propriétaire
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-slate-700">Nom complet:</span>
                <p className="text-slate-900">{proprietaireInfo.name}</p>
              </div>
              {proprietaireInfo.email && (
                <div>
                  <span className="text-sm font-medium text-slate-700">Email:</span>
                  <p className="text-slate-900">{proprietaireInfo.email}</p>
                </div>
              )}
              {proprietaireInfo.role && (
                <div>
                  <span className="text-sm font-medium text-slate-700">Rôle:</span>
                  <Badge variant="secondary">{proprietaireInfo.role}</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Dimensions et caractéristiques */}
          <Separator />
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Dimensions
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-slate-700">Superficie:</span>
                <p className="text-slate-900 font-medium text-lg text-blue-600">
                  {formatSuperficie(parcelle.superficie_m2)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Périmètre:</span>
                <p className="text-slate-900">{parcelle.perimetre_m} m</p>
              </div>
            </div>
            
            {/* {parcelle.longeur && (
              <div className="mt-2">
                <span className="text-sm font-medium text-slate-700">Longueur:</span>
                <p className="text-slate-900">{parcelle.longeur} m</p>
              </div>
            )} */}
          </div>

          {/* Géométrie */}
          <Separator />
          <div>
            <span className="text-sm font-medium text-slate-700">Géométrie:</span>
            <div className="mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              <Badge variant={parcelle.geometry ? "default" : "secondary"}>
                {parcelle.geometry ? "Géométrie définie" : "Géométrie non définie"}
              </Badge>
            </div>
            {parcelle.geometry && (
              <p className="text-xs text-slate-600 mt-1">
                Type: {parcelle.geometry.type} • Coordonnées disponibles
              </p>
            )}
          </div>

          {/* Dates */}
          <Separator />
          <div className="space-y-3">
            {parcelle.created_at && (
              <div>
                <span className="text-sm font-medium text-slate-700">Date de création:</span>
                <p className="text-sm text-slate-600">{formatDate(parcelle.created_at)}</p>
              </div>
            )}
            {parcelle.updated_at && (
              <div>
                <span className="text-sm font-medium text-slate-700">Dernière modification:</span>
                <p className="text-sm text-slate-600">{formatDate(parcelle.updated_at)}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EditParcelle({ parcelle }: ParcelleActionProps) {
  return (
    <Button variant="ghost" size="sm" className="hover:bg-orange-50 hover:text-orange-600">
      <Edit className="h-4 w-4" />
    </Button>
  );
}

export function DeleteParcelle({ parcelle, onDelete }: DeleteParcelleProps) {
  const handleDelete = () => {
    onDelete(parcelle.id);
  };

  const blocInfo = getBlocInfo(parcelle.parcelle_bloc);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer la parcelle{' '}
            <span className="font-semibold">&quot;{parcelle.name}&quot;</span> (ID: {parcelle.id}){' '}
            du {blocInfo.name} ? 
            <br />
            <br />
            Cette action est irréversible et supprimera toutes les données associées :
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Informations de la parcelle ({formatSuperficie(parcelle.superficie_m2)})</li>
              <li>Géométrie et coordonnées</li>
              <li>Association avec le propriétaire</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}