// types/filters.ts


export interface DashboardFilterProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterOptions;
  updateFilter?: (key: keyof FilterOptions, value: string) => void;
  resetFilters?: () => void;
  isFilterOpen?: boolean;
  setIsFilterOpen?: (open: boolean) => void;
  resultsCount?: number;
  totalCount?: number;
}

// types/filters.ts
export interface FilterOptions {
  status: 'active' | 'inactive' | 'all';
  role: 'admin' | 'agent' | 'proprietaire' | 'all';
  parcelleStatus: 'libre' | 'occupe' | 'all';
  dateRange: 'today' | 'week' | 'month' | 'all';
  accountType: "IND" | "ORG";
}

export interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
}

export interface FilterBadgesProps {
  searchQuery: string;
  filters: FilterOptions;
  setSearchQuery: (query: string) => void;
  updateFilter: (key: keyof FilterOptions, value: string) => void;
  resetFilters: () => void;
  resultsCount: number;
  totalCount: number;
}