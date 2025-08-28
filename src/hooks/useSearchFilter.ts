// hooks/useSearchFilter.ts
import { useState, useMemo } from 'react';
import { FilterOptions } from '@/app/dashboard/admin/types/filters';
import { Lotissement } from '@/types/lotissement';
import { Parcelle } from '@/types/parcelle';
import { User } from '@/types/user';
import { Bloc } from '@/types/bloc';

type TabName = 'lotissements' | 'parcelles' | 'proprietaires' | 'administrateurs' | 'blocs' | 'outils';

type FilterStrategy<T> = {
  searchFields: (keyof T)[];
  filterFn: (item: T, filters: FilterOptions) => boolean;
};

export const filterStrategies = {
  lotissements: {
    searchFields: ['name', 'address'] as (keyof Lotissement)[],
    filterFn: (item: Lotissement, filters: FilterOptions) => {
      // Ajoutez ici des filtres spécifiques aux lotissements si nécessaire
      return true;
    }
  },
  parcelles: {
    searchFields: ['numero', 'proprietaire', 'lotissement'] as (keyof Parcelle)[],
    filterFn: (item: Parcelle, filters: FilterOptions) => {
      // Filtre par statut de parcelle
      // return filters.parcelleStatus === 'all' || item.status === filters.parcelleStatus;
      true;
    }
  },
  proprietaires: {
    searchFields: ['full_name', 'email', 'username', 'num_telephone'] as (keyof User)[],
    filterFn: (item: User, filters: FilterOptions) => {
      return (
        (filters.status === 'all' || item.is_active === (filters.status === 'active')) &&
        (filters.role === 'all' || item.role === filters.role)
      );
    }
  },
  administrateurs: {
    searchFields: ['full_name', 'email', 'username', 'num_telephone'] as (keyof User)[],
    filterFn: (item: User, filters: FilterOptions) => {
      return (
        filters.status === 'all' || 
        item.is_active === (filters.status === 'active')
      );
    }
  },
  blocs: {
    searchFields: ['name', 'lotissement'] as (keyof Bloc)[],
    filterFn: (item: Bloc, filters: FilterOptions) => {
      return true; // Pas de filtres spécifiques pour les blocs
    }
  },
  outils: {
    searchFields: [] as never[],
    filterFn: () => true // Pas de filtres pour les outils
  }
} as const;

export function useTabFilter<T extends TabName>(
  tabName: T,
  data: T extends 'lotissements' ? Lotissement[] :
        T extends 'parcelles' ? Parcelle[] :
        T extends 'proprietaires' ? User[] :
        T extends 'administrateurs' ? User[] :
        T extends 'blocs' ? Bloc[] :
        never[],
  initialFilters?: Partial<FilterOptions>
) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    role: 'all',
    parcelleStatus: 'all',
    dateRange: 'all',
    accountType: "IND",
    ...initialFilters
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const strategy = filterStrategies[tabName];

  const filteredData = useMemo(() => {
    // Filtrage par texte
    const searchedItems = searchQuery 
      ? data.filter(item => {
          return strategy.searchFields.some(field => {
            const value = item[field as keyof typeof item];
            return String(value).toLowerCase().includes(searchQuery.toLowerCase());
          });
        })
      : data;

    // Filtrage avancé
    return searchedItems.filter(item => 
      strategy.filterFn(item as never, filters)
    );
  }, [data, searchQuery, filters, strategy]);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      role: 'all',
      parcelleStatus: 'all',
      dateRange: 'all',
      accountType: 'IND'
    });
    setSearchQuery('');
  };

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
    isFilterOpen,
    setIsFilterOpen,
    resultsCount: filteredData.length,
    totalCount: data.length
  };
}

