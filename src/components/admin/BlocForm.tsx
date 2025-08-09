// components/dashboard/forms/BlocForm.tsx
import React from "react";
import { Plus, Edit, Upload, FileText, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bloc } from "@/types/bloc";
import { useBloc } from "@/hooks/useBlocsAdmin";
import { useLotissement } from "@/hooks/useLotissementAdmin";
import { Lotissement } from "@/types/lotissement";

interface BlocFormData {
  name: string;
  description: string;
  lotissement_id: string;
  longueur: string;
  superficie_m2: string;
  perimetre_m: string;
  geometry: string;
}

interface BlocFormProps {
  mode: 'create' | 'edit';
  trigger?: React.ReactNode;
  bloc?: Bloc; // Nécessaire uniquement en mode 'edit'
  onSuccess?: () => void;
}

export default function BlocForm({ mode, trigger, bloc, onSuccess }: BlocFormProps) {
  const { createBloc, updateBloc, fetchBlocs } = useBloc();
  const { lotissements, fetchLotissements } = useLotissement();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  // Initialiser les données du formulaire selon le mode
  const getInitialFormData = (): BlocFormData => {
    if (mode === 'edit' && bloc) {
      return {
        name: bloc.name || '',
        description: bloc.description || '',
        lotissement_id: bloc.bloc_lotissement?.toString() || '',
        longueur: bloc.longeur?.toString() || '',
        superficie_m2: bloc.superficie_m2?.toString() || '',
        perimetre_m: bloc.perimetre_m?.toString() || '',
        geometry: bloc.geometry?.toString() || '',
      };
    }
    
    return {
      name: '',
      description: '',
      lotissement_id: '',
      longueur: '',
      superficie_m2: '',
      perimetre_m: '',
      geometry: '',
    };
  };

  const [formData, setFormData] = React.useState<BlocFormData>(getInitialFormData());

  // Réinitialiser le formulaire quand le bloc change
  React.useEffect(() => {
    setFormData(getInitialFormData());
  }, [bloc, mode]);

  // Charger les lotissements au montage du composant
  React.useEffect(() => {
    fetchLotissements();
  }, []);

  const handleInputChange = (field: keyof BlocFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setSelectedFile(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier que c'est un fichier JSON ou GeoJSON
      if (file.type === 'application/json' || file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
        setSelectedFile(file);
        
        // Lire le contenu du fichier
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            // Valider que c'est un GeoJSON valide
            const geoJson = JSON.parse(content);
            
            // Vérification basique de la structure GeoJSON
            if (geoJson.type && (geoJson.type === 'FeatureCollection' || geoJson.type === 'Feature' || geoJson.type === 'Polygon')) {
              setFormData(prev => ({
                ...prev,
                geom: JSON.stringify(geoJson, null, 2)
              }));
            } else {
              alert("Le fichier ne semble pas être un GeoJSON valide");
              setSelectedFile(null);
            }
          } catch (error) {
            alert("Erreur lors de la lecture du fichier JSON");
            setSelectedFile(null);
          }
        };
        reader.readAsText(file);
      } else {
        alert("Veuillez sélectionner un fichier JSON ou GeoJSON");
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFormData(prev => ({
      ...prev,
      geom: mode === 'edit' && bloc ? (bloc.geometry || '') : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) {
      alert("Le nom du bloc est requis.");
      return;
    }

    if (formData.name.length > 100) {
      alert("Le nom ne peut pas dépasser 100 caractères");
      return;
    }

    if (!formData.lotissement_id) {
      alert("Veuillez sélectionner un lotissement.");
      return;
    }

    // Préparer les données pour l'API
    const submitData = {
      name: formData.name,
      description: formData.description || undefined,
      bloc_lotissement: parseInt(formData.lotissement_id),
      longueur: formData.longueur ? parseFloat(formData.longueur) : null,
      superficie_m2: parseFloat(formData.superficie_m2),
      perimetre_m: parseFloat(formData.perimetre_m),
      geom: formData.geometry || null,
    };

    try {
      // Logique de soumission selon le mode
      if (mode === 'create') {
        console.log("Creating bloc with data:", submitData);
        await createBloc(submitData);
        console.log("Bloc created with data:", submitData);
      } else if (mode === 'edit' && bloc) {
        await updateBloc(bloc.id, submitData);
        console.log("Updating bloc with data:", submitData);
      }

      // Actualiser la liste et fermer le modal
      fetchBlocs();
      resetForm();
      setIsModalOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} bloc:`, error);
      alert(`Erreur lors de la ${mode === 'create' ? 'création' : 'mise à jour'} du bloc. Veuillez réessayer.`);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsModalOpen(false);
  };

  // Bouton de déclenchement par défaut
  const defaultTrigger = mode === 'create' ? (
    <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900">
      <Plus className="mr-2 h-4 w-4" />
      Nouveau Bloc
    </Button>
  ) : (
    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
      <Edit className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Créer un nouveau bloc' : `Modifier "${bloc?.name}"`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Ajoutez un nouveau bloc à votre système.'
              : 'Modifiez les informations du bloc.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Nom du bloc */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nom du bloc *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Entrez le nom du bloc"
                maxLength={100}
                className="mt-1"
                required
              />
              <p className="text-xs text-slate-500">
                {formData.name.length}/100 caractères
              </p>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Description du bloc (optionnel)"
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Lotissement */}
            <div className="grid gap-2">
              <Label htmlFor="lotissement" className="text-sm font-medium">
                Lotissement *
              </Label>
              <Select
                value={formData.lotissement_id}
                onValueChange={(value) => handleInputChange("lotissement_id", value)}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez un lotissement" />
                </SelectTrigger>
                <SelectContent>
                  {lotissements && lotissements.length > 0 ? (
                    lotissements.map((lotissement:Lotissement) => (
                      <SelectItem key={lotissement.id} value={lotissement.id.toString()}>
                        {lotissement.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Aucun lotissement disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {(!lotissements || lotissements.length === 0) && (
                <p className="text-xs text-orange-500">
                  Aucun lotissement disponible. Créez d&apos;abord un lotissement.
                </p>
              )}
            </div>

            {/* Mesures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="longueur" className="text-sm font-medium">
                  Longueur
                </Label>
                <Input
                  id="longueur"
                  type="number"
                  step="0.01"
                  value={formData.longueur}
                  onChange={(e) => handleInputChange("longueur", e.target.value)}
                  className="mt-1"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="superficie_m2" className="text-sm font-medium">
                  Superficie (m²)
                </Label>
                <Input
                  id="superficie_m2"
                  type="number"
                  step="0.01"
                  value={formData.superficie_m2}
                  onChange={(e) => handleInputChange("superficie_m2", e.target.value)}
                  className="mt-1"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="perimetre_m" className="text-sm font-medium">
                  Périmètre (m)
                </Label>
                <Input
                  id="perimetre_m"
                  type="number"
                  step="0.01"
                  value={formData.perimetre_m}
                  onChange={(e) => handleInputChange("perimetre_m", e.target.value)}
                  className="mt-1"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Import de fichier GeoJSON */}
            <div>
              <Label className="text-sm font-medium">
                Polygone de la parcelle (GeoJSON)
              </Label>
              
              <div className="mt-2 space-y-3">
                {/* Zone d'upload */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="relative"
                    onClick={() => document.getElementById('geojson-file')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {mode === 'edit' ? 'Remplacer GeoJSON' : 'Importer GeoJSON'}
                  </Button>
                  <input
                    id="geojson-file"
                    type="file"
                    accept=".json,.geojson"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {selectedFile && (
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      <FileText className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedFile.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeSelectedFile}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Aperçu du contenu GeoJSON */}
                {formData.geometry && (
                  <div className="mt-2">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md max-h-32 overflow-y-auto">
                      <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {formData.geometry.substring(0, 200)}
                        {formData.geometry.length > 200 && '...'}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-slate-500 mt-1">
                Format attendu : fichier JSON ou GeoJSON contenant les coordonnées du polygone
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900"
              disabled={!lotissements || lotissements.length === 0}
            >
              {mode === 'create' ? 'Créer le bloc' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}