// pages/proprietaire/dashboard.tsx - Version complète
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProprietaireHeader from '@/components/proprietaire/ProprietaireHeader';
import ProprietaireStats from '@/components/proprietaire/ProprietaireStats';
import ProprietaireFilters from '@/components/proprietaire/ProprietaireFilters';
import ParcellesGrid from '@/components/proprietaire/ParcellesGrid';
import ParcelleDetailsModal from '@/components/proprietaire/ParcelleDetailsModal';
import { 
  mockProprietaireProfile, 
  mockParcelles, 
  mockStats, 
  mockLotissements 
} from '@/data/proprietaireMockData';
import { FilterOptions, ParcelleProprietaire } from '@/types/ui/proprietaire';
import { useUser } from '@/hooks/useUser';
import { mapUserToProprietaire } from '@/utils/mappers/userMapper';
import { mapParcelleDataToStatProprietaires } from '@/utils/mappers/parcelleMapper';
import { useParcellesMapping } from '@/hooks/useParcellesMapping';

export default function ProprietaireDashboard() {
  const {user, logout} = useUser();
  
  const { parcellesData } = useParcellesMapping();
  const router = useRouter();
  const [filters, setFilters] = useState<FilterOptions>({
    lotissement: '',
    superficieMin: null,
    search: '',
    statut: ''
  });
  const [selectedParcelle, setSelectedParcelle] = useState<ParcelleProprietaire | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stats = useMemo(() => mapParcelleDataToStatProprietaires(parcellesData ?? []), [parcellesData]);

  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      router.push('/login');
    }
  };

  const handleViewDetails = (parcelle: ParcelleProprietaire) => {
    setSelectedParcelle(parcelle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParcelle(null);
  };

  const handleViewMap = (parcelle: ParcelleProprietaire) => {
    // Navigation vers la vue cartographique avec la parcelle sélectionnée
    router.push(`/proprietaire/carte?parcelle=${parcelle.id}`);
  };

  const handleGeneratePDF = (parcelle: ParcelleProprietaire) => {
    // Simulation de la génération PDF
    alert(`Génération du PDF pour la parcelle ${parcelle.numero}...\n\nDocument: Attestation de propriété\nSuperficie: ${parcelle.superficie} m²\nLotissement: ${parcelle.bloc.lotissement.nom}`);
    
    // Logique réelle pour générer le PDF
    // const pdfData = {
    //   parcelle: parcelle,
    //   proprietaire: mockProprietaireProfile
    // };
    // generateParcelleAttestationPDF(pdfData);
  };

  const handleExportAllPDF = () => {
    // Simulation de l'export de toutes les parcelles
    const totalSuperficie = mockParcelles.reduce((sum, p) => sum + p.superficie, 0);
    alert(`Génération du rapport complet...\n\nNombre de parcelles: ${mockParcelles.length}\nSuperficie totale: ${totalSuperficie.toLocaleString()} m²\nPropriétaire: ${mockProprietaireProfile.nom}`);
    
    // Logique réelle pour générer le PDF complet
    // const reportData = {
    //   parcelles: mockParcelles,
    //   proprietaire: mockProprietaireProfile,
    //   stats: mockStats
    // };
    // generateCompletePropertyReport(reportData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ProprietaireHeader 
        profile={mapUserToProprietaire(user)}
        onLogout={handleLogout}
      />

    <main className="pt-32 sm:pt-36 md:pt-40 pb-8">       
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* En-tête du dashboard */}
         <div className="mb-8">
           <h2 className="text-3xl font-bold text-slate-900 mb-2">
             Mes Parcelles
           </h2>
           <p className="text-lg text-slate-600">
             Gérez et consultez vos propriétés cadastrales
           </p>
         </div>

        
        {/* Statistiques */}
        <ProprietaireStats stats={stats} />

        {/* Filtres */}
        <ProprietaireFilters 
          filters={filters}
          onFiltersChange={setFilters}
          lotissements={mockLotissements}
        />

        {/* Grille des parcelles */}

        <ParcellesGrid 
          parcelles={parcellesData ?? []}
          filters={filters}
          onViewDetails={handleViewDetails}
          onViewMap={handleViewMap}
          onGeneratePDF={handleGeneratePDF}
          onExportAllPDF={handleExportAllPDF}
        />

        {/* Modal de détails */}
        <ParcelleDetailsModal 
          parcelle={selectedParcelle}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onGeneratePDF={handleGeneratePDF}
          onViewMap={handleViewMap}
        />



      
      </div>   

    </main>
    </div>
  );
}





  
    //   </div>
