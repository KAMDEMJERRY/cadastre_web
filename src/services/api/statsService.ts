import { apiClient } from "../client";

interface LotissementStats {
  id: number;
  name: string;
  blocs_count: number;
  parcelles_count: number;
}
interface BlocStats {
  id: number;
  name: string;
  bloc_lotissement__name: string;
  parcelles_count: number;
}
export interface GlobalStats {
  lotissements: Array<LotissementStats>;
  blocs: Array<BlocStats>;
  total_lotissements: number;
  total_blocs: number;
  total_parcelles: number;
}

export const statsService = {
  getGlobalStats: async (): Promise<GlobalStats> => {
    const response = await apiClient.get<GlobalStats>(
      "/cadastre/stats/globales"
    );
    return response;
  },
};
