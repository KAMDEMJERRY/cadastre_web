'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button1';
import Card from '@/components/layout/Card';

export default function FiltersGrid() {
  const [filters, setFilters] = useState({
    lotissement: '',
    superficie: '',
    search: '',
    statut: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      lotissement: '',
      superficie: '',
      search: '',
      statut: '',
    });
  };

  return (
    <Card className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filtrer mes parcelles</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
        >
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lotissement
          </label>
          <select
            name="lotissement"
            value={filters.lotissement}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Tous les lotissements</option>
            <option value="cité-verte">Cité Verte</option>
            <option value="mvog-ada">Mvog-Ada</option>
            <option value="odza">Odza</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Superficie minimale
          </label>
          <input
            type="number"
            name="superficie"
            placeholder="Ex: 300"
            value={filters.superficie}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rechercher
          </label>
          <input
            type="text"
            name="search"
            placeholder="Numéro de parcelle..."
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            name="statut"
            value={filters.statut}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Tous</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>
    </Card>
  );
}