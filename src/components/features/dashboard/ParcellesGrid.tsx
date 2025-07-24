'use client'
import ParcelleCard from './ParcelleCard';
import Card from '@/components/layout/Card';
import Button from '@/components/ui/Button1';

type Parcelle = {
  id: string;
  numero: string;
  status: 'active' | 'pending';
  lotissement: string;
  bloc: string;
  superficie: number;
  perimetre: number;
};

export default function ParcellesGrid({ parcelles }: { parcelles: Parcelle[] }) {
  return (
    <Card>
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-semibold">Mes Parcelles ({parcelles.length})</h3>
        <Button variant="primary" onClick={() => alert('Export PDF')}>
          📄 Exporter PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parcelles.map((parcelle) => (
          <ParcelleCard 
            key={parcelle.id} 
            parcelle={parcelle} 
            onClick={() => alert(`Afficher détails ${parcelle.numero}`)}
          />
        ))}
      </div>
    </Card>
  );
}