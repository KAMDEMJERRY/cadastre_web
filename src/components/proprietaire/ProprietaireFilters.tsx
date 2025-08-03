// components/proprietaire/ProprietaireFilters.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOptions } from "@/types/proprietaire";

interface ProprietaireFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  lotissements: string[];
}

export default function ProprietaireFilters({ 
  filters, 
  onFiltersChange, 
  lotissements 
}: ProprietaireFiltersProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card className="bg-white border-slate-200 shadow-sm mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Filtrer mes parcelles
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lotissement" className="text-sm font-medium text-slate-700">
              Lotissement
            </Label>
            <Select 
              value={filters.lotissement} 
              onValueChange={(value) => updateFilter('lotissement', value)}
            >
              <SelectTrigger className="border-2 border-slate-200 focus:border-blue-500 transition-colors">
                <SelectValue placeholder="Tous les lotissements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={lotissements[0]}>Tous les lotissements</SelectItem>
                {lotissements.map((lotissement) => (
                  <SelectItem key={lotissement} value={lotissement}>
                    {lotissement}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="superficie" className="text-sm font-medium text-slate-700">
              Superficie minimale (m²)
            </Label>
            <Input
              id="superficie"
              type="number"
              placeholder="Ex: 300"
              value={filters.superficieMin || ''}
              onChange={(e) => updateFilter('superficieMin', e.target.value ? Number(e.target.value) : null)}
              className="border-2 border-slate-200 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium text-slate-700">
              Rechercher
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Numéro de parcelle..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="border-2 border-slate-200 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statut" className="text-sm font-medium text-slate-700">
              Statut
            </Label>
            <Select 
              value={filters.statut} 
              onValueChange={(value) => updateFilter('statut', value)}
            >
              <SelectTrigger className="border-2 border-slate-200 focus:border-blue-500 transition-colors">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}