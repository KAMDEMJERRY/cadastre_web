/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/ParcelleForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Upload, MapPin, FileText } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useUsers } from "@/hooks/useUser";
import { useBloc } from "@/hooks/useBlocsAdmin";
import { useLotissement } from "@/hooks/useLotissementAdmin";
import { useParcelle } from "@/hooks/useParcellesAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadFile } from "@/lib/utils";
import { PARCELLEDOC_URL } from "@/utils/constants/end_points";
import { apiClient } from "@/services/client";
import { documentService } from "@/services/api/document";
import ConfirmationAlert from "../ui/confirm-alert";

// Schema de validation basé sur les spécifications exactes de l'API
const parcelleSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Maximum 100 caractères")
    .optional(),
  proprietaire: z.number().min(1, "Le propriétaire est requis"),
  longeur: z.number().min(0.1, "La longueur doit être positive").optional(), // Orthographe correcte selon l'API
  superficie_m2: z.number().min(1, "La superficie doit être positive"),
  perimetre_m: z.number().min(0.1, "Le périmètre doit être positif"),
  geom: z.string().optional(),
  parcelle_bloc: z.number().min(1, "Le bloc est requis"),
});

type ParcelleFormData = z.infer<typeof parcelleSchema>;

// Interface étendue pour le formulaire (avec des champs supplémentaires non envoyés à l'API)
interface ParcelleFormInputs extends ParcelleFormData {
  bloc_lotissement?: number; // Pour le formulaire uniquement
  coordonnees_gps?: string; // Pour le formulaire uniquement
  description?: string; // Pour le formulaire uniquement
  prix?: number; // Pour le formulaire uniquement
  statut?: string; // Pour le formulaire uniquement
}

// Interface pour les parcelles basée sur les spécifications
interface Parcelle {
  id?: number;
  name: string;
  proprietaire: number;
  longueur?: number;
  superficie_m2: number;
  perimetre_m: number;
  geom?: string;
  parcelle_bloc: number;
  bloc_lotissement?: number;
  coordonnees_gps?: string;
  description?: string;
  prix?: number;
  date_creation?: string;
}

interface ParcelleFormProps {
  mode: "create" | "edit" | "import";
  parcelle?: Parcelle;
  onSubmit?: (data: ParcelleFormData) => void;
  onClose?: () => void;
}

