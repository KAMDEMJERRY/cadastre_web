// components/dashboard/forms/LotissementForm.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload, FileText, X, Edit } from "lucide-react";
import { useCreateLotissementAdmin, useLotissementAdmin, useUpdateLotissementAdmin } from "@/hooks/useLotissementAdmin";
import { Lotissement } from "@/types/lotissement";
import { LotissementData } from "@/types/ui/dashboard";

interface LotissementFormData {
  name: string;
  adresse: string;
  description: string;
  longueur: string;
  superficie_m2: string;
  perimetre_m: string;
  geom: string;
}

interface LotissementFormProps {
  mode: 'create' | 'edit';
  trigger?: React.ReactNode;
  lotissement?: Lotissement; // Nécessaire uniquement en mode 'edit'
  createLotissement: (data: Omit<Lotissement, 'id'>) => void;
  updateLotissement: (id: number, data: Omit<Lotissement, 'id'>) => void;
  fetchLotissements: () => void;
  onSuccess?: () => void;
}

export default function LotissementForm({mode, trigger, lotissement, createLotissement, updateLotissement,fetchLotissements ,onSuccess }: LotissementFormProps) {

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  
  // Initialiser les données du formulaire selon le mode
  const getInitialFormData = (): LotissementFormData => {
    if (mode === 'edit') {
      return {
        name: lotissement?.name || '',
        adresse: lotissement?.addresse || '',
        description: lotissement?.description || '',
        longueur: lotissement?.longeur?.toString() || '',
        superficie_m2: lotissement?.superficie_m2?.toString() || '',
        perimetre_m: lotissement?.perimetre_m?.toString() || '',
        geom: lotissement?.geometry?.toString() || ''
      };
    }
    
    return {
      name: '',
      adresse: '',
      description: '',
      longueur: '',
      superficie_m2: '',
      perimetre_m: '',
      geom: ''
    };
  };

  const [formData, setFormData] = React.useState<LotissementFormData>(getInitialFormData());

  // Réinitialiser le formulaire quand le lotissement change
  React.useEffect(() => {
    setFormData(getInitialFormData());
  }, [, mode]);

  const handleInputChange = (field: keyof LotissementFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
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
      geom: mode === 'edit' && lotissement ? (lotissement.geom?.toString() || '') : ''
    }));
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setSelectedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Le nom du lotissement est requis.");
      return;
    }

    if (formData.name.length > 100) {
      alert("Le nom ne peut pas dépasser 100 caractères");
      return;
    }

    // Validation du GeoJSON si présent
    if (formData.geom) {
      try {
        JSON.parse(formData.geom);
      } catch (error) {
        alert("Le format GeoJSON n'est pas valide");
        return;
      }
    }

    // Préparer les données pour l'API
    const submitData = {
      name: formData.name,
      adresse: formData.adresse || null,
      description: formData.description || undefined,
      longueur: formData.longueur ? parseFloat(formData.longueur) : null,
      superficie_m2: parseFloat(formData.superficie_m2),
      perimetre_m: parseFloat(formData.perimetre_m),
      geom: formData.geom || null
    };

    // Logique de soumission selon le mode
    if (mode === 'create') {
      createLotissement(submitData);
      console.log("Creating lotissement with data:", submitData);
    } else if (mode === 'edit' && lotissement) {
      updateLotissement(lotissement.id, submitData);
      console.log("Updating lotissement with data:", submitData);
    }

    // Actualiser la liste et fermer le modal
    fetchLotissements();
    resetForm();
    setIsModalOpen(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    resetForm();
    setIsModalOpen(false);
  };

  // Bouton de déclenchement par défaut
  const defaultTrigger = mode === 'create' ? (
    <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900">
      <Plus className="h-4 w-4 mr-2" />
      Nouveau Lotissement
    </Button>
  ) : (
    <Button variant="ghost" size="sm">
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
            {mode === 'create' ? 'Créer un nouveau lotissement' : `Modifier "${lotissement?.name}"`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Nom */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Nom du lotissement *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                maxLength={100}
                className="mt-1"
                placeholder="Entrez le nom du lotissement"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                {formData.name.length}/100 caractères
              </p>
            </div>

            {/* Adresse */}
            <div>
              <Label htmlFor="adresse" className="text-sm font-medium">
                Adresse
              </Label>
              <Input
                id="adresse"
                type="text"
                value={formData.adresse}
                onChange={(e) => handleInputChange("adresse", e.target.value)}
                className="mt-1"
                placeholder="Entrez l'adresse"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-1"
                placeholder="Entrez une description du lotissement"
              />
            </div>

            {/* Mesures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* <div>
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
              </div> */}

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
                {formData.geom && (
                  <div className="mt-2">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md max-h-32 overflow-y-auto">
                      <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {formData.geom.substring(0, 200)}
                        {formData.geom.length > 200 && '...'}
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
          <div className="flex justify-end space-x-2 pt-4">
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
            >
              {mode === 'create' ? 'Créer le lotissement' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}