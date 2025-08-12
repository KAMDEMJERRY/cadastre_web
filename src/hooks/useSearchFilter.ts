/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useSearchFilter.ts
import { useState, useMemo } from 'react';

export interface FilterOptions {
  status?: 'active' | 'inactive' | 'all';
  role?: 'admin' | 'agent' | 'proprietaire' | 'all';
  accountType?: 'particulier' | 'entreprise' | 'organisation' | 'all';
  dateRange?: 'today' | 'week' | 'month' | 'all';
  parcelleStatus?: 'disponible' | 'vendue' | 'reservee' | 'all';
}

export function useSearchFilter<T>(
  data: T[],
  searchFields: (keyof T)[],
  activeTab: string
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    role: 'all',
    accountType: 'all',
    dateRange: 'all',
    parcelleStatus: 'all'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fonction de recherche
  const searchItems = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter((item: any) => {
      return searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchQuery);
        }
        return false;
      });
    });
  }, [data, searchQuery, searchFields]);

  // Fonction de filtrage
  const filteredItems = useMemo(() => {
    return searchItems.filter((item: any) => {
      // Filtre par statut (pour utilisateurs)
      if (filters.status !== 'all' && activeTab.includes('utilisateur')) {
        const isActive = item.is_active;
        if (filters.status === 'active' && !isActive) return false;
        if (filters.status === 'inactive' && isActive) return false;
      }

      // Filtre par rôle (pour utilisateurs)
      if (filters.role !== 'all' && activeTab.includes('utilisateur')) {
        if (item.role !== filters.role) return false;
      }

      // Filtre par type de compte (pour utilisateurs)
      if (filters.accountType !== 'all' && activeTab.includes('utilisateur')) {
        if (item.account_type !== filters.accountType) return false;
      }

      // Filtre par statut de parcelle
      if (filters.parcelleStatus !== 'all' && activeTab === 'parcelles') {
        if (item.status !== filters.parcelleStatus) return false;
      }

      // Filtre par date
      if (filters.dateRange !== 'all') {
        const itemDate = new Date(item.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case 'today':
            if (daysDiff > 0) return false;
            break;
          case 'week':
            if (daysDiff > 7) return false;
            break;
          case 'month':
            if (daysDiff > 30) return false;
            break;
        }
      }

      return true;
    });
  }, [searchItems, filters, activeTab]);

  const resetFilters = () => {
    setFilters({
      status: 'all',
      role: 'all',
      accountType: 'all',
      dateRange: 'all',
      parcelleStatus: 'all'
    });
    setSearchQuery('');
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    filteredItems,
    isFilterOpen,
    setIsFilterOpen,
    resetFilters,
    resultsCount: filteredItems.length,
    totalCount: data.length
  };
}