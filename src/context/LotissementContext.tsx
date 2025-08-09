// context/LotissementContext.tsx
'use client'

import { useAPI } from "@/hooks/useApi";
import { LotissementService } from "@/services/api/lotissement";
import { Lotissement } from "@/types/lotissement";
import { createContext, ReactNode, useEffect } from "react";

// On pourra ettendre ce type pour inclure d'autres propriétés si nécessaire
// Par exemple, si vous avez des propriétés supplémentaires dans Lotissement, vous pouvez les ajouter ici
// nombreBlocs,
// nombreParcelles,
type LotissementContextType = {
    lotissements: Lotissement[] | undefined;  // Remplacez 'any' par le type approprié
    nombreBlocs: Map<number, number>;
    nombreParcelles: Map<number, number>;
    loading: boolean;
    error: string | null;
    fetchLotissements: () => Promise<void>;
    createLotissement: (lotissementData: Omit<Lotissement, 'id'>) => Promise<Lotissement>;
    updateLotissement: (id: number, lotissementData: Omit<Lotissement, 'id'>) => Promise<Lotissement>;
    deleteLotissement: (id: number)=> Promise<void>;
}

export const LotissementContext = createContext<LotissementContextType | undefined>(undefined);


export function LotissementsProvider({children}:{children:ReactNode}){
    const {data:lotissements, execute, loading, error, refresh} = useAPI<Lotissement[]>(LotissementService.getByAdmin, {immediate: true});
    
    // eslint-disable-next-line prefer-const
    let nombreBlocs : Map<number, number> = new Map();
    
    // eslint-disable-next-line prefer-const
    let nombreParcelles : Map<number, number> = new Map();

    useEffect(
        ()=>{

            lotissements?.map(lot=>{
                nombreBlocs.set(lot.id, 0)
                nombreParcelles.set(lot.id, 0);
            });
            // Recuperer les statistiques pour un lotissement
            // const stats = fetchStats();
            // - Nombre de Blocs: nombresBlocs = stats.nombreBlocs; 
            // - Nombre de Parcelles: nompreParcelles.set(lotissement.id, nombreparcelle) = stats.nombreParcelles;
            // - Nombre de Lotissements: nombreLotissements = stats.nombreLotissements;
            // nombreBlocs = lotissements?.reduce((acc, lotissement) => acc + (
        }
    ,[lotissements]);

    const handleFechLotissements = async ()=>{
        execute();
    };

    const handleCreateLotissement = async (lotissementData: Omit<Lotissement, 'id'>) => {
        console.log("handleCreateLotissement Creating lotissement with data:", lotissementData);
        const lotissement = LotissementService.postByAdmin(lotissementData);
        
        if (!lotissement) {
              throw new Error("Failed to create lotissement");
        }
       
        console.log("Lotissement created successfully:", lotissement);
        
        await handleFechLotissements();
        
        return lotissement;
    }

    const handleUpdateLotissement = async (id:number, lotissementData: Omit<Lotissement, 'id'>) =>{
       alert("HandleUpdate");
        const lotissement = await LotissementService.updateByAdmin(id, lotissementData);
       
        if (!lotissement) {
            throw new Error("Failed to update lotissement");
        }

        await handleFechLotissements();

        console.log("Lotissement updated successfully:", lotissement);

       return lotissement;
    }

    const handleDeleteLotissement = async (id: number) => {
        console.log(`Starting deletion of Lotissement with id ${id}`);
        await LotissementService.deleteByAdmin(id);

        console.log(`Lotissement with id ${id} deleted successfully`);
        
        // await handleFechLotissements();
        refresh()
        console.log(`Lotissement with id ${id} deleted successfully`);        
    }

    return <LotissementContext.Provider 
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
            >{children}
          </LotissementContext.Provider>
}


