import { parcelleService } from "@/services/api/parcelle";
import { Parcelle } from "@/types/parcelle";
import { useAPI } from "./useApi";

export function useParcellesAdmin() {
  return useAPI<Parcelle[]>(
    parcelleService.getByAdmin,
    {
      immediate: true,
      dependencies: [],
      transform: (parcelles: Parcelle[]) => {
        return parcelles.sort((a, b) => a.name.localeCompare(b.name));
      }
    }
  );
}

export function useCreateParcelleAdmin(){
    const { execute, data, loading, error } = useAPI<Parcelle>(
      (parcelleData: Omit<Parcelle, 'id'>)=>parcelleService.postByAdmin(parcelleData),
      {
        immediate: false,
        dependencies: []
     }
    );
    return {
        createParcelle: execute,
        data: data,
        loading: loading,
        error: error
    };
}

export function useUpdateParcelle(){
    const {execute, data, loading, error} = useAPI<Parcelle>(
      (id: number, parcelleData: Omit<Parcelle, 'id'>) => parcelleService.updateByAdmin(id, parcelleData),
      {
        immediate: false,
        dependencies: []
    });

    return{
        updateParcelle: execute,
        data: data,
        loading: loading,
        error: error
    };
}

export function useDeleteParcelle(){
    const {execute, loading, error} = useAPI<void>(
      (id: number) => parcelleService.deleteByAdmin(id),
      {
        immediate: false,
        dependencies: []
    });

    return{
        deleteParcelle: execute,
        loading: loading,
        error: error
    };
}


