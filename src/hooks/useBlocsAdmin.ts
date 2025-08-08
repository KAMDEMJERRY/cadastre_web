import { blocService } from "@/services/api/blocs";
import { useAPI } from "./useApi";
import { Bloc } from "@/types/bloc";
import { BlocContext } from "@/context/BlocContext";
import { useContext } from "react";

export const useBlocs = ()=>{
  const context = useContext(BlocContext);
  if(context == undefined){
    throw new Error('BlocContext must be used within a use Provider');
  }
  return context;
}

export function useBlocAdmin(){
    return useAPI<Bloc[]>(
        blocService.getByAdmin,
        {          
          immediate: true,
          dependencies: [],
          transform: (blocs: Bloc[]) => {
            return blocs.sort((a, b) => a.name.localeCompare(b.name));
          }
        }
    );
}

export function useCreateBlocAdmin() {
    const { execute, data, loading, error } = useAPI<Bloc>(
      (blocData: Omit<Bloc, 'id'>) => blocService.postByAdmin(blocData),
      {
        immediate: false,
        dependencies: []
      }
    );
    return {
        createBloc: execute,
        data: data,
        loading: loading,
        error: error
    };
}

export function useUpdateBloc() {
    const { execute, data, loading, error } = useAPI<Bloc>(
      (id: number, blocData: Omit<Bloc, 'id'>) => blocService.updateByAdmin(id, blocData),
      {
        immediate: false,
        dependencies: []
      }
    );

    return {
        updateBloc: execute,
        data: data,
        loading: loading,
        error: error
    };
}

export function useDeleteBloc() {
    const { execute, loading, error } = useAPI<void>(
      (id: number) => blocService.deleteByAdmin(id),
      {
        immediate: false,
        dependencies: []
      }
    );

    return {
        deleteBloc: execute,
        loading: loading,
        error: error
    };
}