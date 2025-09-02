// components/dashboard/forms/LotissementForm.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Upload, FileText, X, Edit } from "lucide-react";
import { useLotissement } from "@/hooks/useLotissementAdmin";
import { Lotissement } from "@/types/lotissement";
import ConfirmationAlert from "../ui/confirm-alert";

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
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  lotissement?: Lotissement; // Nécessaire uniquement en mode 'edit'

  onSuccess?: () => void;
}

export default function LotissementForm({
  mode,
  trigger,
  lotissement,
  onSuccess,
}: LotissementFormProps) {
  const { createLotissement, fetchLotissements, updateLotissement } =
    useLotissement();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [alertOpen, setAlerOpen] = useState(false);
  // Initialiser les données du formulaire selon le mode
  const getInitialFormData = useCallback((): LotissementFormData => {
    if (mode === "edit") {
      return {
        name: lotissement?.name || "",
        adresse: lotissement?.addresse || "",
        description: lotissement?.description || "",
        longueur: lotissement?.longeur?.toString() || "",
        superficie_m2: lotissement?.superficie_m2?.toString() || "",
        perimetre_m: lotissement?.perimetre_m?.toString() || "",
        geom: lotissement?.geometry?.toString() || "",
      };
    }

    return {
      name: "",
      adresse: "",
      description: "",
      longueur: "",
      superficie_m2: "",
      perimetre_m: "",
      geom: "",
    };
  }, [mode]);

  const [formData, setFormData] = useState<LotissementFormData>(
    getInitialFormData()
  );

  // Réinitialiser le formulaire quand le lotissement change
  useEffect(() => {
    setFormData(getInitialFormData());
  }, [getInitialFormData]);

  const handleInputChange = (
    field: keyof LotissementFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  const handleValidationAlert = (e:React.FormEvent) => {
    e.preventDefault();
    setAlerOpen(true);
  };

  const handleSubmit = async () => {

    if (!formData.name.trim()) {
      // alert("Le nom du lotissement est requis.");
      return;
    }

    if (formData.name.length > 100) {
      // alert("Le nom ne peut pas dépasser 100 caractères");
      return;
    }

    // Préparer les données pour l'API
    const submitData = {
      name: formData.name,
      addresse: formData.adresse || undefined,
      description: formData.description || undefined,
      longueur: formData.longueur ? parseFloat(formData.longueur) : null,
      superficie_m2: parseFloat(formData.superficie_m2),
      perimetre_m: parseFloat(formData.perimetre_m),
      geom: formData.geom || null,
    };

    // Logique de soumission selon le mode
    if (mode === "create") {
      await createLotissement(submitData);
      console.log("Creating lotissement with data:", submitData);
    } else if (mode === "edit" && lotissement) {
      try {
        await updateLotissement(lotissement.id, submitData);
        console.log("Updating lotissement with data:", submitData);
      } catch (error) {
        console.error("Error updating lotissement:", error);
        alert(
          "Erreur lors de la mise à jour du lotissement. Veuillez réessayer."
        );
        return;
      }
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
  const defaultTrigger =
    mode === "create" ? (
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
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Créer un nouveau lotissement"
              : `Modifier "${lotissement?.name}"`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleValidationAlert} className="space-y-4">
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
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
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
                  onChange={(e) =>
                    handleInputChange("superficie_m2", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange("perimetre_m", e.target.value)
                  }
                  className="mt-1"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900"
            >
              {mode === "create" ? "Créer le lotissement" : "Mettre à jour"}
            </Button>
            {/* Alerte de confirmation */}
            <ConfirmationAlert
              open={alertOpen}
              mode={mode}
              resourceName={"le lotissement"}
              onConfirm={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
