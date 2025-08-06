import { transformToBloc } from "@/services/api/blocs";
import { transformToLotissement } from "@/services/api/lotissement";
import { apiClient } from "@/services/client";
import { APIBlocFeature, Bloc } from "@/types/bloc";
import { APILotissementFeature, Lotissement } from "@/types/lotissement";
import { Parcelle } from "@/types/parcelle";
import { ParcelleProprietaire, StatsProprietaire } from "@/types/ui/proprietaire";

export const mapParcellesToParcelleData = async (parcelles:Parcelle[]):Promise<ParcelleProprietaire[]>=>{
    // Creer un cache pou les blocs deja recuperes
    const blocsCache = new Map<number, Bloc>();
    const lotissementsCache = new Map<number, Lotissement>();

    const results =  await Promise.all( 
        parcelles.map(async (parcelle)=>{
        let APIbloc: APIBlocFeature;
        let bloc: Bloc;
        // Gestion du bloc
        if(typeof parcelle.parcelle_bloc === 'number'){
            const blocId = parcelle.parcelle_bloc;
            
            // Verifier le cache d'abord
            if(blocsCache.has(blocId)){
                bloc = blocsCache.get(blocId) as Bloc;
            }else{
                APIbloc = await apiClient.get(`/cadastre/bloc/${blocId}`);
                bloc = transformToBloc(APIbloc);
                console.log("mapParcellesToParcelleDatav", bloc);
                blocsCache.set(blocId, bloc);
            }
        } else {
            bloc = parcelle.parcelle_bloc as Bloc;
            blocsCache.set(bloc.id, bloc);
        }


        // Gesstion du lotissement
        let lotissement : Lotissement
        let APILotissement: APILotissementFeature;
        if (typeof bloc.bloc_lotissement === 'number'){
            const lotissementId = bloc.bloc_lotissement;
            APILotissement = await apiClient.get(`/cadastre/lotissement/${lotissementId}`);
            lotissement = transformToLotissement(APILotissement);
            lotissementsCache.set(lotissementId, lotissement);
        } else {
            lotissement = bloc.bloc_lotissement;
            lotissementsCache.set(lotissement.id, lotissement);
        }

        // 3. Construction de l'objet final
        return {
            id: parcelle.id.toString(),
            numero: parcelle.name || `Parcelle-${parcelle.id}`,
            bloc: {
            nom: bloc.name || 'Bloc sans nom',
            lotissement: {
                nom: lotissement.name,
                adresse: lotissement.addresse || 'Non spécifiée'
            }
            },
            superficie: parcelle.superficie_m2 || 0,
            perimetre: parcelle.perimetre_m || 0,
            planLocalisation:  undefined,
            geometrie: parcelle.geometry ? {
            coordinates: parcelle.geometry.coordinates,
            type: parcelle.geometry.type
            } : undefined,
            localisation: {
            pays: 'Cameroun',
            region: 'Non spécifié',
            departement: 'Non spécifié',
            arrondissement: 'Non spécifié',
            quartier: 'Non spécifié'
            }
       };
    }));

    return results;
}

export const mapParcelleDataToStatProprietaires = (parcelles: ParcelleProprietaire[]): StatsProprietaire => {
  return {
    totalParcelles : parcelles.length,
    superficieTotale : parcelles.reduce((sum, p) => sum + p.superficie, 0),
    nombreLotissements : [new Set(parcelles.map(p=> p.bloc.lotissement.nom))].length,
    statutGeneral : parcelles.length > 0 ? "à_jour" : "attente"};
};


export const mapParcelleDataToLotissement = (parcelles: ParcelleProprietaire[]): string[] => {
  return [...new Set(parcelles.map(p => p.bloc.lotissement.nom))];
}


