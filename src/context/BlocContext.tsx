import { useAPI } from "@/hooks/useApi";
import { useLotissement } from "@/hooks/useLotissementAdmin";
import { blocService } from "@/services/api/blocs";
import { Bloc } from "@/types/bloc";
import { createContext, ReactNode } from "react";


type BlocContextType = {
    blocs: Bloc[] | undefined;
    loading: boolean;
    error: string | null;
    fetchBloc: () => Promise<void>;
    createBloc:(blocData: Omit<Bloc, 'id'>) => Promise<Bloc>;
    updateBloc: (id: number, blocData: Omit<Bloc, 'id'>) => Promise<Bloc>;
    deleteBloc: (id: number) => Promise<void>;
}

export const BlocContext = createContext<BlocContextType | undefined>(undefined);


export function BlocProvider({children}: {children:ReactNode}){
    const {lotissements} = useLotissement();
    const {data:blocs, execute, loading, error, refresh} = useAPI<Bloc[]>(blocService.getByAdmin, {immediate:true, dependencies:[lotissements]});
    
    const handleFetchBlocs = async ()=>{
        refresh();
    }

    const handleCreateBloc =  async (lotissementData: Omit<Bloc, 'id'>) => {
        const bloc = await blocService.postByAdmin(lotissementData);
        
        if (!bloc) {
            throw new Error("Failed to create bloc");
        }
        
        console.log("Bloc created successfully:", bloc);
        
        await handleFetchBlocs();
        
        return bloc;
    }

    const handleUpdateBloc = async (id:number, blocData: Omit<Bloc, 'id'>) => {
        const bloc = await blocService.updateByAdmin(id, blocData);
        
        if (!bloc) {
            throw new Error("Failed to update bloc");
        }

        await handleFetchBlocs();

        console.log("Bloc updated successfully:", bloc);

        return bloc;
    }

    const handleDeleteBloc = async (id: number) => {
        await execute(blocService.deleteByAdmin(id));
        await handleFetchBlocs();
        console.log(`Bloc with id ${id} deleted successfully`);        
    }

    return <BlocContext.Provider
            value={{
                blocs: blocs || [],
                loading: loading,
                error: error,   
                fetchBloc: handleFetchBlocs,
                createBloc: handleCreateBloc,
                updateBloc: handleUpdateBloc,
                deleteBloc: handleDeleteBloc
            }}    
            >
                {children}
            </BlocContext.Provider>
}