import { transformToBloc } from "@/services/api/blocs";
import { documentService } from "@/services/api/document";
import { transformToLotissement } from "@/services/api/lotissement";
import { apiClient } from "@/services/client";
import { APIBlocFeature, Bloc } from "@/types/bloc";
import { APILotissementFeature, Lotissement } from "@/types/lotissement";
import { Parcelle } from "@/types/parcelle";
import {Document} from "@/types/document";
import {
  ParcelleProprietaire,
  StatsProprietaire,
} from "@/types/ui/proprietaire";

export const mapParcellesToParcelleData = async (
  Lesparcelles: Parcelle[]
): Promise<ParcelleProprietaire[]> => {
  const parcelles = Lesparcelles.slice();
  if (!parcelles?.length) return [];

  // Utilisation de WeakMap pour un cache plus efficace
  const blocsCache = new Map<number, Bloc>();
  const lotissementsCache = new Map<number, Lotissement>();

  // Fonction optimisée pour récupérer les blocs
  const getBloc = async (blocRef: number | Bloc): Promise<Bloc> => {
    if (typeof blocRef !== "number") return blocRef;

    if (blocsCache.has(blocRef)) {
      return blocsCache.get(blocRef)!;
    }

    try {
      const data = await apiClient.get<APIBlocFeature>(
        `/cadastre/bloc/${blocRef}`
      );
      const bloc = transformToBloc(data);
      blocsCache.set(blocRef, bloc);
      // blocsCache.set(data, bloc); // Cache aussi par l'objet Feature
      return bloc;
    } catch (error) {
      console.error(`Failed to fetch bloc ${blocRef}`, error);
      return {
        id: blocRef,
        name: "Bloc inconnu",
        bloc_lotissement: -1,
        superficie_m2: 0,
        perimetre_m: 0,
        geometry: null,
      };
    }
  };
  // Fonction optimisée pour récupérer les lotissements
  const getLotissement = async (
    lotissementRef: number | Lotissement
  ): Promise<Lotissement> => {
    if (typeof lotissementRef !== "number") return lotissementRef;

    if (lotissementsCache.has(lotissementRef)) {
      const lotissement = lotissementsCache.get(lotissementRef)!;
      return lotissement;
    }

    try {
      const data = await apiClient.get<APILotissementFeature>(
        `/cadastre/lotissement/${lotissementRef}/`
      );
      const lotissement = transformToLotissement(data);
      lotissementsCache.set(lotissementRef, lotissement);
      // lotissementsCache.set(data, lotissement); // Cache aussi par l'objet Feature
      return lotissement;
    } catch (error) {
      console.error(`Failed to fetch lotissement ${lotissementRef}`, error);
      return {
        id: lotissementRef,
        name: "Lotissement inconnu",
        addresse: "Non spécifiée",
        superficie_m2: 0,
        perimetre_m: 0,
        longeur: 0,
        geometry: null,
      };
    }
  };

  const ParcelDoc = async (parcelle: Parcelle):Promise<string | undefined> => {
    try {
      const doc = await documentService.getByParcelleId(parcelle.id);
      return doc?.document || "";
    } catch (error) {
      console.log("Erreur lors du telechargement:", error);
    }
  };

  const documentPromises = parcelles.map((p)=>{
    return ParcelDoc(p);
  });

  const documents = await Promise.all(documentPromises);

  // On regroupe toutes les requêtes nécessaires avant de mapper
  const blocsPromises = parcelles.map((p) =>
    typeof p.parcelle_bloc === "number"
      ? getBloc(p.parcelle_bloc)
      : Promise.resolve(p.parcelle_bloc)
  );

  const blocs = await Promise.all(blocsPromises);

  const lotissementsPromises = blocs.map((b) =>
    typeof b.bloc_lotissement === "number"
      ? getLotissement(b.bloc_lotissement)
      : Promise.resolve(b.bloc_lotissement)
  );

  const lotissements = await Promise.all(lotissementsPromises);

  // Construction du résultat final
  return parcelles.map((parcelle, index) => {
    const bloc = blocs[index];
    const lotissement = lotissements[index];
    const document = documents[index];

    return {
      id: parcelle.id.toString(),
      numero: parcelle.name || `Parcelle-${parcelle.id}`,
      bloc: {
        nom: bloc.name || "Bloc sans nom",
        lotissement: {
          nom: lotissement.name,
          adresse: lotissement.addresse || "Non spécifiée",
        },
      },
      superficie: parcelle.superficie_m2 || 0,
      perimetre: parcelle.perimetre_m || 0,
      planLocalisation: document, // Valeur par défaut
      geometrie: parcelle.geometry
        ? {
            coordinates: parcelle.geometry.coordinates,
            type: parcelle.geometry.type,
          }
        : undefined,
      localisation: {
        pays: "Cameroun",
        region: "Non spécifié",
        departement: "Non spécifié",
        arrondissement: "Non spécifié",
        quartier: "Non spécifié",
      },
    };
  });
};
// Correction pour nombreLotissements
export const mapParcelleDataToStatProprietaires = (
  parcelles: ParcelleProprietaire[]
): StatsProprietaire => {
  const nomsLotissements = new Set(
    parcelles.map((p) => p.bloc.lotissement.nom)
  );
  return {
    totalParcelles: parcelles.length,
    superficieTotale: parcelles.reduce((sum, p) => sum + p.superficie, 0),
    nombreLotissements: nomsLotissements.size,
    statutGeneral: parcelles.length > 0 ? "à_jour" : "attente",
  };
};
