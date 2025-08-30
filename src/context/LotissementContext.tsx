// context/LotissementContext.tsx
"use client";

import { useAPI } from "@/hooks/useApi";
import { LotissementService } from "@/services/api/lotissement";
import { statsService } from "@/services/api/statsService";
import { apiClient } from "@/services/client";
import { Lotissement } from "@/types/lotissement";
import { createContext, ReactNode, useEffect, useState } from "react";

// On pourra ettendre ce type pour inclure d'autres propriétés si nécessaire
// Par exemple, si vous avez des propriétés supplémentaires dans Lotissement, vous pouvez les ajouter ici
// nombreBlocs,
// nombreParcelles,
type LotissementContextType = {
  lotissements: Lotissement[] | undefined; // Remplacez 'any' par le type approprié
  nombreBlocs: Map<number, number>;
  nombreParcelles: Map<number, number>;
  loading: boolean;
  error: string | null;
  fetchLotissements: () => Promise<void>;
  createLotissement: (
    lotissementData: Omit<Lotissement, "id">
  ) => Promise<Lotissement>;
  updateLotissement: (
    id: number,
    lotissementData: Omit<Lotissement, "id">
  ) => Promise<Lotissement>;
  deleteLotissement: (id: number) => Promise<void>;
};

export const LotissementContext = createContext<
  LotissementContextType | undefined
>(undefined);

export function LotissementsProvider({ children }: { children: ReactNode }) {
  const {
    data: lotissements,
    execute,
    loading,
    error,
    refresh,
  } = useAPI<Lotissement[]>(LotissementService.getByAdmin, { immediate: true });

  const [nombreBlocs, setNombreBlocs] = useState<Map<number, number>>(
    new Map()
  );
  const [nombreParcelles, setNombreParcelles] = useState<Map<number, number>>(
    new Map()
  );
  useEffect(() => {
    const fetchStats = async () => {
      const newNombreBlocs = new Map<number, number>();
      const newNombreParcelles = new Map<number, number>();
      try {
        const data = await statsService.getGlobalStats();

        data.lotissements.map((lot) => {
          newNombreBlocs.set(lot.id, lot.blocs_count);
          newNombreParcelles.set(lot.id, lot.parcelles_count);
        });
        setNombreBlocs(newNombreBlocs);
        setNombreParcelles(newNombreParcelles);
      } catch (error) {
        lotissements?.map((lot) => {
          newNombreBlocs.set(lot.id, 0);
          newNombreParcelles.set(lot.id, 0);
          
        });
        setNombreBlocs(newNombreBlocs);
        setNombreParcelles(newNombreParcelles);
        console.error("Erreur lors de la récupération des stats:", error);
      } 
    };
    fetchStats();
  }, [lotissements]);

  const handleFechLotissements = async () => {
    execute();
  };

  const handleCreateLotissement = async (
    lotissementData: Omit<Lotissement, "id">
  ) => {
    console.log(
      "handleCreateLotissement Creating lotissement with data:",
      lotissementData
    );
    const lotissement = LotissementService.postByAdmin(lotissementData);

    if (!lotissement) {
      throw new Error("Failed to create lotissement");
    }

    console.log("Lotissement created successfully:", lotissement);

    await handleFechLotissements();

    return lotissement;
  };

  const handleUpdateLotissement = async (
    id: number,
    lotissementData: Omit<Lotissement, "id">
  ) => {
    alert("HandleUpdate");
    const lotissement = await LotissementService.updateByAdmin(
      id,
      lotissementData
    );

    if (!lotissement) {
      throw new Error("Failed to update lotissement");
    }

    await handleFechLotissements();

    console.log("Lotissement updated successfully:", lotissement);

    return lotissement;
  };

  const handleDeleteLotissement = async (id: number) => {
    console.log(`Starting deletion of Lotissement with id ${id}`);
    await LotissementService.deleteByAdmin(id);

    console.log(`Lotissement with id ${id} deleted successfully`);

    // await handleFechLotissements();
    refresh();
    console.log(`Lotissement with id ${id} deleted successfully`);
  };

  return (
    <LotissementContext.Provider
      value={{
        lotissements: lotissements || [],
        nombreBlocs: nombreBlocs,
        nombreParcelles: nombreParcelles,
        loading: loading,
        error: error,
        fetchLotissements: handleFechLotissements,
        createLotissement: handleCreateLotissement,
        updateLotissement: handleUpdateLotissement,
        deleteLotissement: handleDeleteLotissement,
      }}
    >
      {children}
    </LotissementContext.Provider>
  );
}
