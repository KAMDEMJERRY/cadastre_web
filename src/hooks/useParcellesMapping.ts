import { ParcelleProprietaire } from '@/types/ui/proprietaire';
import { useAPI } from './useApi';
import { parcelleService } from '@/services/api/parcelle';

export function useParcellesMapping() {
    const {data:parcellesData, loading:isMapping, error} = useAPI<ParcelleProprietaire[]>(parcelleService.getByProprietaire, {immediate: true, dependencies: []});
   
    return { 
        parcellesData, 
        isMapping, 
        error,
    };
}

