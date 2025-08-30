import { useAPI } from "@/hooks/useApi";
import { useLotissement } from "@/hooks/useLotissementAdmin";
import { blocService } from "@/services/api/blocs";
import { statsService } from "@/services/api/statsService";
import { Bloc } from "@/types/bloc";

import { createContext, ReactNode, useEffect, useState } from "react";

type BlocContextType = {
  blocs: Bloc[] | undefined;
  nombreParcelles: Map<number, number>;
  loading: boolean;
  error: string | null;
  fetchBlocs: () => Promise<void>;
  createBloc: (blocData: Omit<Bloc, "id">) => Promise<Bloc>;
  updateBloc: (id: number, blocData: Omit<Bloc, "id">) => Promise<Bloc>;
  deleteBloc: (id: number) => Promise<void>;
};

export const BlocContext = createContext<BlocContextType | undefined>(
  undefined
);

export function BlocProvider({ children }: { children: ReactNode }) {
  const { lotissements } = useLotissement();
  const {
    data: blocs,
    execute,
    loading,
    error,
    refresh,
  } = useAPI<Bloc[]>(blocService.getByAdmin, {
    immediate: true,
    dependencies: [lotissements],
  });

  const [nombreParcelles, setNombreParcelles] = useState<Map<number, number>>(
    new Map()
  );

  useEffect(() => {
    const fetchBlocsStats = async () => {
      const parcelleStat = new Map<number, number>();

      try {
        const data = await statsService.getGlobalStats();
        data.blocs.map((bloc) => {
          parcelleStat.set(bloc.id, bloc.parcelles_count);
          console.log(parcelleStat);
        });
        console.log("ParcelleStats");
        console.log(parcelleStat);
        setNombreParcelles(parcelleStat);
      } catch (error) {
        blocs?.map((bloc) => {
          parcelleStat.set(bloc.id, 0);
        });
        setNombreParcelles(parcelleStat);
        console.log("Erreur lors de la recuperation des stas:", error);
      }
    };

    fetchBlocsStats();
  }, [blocs]);

  const handleFetchBlocs = async () => {
    refresh();
  };

  const handleCreateBloc = async (lotissementData: Omit<Bloc, "id">) => {
    const bloc = await blocService.postByAdmin(lotissementData);

    if (!bloc) {
      throw new Error("Failed to create bloc");
    }

    console.log("Bloc created successfully:", bloc);

    await handleFetchBlocs();

    return bloc;
  };

  const handleUpdateBloc = async (id: number, blocData: Omit<Bloc, "id">) => {
    const bloc = await blocService.updateByAdmin(id, blocData);

    if (!bloc) {
      throw new Error("Failed to update bloc");
    }

    await handleFetchBlocs();

    console.log("Bloc updated successfully:", bloc);

    return bloc;
  };

  const handleDeleteBloc = async (id: number) => {
    await execute(blocService.deleteByAdmin(id));
    refresh();
    console.log(`Bloc with id ${id} deleted successfully`);
  };

  return (
    <BlocContext.Provider
      value={{
        blocs: blocs || [],
        nombreParcelles: nombreParcelles,
        loading: loading,
        error: error,
        fetchBlocs: handleFetchBlocs,
        createBloc: handleCreateBloc,
        updateBloc: handleUpdateBloc,
        deleteBloc: handleDeleteBloc,
      }}
    >
      {children}
    </BlocContext.Provider>
  );
}
