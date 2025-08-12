// components/dashboard/FilterDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { FilterOptions } from "@/hooks/useSearchFilter";

interface FilterDialogProps {
  activeTab: string;
  filters: FilterOptions;
  onUpdateFilter: (key: keyof FilterOptions, value: string) => void;
  onResetFilters: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  resultsCount: number;
  totalCount: number;
}

export default function FilterDialog({
  activeTab,
  filters,
  onUpdateFilter,
  onResetFilters,
  isOpen,
  setIsOpen,
  resultsCount,
  totalCount
}: FilterDialogProps) {

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== 'all').length;
  };

  const getFiltersByTab = () => {
    switch (activeTab) {
      case 'proprietaires':
      case 'administrateurs':
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">Statut du compte</label>
              <Select value={filters.status} onValueChange={(value) => onUpdateFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {activeTab === 'administrateurs' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Rôle</label>
                <Select value={filters.role} onValueChange={(value) => onUpdateFilter('role', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Type de compte</label>
              <Select value={filters.accountType} onValueChange={(value) => onUpdateFilter('accountType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="particulier">Particulier</SelectItem>
                  <SelectItem value="entreprise">Entreprise</SelectItem>
                  <SelectItem value="organisation">Organisation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'parcelles':
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">Statut de la parcelle</label>
              <Select value={filters.parcelleStatus} onValueChange={(value) => onUpdateFilter('parcelleStatus', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="disponible">Disponibles</SelectItem>
                  <SelectItem value="vendue">Vendues</SelectItem>
                  <SelectItem value="reservee">Réservées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
          {getActiveFiltersCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-600 hover:bg-blue-600">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Filtres avancés</span>
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            Filtrer les résultats selon vos critères
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filtre par date (commun à tous les onglets) */}
          <div>
            <label className="text-sm font-medium mb-2 block">Période de création</label>
            <Select value={filters.dateRange} onValueChange={(value) => onUpdateFilter('dateRange', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtres spécifiques par onglet */}
          {getFiltersByTab()}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Résultats :</span>
            <span className="font-medium">
              {resultsCount} sur {totalCount}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}