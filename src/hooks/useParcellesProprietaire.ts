import { parcelleService } from "@/services/api/parcelle"
import { useAPI , UseAPIReturn} from "./useApi"
import { Parcelle } from "@/types/parcelle"

// Hook pour les parcelles d'un propriétaire
export function useParcellesProprietaire(): UseAPIReturn<Parcelle[]> {
  return useAPI<Parcelle[]>(
     () => {
      return parcelleService.getByProprietaire(); 
    },
    {
      immediate: true,
      dependencies: [],
      // transform: (parcelles?: Parcelle[]) => {
      //   return parcelles;
      //   // ?.slice()
      //                   // .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '') ?? []);
       
      // }
    }
  )
}

// Hook pour une parcelles d'un propriétaire
export function useParcelleProprietaire(parcelleId:number) {
  return useAPI(
    () => parcelleService.getByProprietaireAndParcelleId(parcelleId),
    {
      immediate: !!parcelleId,
      dependencies: [],
    }
  )
}