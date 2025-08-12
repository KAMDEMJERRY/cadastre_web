import { useAPI } from "@/hooks/useApi";
import { useBloc } from "@/hooks/useBlocsAdmin";
import { parcelleService } from "@/services/api/parcelle";
import { Parcelle } from "@/types/parcelle";
import { createContext, ReactNode } from "react";

export type ParcelleContextType = {
    parcelles : Parcelle[] | null;
    loading: boolean;
    error: string | null;
    fetchParcelles: () => Promise<void>;
    createParcelle: (parcelleData: Omit<Parcelle, 'id'>)=> Promise<Parcelle>;
    updateParcelle: (id: number, ParcelleData: Omit<Parcelle, 'id'>) => Promise<Parcelle>
    deleteParcelle: (id: number) => Promise<void>;
}

export const ParcelleContext = createContext<ParcelleContextType | undefined>(undefined);

export function ParcelleProvider({children}:{children:ReactNode}){
    // depend aussi des utilisateurs
    const {blocs} = useBloc();
    const {data:parcelles, execute, loading, error, refresh} =  useAPI<Parcelle[]>(parcelleService.getByAdmin, {immediate:true, dependencies:[blocs]});
    
    const handleFechtParcelles = async ()=>{
        refresh();
    }

    const handleCreateParcelle = async (parcelleData: Omit<Parcelle, 'id'>)=>{
        const parcelle = parcelleService.postByAdmin(parcelleData);

        if(!parcelle){
            throw new Error("Failed to create lotissement");
        }

        console.log("Parcelles created successfully: ", parcelle );
        await handleFechtParcelles();

        return parcelle;
    } 
    
    const handleUpdateParcelle = async (id:number, parcelleData: Omit<Parcelle, 'id'>)=>{
        const parcelle = parcelleService.updateByAdmin(id, parcelleData);

        if(!parcelle){
            throw new Error("Failed to create lotissement");
        }

        console.log("Parcelles created successfully: ", parcelle );
        await handleFechtParcelles();

        return parcelle;
    }

    const handleDeleteParcelle = async (id: number) =>{
        execute(parcelleService.deleteByAdmin(id));
        await handleFechtParcelles();
        console.log(`Parclle with id ${id} deleted successfully`);
    }



    return <ParcelleContext.Provider
            value={{
                parcelles : parcelles,
                loading: loading,
                error: error,
                fetchParcelles: handleFechtParcelles,
                createParcelle:handleCreateParcelle,
                updateParcelle: handleUpdateParcelle,
                deleteParcelle: handleDeleteParcelle
            }} 
           >
                {children}
            </ParcelleContext.Provider>

}