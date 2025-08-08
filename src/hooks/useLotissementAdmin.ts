import { Lotissement } from "@/types/lotissement";
import { useAPI } from "./useApi";
import { LotissementService } from "@/services/api/lotissement";
import { useContext } from "react";
import { LotissementContext } from "@/context/LotissementContext";


export const useLotissement = () => {
    const context = useContext(LotissementContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export function useLotissementAdmin() {
    return useAPI<Lotissement[]>(
        LotissementService.getByAdmin,
        {
            immediate: true,
            dependencies: [],
        }
    );
}

export function useCreateLotissementAdmin() {
    const { execute, data, loading, error } = useAPI<Lotissement>(
        (lotissementData: Omit<Lotissement, 'id'>) => LotissementService.postByAdmin(lotissementData),
        {
            immediate: false,
            dependencies: [],
        }
    );
    return {
        createLotissement: execute,
        data: data,
        loading: loading,
        error: error
    };
}

export function useUpdateLotissementAdmin() {
    const { execute, data, loading, error } = useAPI<Lotissement>(
        (id: number, lotissementData: Omit<Lotissement, 'id'>) => LotissementService.updateByAdmin(id, lotissementData),
        {
            immediate: false,
            dependencies: []
        }
    );

    return {
        updateLotissement: execute,
        data: data,
        loading: loading,
        error: error
    };
}

export function useDeleteLotissementAdmin() {
    const { execute, loading, error } = useAPI<void>(
        (id: number) => LotissementService.deleteByAdmin(id),
        {
            immediate: false,
            dependencies: []
        }
    );

    return {
        deleteLotissement: execute,
        loading: loading,
        error: error
    };
}