export default function ParcelleForm({
  mode,
  parcelle,
  onSubmit,
  onClose,
}: ParcelleFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedLotissement, setSelectedLotissement] = useState<string>(
    parcelle?.bloc_lotissement?.toString() || ""
  );

  const { createParcelle, updateParcelle } = useParcelle();
  const [LocFileUrl, setLocFileUrl] = useState<string | null>(null);
  const [alertOpen, setAlerOpen] = useState(false);

  const form = useForm<ParcelleFormInputs>({
    resolver: zodResolver(parcelleSchema),
    defaultValues: {
      name: parcelle?.name || "",
      proprietaire: parcelle?.proprietaire || 0,
      longeur: parcelle?.longueur || undefined, // Orthographe correcte
      superficie_m2: parcelle?.superficie_m2 || 0,
      perimetre_m: parcelle?.perimetre_m || 0,
      geom: parcelle?.geom || "",
      parcelle_bloc: parcelle?.parcelle_bloc || 0,
      bloc_lotissement: parcelle?.bloc_lotissement || 0,
      coordonnees_gps: parcelle?.coordonnees_gps || "",
      description: parcelle?.description || "",
      prix: parcelle?.prix || undefined,
    },
  });
  const handleValidationAlert = (data: ParcelleFormInputs) => {
    setAlerOpen(true);
  };

  const handleSubmit = async (data: ParcelleFormInputs) => {
    try {
      // Préparer les données selon les spécifications exactes de l'API
      const apiData: ParcelleFormData = {
        name: data.name,
        proprietaire: data.proprietaire,
        longeur: data.longeur, // Orthographe correcte selon l'API
        superficie_m2: data.superficie_m2,
        perimetre_m: data.perimetre_m,
        geom: data.geom,
        parcelle_bloc: data.parcelle_bloc,
      };

      // Nettoyer les valeurs undefined/null
      const cleanedData = Object.fromEntries(
        Object.entries(apiData).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );

      console.log("Données envoyées à l'API:", cleanedData);

      let Newparcelle;
      if (mode === "create") {
        Newparcelle = await createParcelle(cleanedData as Omit<Parcelle, "id">);
      } else if (mode === "edit" && parcelle?.id) {
        Newparcelle = await updateParcelle(
          parcelle.id,
          cleanedData as Omit<Parcelle, "id">
        );
      }

      try {
        // Vérifier que l'URL du fichier et l'ID de la parcelle existent
        if (LocFileUrl && Newparcelle?.id) {
          const ParcelleDocument = {
            document: LocFileUrl,
            parcelle: Newparcelle.id,
          };

          console.log("Document de la parcelle:",ParcelleDocument)
          // Envoyer les données au backend
          const data = await documentService.post(ParcelleDocument);
          console.log("URL du fichier enregistrée avec succès:", data);
        } else {
          console.warn("URL du fichier ou ID de parcelle manquant");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'URL:", error);
        // Gérer l'erreur (afficher un message à l'utilisateur, etc.)
      }

      onSubmit?.(cleanedData as Omit<Parcelle, "id">);
      setOpen(false);
      form.reset();
      setSelectedLotissement("");
      onClose?.();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case "create":
        return "Nouvelle Parcelle";
      case "edit":
        return "Modifier";
      case "import":
        return "Import";
      default:
        return "Action";
    }
  };

  const getButtonIcon = () => {
    switch (mode) {
      case "create":
        return <Plus className="h-4 w-4 mr-2" />;
      case "edit":
        return <Edit className="h-4 w-4" />;
      case "import":
        return <Upload className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const renderTriggerButton = () => {
    if (mode === "create") {
      return (
        <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900">
          {getButtonIcon()}
          {getButtonText()}
        </Button>
      );
    }

    return (
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-orange-50 hover:text-orange-600"
      >
        {getButtonIcon()}
      </Button>
    );
  };

  if (mode === "import") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {getButtonIcon()}
            {getButtonText()}
          </Button>
        </DialogTrigger>
        <ParcelleImportDialog />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{renderTriggerButton()}</DialogTrigger>
      <ParcelleFormDialog
        mode={mode}
        form={form}
        selectedLotissement={selectedLotissement}
        setSelectedLotissement={setSelectedLotissement}
        onSubmit={handleValidationAlert}
        setOpen={setOpen}
        setLocFileUrl={setLocFileUrl}
      />
      {/* Alerte de confirmation */}
      <ConfirmationAlert
        open={alertOpen}
        mode={mode}
        resourceName={"le lotissement"}
        onConfirm={()=>handleSubmit(form.getValues())}
        onCancel={() => setOpen(false)}
      />
    </Dialog>
  );
}

interface ParcelleFormDialogProps {
  mode: "create" | "edit";
  form: UseFormReturn<ParcelleFormInputs, any, ParcelleFormInputs>;
  selectedLotissement: string;
  setSelectedLotissement: (value: string) => void;
  onSubmit: (data: ParcelleFormInputs) => void;
  setOpen: (open: boolean) => void;
}
interface formProps {
  form: UseFormReturn<ParcelleFormInputs, any, ParcelleFormInputs>;
}
interface LocationSectionProps {
  form: UseFormReturn<ParcelleFormInputs, any, ParcelleFormInputs>;
  selectedLotissement: string;
  setSelectedLotissement: (value: string) => void;
}

function ParcelleFormDialog({
  mode,
  form,
  selectedLotissement,
  setSelectedLotissement,
  onSubmit,
  setOpen,
  setLocFileUrl,
}: ParcelleFormDialogProps & { setLocFileUrl: (arg: string) => void }) {
  const getDialogTitle = () => {
    return mode === "create" ? "Nouvelle Parelle" : "Modifier Parcelle";
  };

  const getDialogDescription = () => {
    return mode === "create"
      ? "Creer une nouvelle parcelle"
      : "Modifier les informations de la parcelles";
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <DialogDescription>{getDialogDescription()}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations de base */}
          <BasicInfoSection form={form} />

          {/* Localisation */}
          <LocationSection
            form={form}
            selectedLotissement={selectedLotissement}
            setSelectedLotissement={setSelectedLotissement}
          />

          {/* Propriétaire */}
          <OwnerSection form={form} />

          {/* Dimensions */}
          <DimensionsSection form={form} />

          {/* Localisation et géométrie */}
          <GeographySection form={form} setLoc={setLocFileUrl} mode={mode} />

          {/* Description */}
          <DescriptionSection form={form} />

          {/*Footer*/}
          <FormFooter mode={mode} setOpen={setOpen} />
        </form>
      </Form>
    </DialogContent>
  );
}

