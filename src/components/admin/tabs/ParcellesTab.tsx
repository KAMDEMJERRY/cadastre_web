// components/dashboard/tables/ParcellesTable.tsx
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Download, 
  MapPin,
  Calendar,
  Square,
  Ruler,
  User as UserIcon
} from "lucide-react";
import { ViewParcelle, EditParcelle, DeleteParcelle } from "../ParcelleActions";
import ParcelleForm from "../ParcelleForm";
import { useParcelle } from "@/hooks/useParcellesAdmin";
import { useUsers } from "@/hooks/useUser";
import { useBloc } from "@/hooks/useBlocsAdmin";

// Types
import { Parcelle } from "@/types/parcelle";
import { Bloc } from "@/types/bloc";
import { User } from "@/types/user";

interface ParcellesTableProps {
  showStats?: boolean;
}

export default function ParcellesTable({
  showStats = true,
}: ParcellesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { parcelles, deleteParcelle, loading, error } = useParcelle();
  const { users } = useUsers();
  const { blocs } = useBloc();
  
  // Filtrer et rechercher les parcelles
  const filteredParcelles = useMemo(() => {
    if (!parcelles) return [];

    // Recherche par nom
    if (searchTerm) {
      return parcelles.filter((parcelle) =>
        parcelle.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return parcelles;
  }, [parcelles, searchTerm]);
  // Statistiques
  const stats = useMemo(() => {
    if (!filteredParcelles.length) return null;

    const totalSuperficie = filteredParcelles.reduce((sum, p) => sum + p.superficie_m2, 0);
    const avgSuperficie = totalSuperficie / filteredParcelles.length;

    return {
      total: filteredParcelles.length,
      totalSuperficie,
      avgSuperficie,
      withGeometry: filteredParcelles.filter(p => p.geometry).length,
    };
  }, [filteredParcelles]);

  // Helpers pour récupérer les informations
  const getBlocName = (parcelle_bloc: number | Bloc): string => {
    if (typeof parcelle_bloc === 'object') return parcelle_bloc.name;
    const bloc = blocs?.find(b => b.id === parcelle_bloc);
    return bloc?.name || `Bloc ${parcelle_bloc}`;
  };

  const getLotissementName = (parcelle_bloc: number | Bloc): string => {
    if (typeof parcelle_bloc === 'object') {
      if (typeof parcelle_bloc.bloc_lotissement === 'object') {
        return parcelle_bloc.bloc_lotissement.name;
      }
      const bloc = blocs?.find(b => b.id === parcelle_bloc.id);
      if (bloc && typeof bloc.bloc_lotissement === 'object') {
        return bloc.bloc_lotissement.name;
      }
      return 'N/A';
    }
    
    const bloc = blocs?.find(b => b.id === parcelle_bloc);
    if (bloc && typeof bloc.bloc_lotissement === 'object') {
      return bloc.bloc_lotissement.name;
    }
    return 'N/A';
  };

  const getProprietaireName = (proprietaire: number | User): string => {
    if (typeof proprietaire === 'object') return proprietaire.full_name;
    const user = users?.find(u => u.id === proprietaire);
    return user?.full_name || 'Non assigné';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatSuperficie = (superficie: number) => {
    return superficie.toLocaleString('fr-FR') + ' m²';
  };

  const handleDeleteParcelle = async (parcelle: Parcelle) => {
    try {
      await deleteParcelle(parcelle.id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Chargement des parcelles...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-red-600">
          Erreur lors du chargement des parcelles: {error.toString()}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Gestion des Parcelles
          </h3>
          {stats && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {stats.total} parcelles • {formatSuperficie(stats.totalSuperficie)} au total
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ParcelleForm 
            mode="create" 
            onSubmit={(data) => {
              console.log('Nouvelle parcelle créée:', data);
            }} 
          />
        </div>
      </div>

      {/* Statistiques */}
      {showStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Square className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-slate-600">Total Parcelles</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Ruler className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-slate-600">Superficie totale</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatSuperficie(stats.totalSuperficie)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Square className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm text-slate-600">Superficie moyenne</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatSuperficie(Math.round(stats.avgSuperficie))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-slate-600">Avec géométrie</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.withGeometry}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom de parcelle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto max-h-[600px]">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Parcelle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Propriétaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Dimensions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Géométrie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredParcelles?.map((parcelle) => (
                  <tr
                    key={parcelle.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        {parcelle.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        ID: {parcelle.id}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-slate-900 dark:text-slate-50">
                        <div className="font-medium">{getBlocName(parcelle.parcelle_bloc)}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {getLotissementName(parcelle.parcelle_bloc)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900 dark:text-slate-50">
                          {getProprietaireName(parcelle.proprietaire)}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Square className="h-3 w-3 text-blue-500" />
                          <span className="text-sm font-medium">
                            {formatSuperficie(parcelle.superficie_m2)}
                          </span>
                        </div>
                        {parcelle.longeur && (
                          <div className="text-xs text-slate-600">
                            L: {parcelle.longeur}m • P: {parcelle.perimetre_m}m
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <Badge variant={parcelle.geometry ? "default" : "secondary"}>
                          {parcelle.geometry ? "Définie" : "Non définie"}
                        </Badge>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parcelle.created_at && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {formatDate(parcelle.created_at)}
                          </span>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <ViewParcelle parcelle={parcelle} />
                        <EditParcelle parcelle={parcelle} />
                        <DeleteParcelle
                          parcelle={parcelle}
                          onDelete={() => handleDeleteParcelle(parcelle)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredParcelles?.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-600 dark:text-slate-400"
                    >
                      <div className="space-y-2">
                        <Square className="h-12 w-12 mx-auto text-slate-300" />
                        <p className="text-lg font-medium">Aucune parcelle trouvée</p>
                        <p className="text-sm">
                          {searchTerm 
                            ? "Essayez de modifier votre recherche" 
                            : "Commencez par créer votre première parcelle"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}