// components/dashboard/ParcelleActions.tsx
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  FileText,
  Download,
  MapPin,
  Square,
  Ruler,
  User as UserIcon,
} from "lucide-react";
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
import { useUsers } from "@/hooks/useUser";
import { useBloc } from "@/hooks/useBlocsAdmin";
import { useLotissement } from "@/hooks/useLotissementAdmin";
import { documentService } from "@/services/api/document";
import { useEffect, useState } from "react";

interface ParcelleActionProps {
  parcelle: Parcelle;
}

interface DeleteParcelleProps extends ParcelleActionProps {
  onDelete: (parcelleId: number) => void;
}

// Helper functions pour extraire les informations
const getBlocInfo = (parcelle_bloc: number | Bloc) => {
  if (typeof parcelle_bloc === "object") {
    return {
      name: parcelle_bloc.name,
      lotissement:
        typeof parcelle_bloc.bloc_lotissement === "object"
          ? parcelle_bloc.bloc_lotissement.name
          : "N/A",
    };
  }
  return {
    name: `Bloc ${parcelle_bloc}`,
    lotissement: "N/A",
  };
};

const getProprietaireInfo = (proprietaire: number | User) => {
  if (typeof proprietaire === "object") {
    return {
      name: proprietaire.full_name,
      email: proprietaire.email,
      role: proprietaire.role,
    };
  }
  return {
    name: "Non assigné",
    email: "",
    role: "",
  };
};

const formatSuperficie = (superficie: number) => {
  return superficie.toLocaleString("fr-FR") + " m²";
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ViewParcelle({ parcelle }: ParcelleActionProps) {
  const [planLoc, setPlanLoc] = useState<string>();
  const { users } = useUsers();
  const { blocs } = useBloc();
  const { lotissements } = useLotissement();
  const proprietaireInfo = getProprietaireInfo(parcelle.proprietaire);
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await documentService.getByParcelleId(parcelle.id);
        if (response) setPlanLoc(response.document);
      } catch (e) {
        console.log("Pas de Plan de localisation pour cette parcelle");
      }
    };
    fetchPlan();
  }, [parcelle]);

  const downloadParcelDoc = () => {
    try {
      const doc = planLoc;
      if (!doc) throw "Erreur pas de plan de localisation";
      const link = document.createElement("a");
      link.href = doc || "";
      link.download = `document_parcelle_${parcelle.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Erreur lors du telechargement:", error);
    }
  };
  const getLotissementName = (parcelle_bloc: number | Bloc): string => {
    if (typeof parcelle_bloc === "object") {
      if (typeof parcelle_bloc.bloc_lotissement === "object") {
        return parcelle_bloc.bloc_lotissement.name;
      }
      const bloc = blocs?.find((b) => b.id === parcelle_bloc.id);
      if (bloc && typeof bloc.bloc_lotissement === "object") {
        return bloc.bloc_lotissement.name;
      }
      return "N/A";
    }

    const bloc = blocs?.find((b) => b.id === parcelle_bloc);
    if (bloc && typeof bloc.bloc_lotissement === "object") {
      return bloc.bloc_lotissement.name;
    }
    const lotissement = lotissements?.find((lot) => lot.id == bloc?.id);
    return lotissement?.name || "N/A";
  };

  const getBlocName = (parcelle_bloc: number | Bloc) => {
    if (typeof parcelle_bloc === "object") return parcelle_bloc.name;
    const bloc = blocs?.find((b) => b.id === parcelle_bloc);
    return bloc?.name;
  };
  const getProprietaire = (proprietaire: number): User => {
    const user = users?.find((u) => u.id === proprietaire);
    return user!;
  };
  const proprietaire = getProprietaire(parcelle.proprietaire as number);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-blue-50 hover:text-blue-600"
        >
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
            Informations détaillées de la parcelle
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[600px] overflow-y-auto">
          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-slate-700">
                Nom de la parcelle:
              </span>
              <p className="text-slate-900 font-medium">{parcelle.name}</p>
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
                <span className="text-sm font-medium text-slate-700">
                  Bloc:
                </span>
                <p className="text-slate-900">
                  {getBlocName(parcelle.parcelle_bloc)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">
                  Lotissement:
                </span>
                <p className="text-slate-900">
                  {getLotissementName(parcelle.parcelle_bloc)}
                </p>
              </div>
              <div className="flex gap-6">
                <span className="text-sm font-medium text-slate-700">
                  Plan de Localisation:
                </span>
                {planLoc ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => downloadParcelDoc()}
                    className="mt-1"
                  >
                    Télécharger le plan
                  </Button>
                ) : (
                  <span className="text-sm font-sm">Non renseigne</span>
                )}
              </div>
            </div>
          </div>

          {/* Propriétaire */}
          <Separator />
          <div >
            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Propriétaire
            </h4>
           
            <div className=" grid grid-cols-2 gap-4 ">
              <div>
                <span className="text-sm font-medium text-slate-700">
                  Nom complet: 
                </span>
                <p className="text-slate-900">{proprietaire.username|| ""}</p>
              </div>
              {proprietaire.email && (
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Email: 
                  </span>
                  <p className="text-slate-900">{proprietaire.email}</p>
                </div>
              )}
              {proprietaire.num_telephone && (
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    TEL: 
                  </span>
                  <p className="text-slate-900">{proprietaire.num_telephone}</p>
                </div>
              )}
              {proprietaire.id_cadastrale && (
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    ID_CADASTRALE: 
                  </span>
                  <p className="text-slate-900">{proprietaire.id_cadastrale}</p>
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
                <span className="text-sm font-medium text-slate-700">
                  Superficie:
                </span>
                <p className="text-slate-900 font-medium text-lg text-blue-600">
                  {formatSuperficie(parcelle.superficie_m2)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">
                  Périmètre:
                </span>
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

          {/* Dates */}
          <Separator />
          <div className="space-y-3">
            {parcelle.created_at && (
              <div>
                <span className="text-sm font-medium text-slate-700">
                  Date de création:
                </span>
                <p className="text-sm text-slate-600">
                  {formatDate(parcelle.created_at)}
                </p>
              </div>
            )}
            {parcelle.updated_at && (
              <div>
                <span className="text-sm font-medium text-slate-700">
                  Dernière modification:
                </span>
                <p className="text-sm text-slate-600">
                  {formatDate(parcelle.updated_at)}
                </p>
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
    <Button
      variant="ghost"
      size="sm"
      className="hover:bg-orange-50 hover:text-orange-600"
    >
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
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer la parcelle{" "}
            <span className="font-semibold">&quot;{parcelle.name}&quot;</span>{" "}
            (ID: {parcelle.id}) du {blocInfo.name} ?
            <br />
            <br />
            Cette action est irréversible et supprimera toutes les données
            associées :
            <span className="list-disc list-inside mt-2 text-sm">
              <span>
                Informations de la parcelle (
                {formatSuperficie(parcelle.superficie_m2)})
              </span>
              <span>Géométrie et coordonnées</span>
              <span>Association avec le propriétaire</span>
            </span>
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
