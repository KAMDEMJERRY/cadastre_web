import ParcelleHeader from '@/components/features/parcelle/ParcelleHeader';
import ParcelleMap from '@/components/features/parcelle/ParcelleMap';
import InfoCard from '@/components/features/parcelle/ParcelleInfoCard';
import ParcelleActions from '@/components/features/parcelle/ParcelleActions';
import { fetchParcelleById } from '@/lib/api/parcelle';

export default async function ParcelleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const parcelle = await fetchParcelleById(params.id);

  return (
    <div className="space-y-6">
      <ParcelleHeader 
        numero={parcelle.numero} 
        description="Consultez les informations détaillées de votre parcelle" 
      />
      
      <ParcelleMap coordinates={parcelle.coordinates} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard 
          title="Localisation" 
          items={[
            { label: 'Pays', value: 'Cameroun' },
            { label: 'Région', value: 'Centre' },
            { label: 'Département', value: 'Mfoundi' },
            { label: 'Arrondissement', value: 'Yaoundé IV' },
            { label: 'Quartier', value: 'Cité Verte' }
          ]}
        />
        
        <InfoCard 
          title="Identification" 
          items={[
            { label: 'Lotissement', value: parcelle.lotissement },
            { label: 'Bloc', value: parcelle.bloc },
            { label: 'Numéro de parcelle', value: parcelle.numero }
          ]}
        />
        
        <InfoCard 
          title="Caractéristiques" 
          items={[
            { label: 'Superficie', value: `${parcelle.superficie} m²` },
            { label: 'Périmètre', value: `${parcelle.perimetre} m` },
            { label: 'Géométrie', value: 'Polygone' },
            { 
              label: 'Plan de localisation', 
              value: 'Voir le plan',
              isLink: true 
            }
          ]}
        />
        
        <InfoCard 
          title="Propriétaire" 
          items={[
            { label: 'firstname', value: parcelle.proprietaire.firstname },
            { label: 'lastname', value: parcelle.proprietaire.lastname },
            { label: 'Email', value: parcelle.proprietaire.email },
            { label: 'Type', value: 'Privé' }
          ]}
        />
      </div>
      
      <ParcelleActions parcelleId={parcelle.id} />
    </div>
  );
}