function BasicInfoSection({ form }: formProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900">
        Informations générales
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la parcelle *</FormLabel>
              <FormControl>
                <Input placeholder="ex: Parcelle A1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function LocationSection({
  form,
  selectedLotissement,
  setSelectedLotissement,
}: LocationSectionProps) {
  const { lotissements } = useLotissement();
  const { blocs } = useBloc();

  const filteredBlocs = selectedLotissement
    ? blocs?.filter(
        (bloc) => bloc.bloc_lotissement === parseInt(selectedLotissement)
      )
    : [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900">Localisation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bloc_lotissement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lotissement *</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(parseInt(value));
                  setSelectedLotissement(value);
                  form.setValue("parcelle_bloc", 0);
                }}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un lotissement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lotissements?.map((lotissement) => (
                    <SelectItem
                      key={lotissement.id}
                      value={lotissement.id.toString()}
                    >
                      {lotissement.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parcelle_bloc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bloc *</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
                disabled={!selectedLotissement}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un bloc" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredBlocs?.map((bloc) => (
                    <SelectItem key={bloc.id} value={bloc.id.toString()}>
                      {bloc.name} -{" "}
                      {
                        lotissements?.find(
                          (l) => l.id === bloc.bloc_lotissement
                        )?.name
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function OwnerSection({ form }: formProps) {
  const { users } = useUsers();
  const proprietaires =
    users?.filter((user) => user.role === "proprietaire") || [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900">Propriété</h3>
      <div className="grid grid-cols-1 md:grid-cols-1  gap-0">
        <FormField
          control={form.control}
          name="proprietaire"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Propriétaire *</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un propriétaire" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {proprietaires.map((proprietaire) => (
                    <SelectItem
                      key={proprietaire.id}
                      value={proprietaire.id.toString()}
                    >
                      {proprietaire.full_name}({proprietaire.id_cadastrale})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function DimensionsSection({ form }: formProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900">Dimensions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="superficie_m2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Superficie (m²) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1.0"
                  min="0"
                  placeholder="500.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="perimetre_m"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Périmètre (m) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="90.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function GeographySection({
  form,
  setLoc,
  mode,
}: formProps & { setLoc: (loc: string) => void; mode: "edit" | "create" }) {
  const [geoFile, setGeoFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const handleGeoFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGeoFile(file);

    try {
      const uploadLoc = await uploadFile(file);
      setLoc(uploadLoc.downloadUrl);
    } catch (error) {
      setError("Erreur lors de l'importation du fichier");
      console.error("error GeoFile:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* <h3 className="text-lg font-medium text-slate-900 flex items-center">
        <MapPin className="h-5 w-5 mr-2" />
        Fichier Localisation
      </h3> */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-3">
          <FormLabel>Document Technique de la parcelle</FormLabel>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Importer un `{mode === "edit" && "nouveau"}` document technique
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById("geofile-upload")?.click()
                }
              >
                Parcourir
              </Button>
            </div>

            <input
              id="geofile-upload"
              type="file"
              accept="*.pdf"
              className="hidden"
              onChange={(e) => {
                handleGeoFileUpload(e);
              }}
            />

            {geoFile && (
              <div className="text-sm text-green-600 mb-2">
                ✓ Fichier chargé: {geoFile.name}
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 mb-2">✗ Erreur: {error}</div>
            )}

            <p className="text-xs text-slate-500">
              Formats acceptés: .pdf
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormFooter({
  mode,
  setOpen,
}: {
  mode: string;
  setOpen: (open: boolean) => void;
}) {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={() => setOpen(false)}>
        Annuler
      </Button>
      <Button type="submit">
        {mode === "create" ? "Créer la parcelle" : "Modifier la parcelle"}
      </Button>
    </DialogFooter>
  );
}

function DescriptionSection({ form }: formProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Description de la parcelle, particularités, équipements, etc."
                className="resize-none h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ParcelleImportDialog() {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Importer des parcelles</DialogTitle>
        <DialogDescription>
          Sélectionnez un fichier CSV ou Excel pour importer plusieurs parcelles
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-slate-400" />
          <div className="mt-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Choisir un fichier
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                console.log("Fichier sélectionné:", e.target.files?.[0]);
              }}
            />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Formats acceptés: CSV, Excel (.xlsx, .xls)
          </p>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-medium mb-2">Format attendu:</p>
          <ul className="text-xs space-y-1">
            <li>• name: Nom de la parcelle</li>
            <li>• proprietaire_id: ID du propriétaire</li>
            <li>• superficie_m2: Superficie en m²</li>
            <li>• bloc_lotissement: ID du lotissement</li>
            <li>• bloc_id: ID du bloc</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  );
}
