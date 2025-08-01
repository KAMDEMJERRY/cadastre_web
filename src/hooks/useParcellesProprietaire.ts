import { parcelleService } from "@/services/api/parcelle"
import { useAPI } from "./useApi"
import { Parcelle } from "@/types/parcelle"

// Hook pour les parcelles d'un propriétaire
export function useParcellesProprietaire() {
  return useAPI(
    () => parcelleService.getByProprietaire(),
    {
      immediate: true,
      dependencies: [],
      transform: (parcelles:Parcelle[]) => {
        return parcelles.sort((a, b) => a.name.localeCompare(b.name));
      }
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