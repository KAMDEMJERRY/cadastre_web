'use client';

import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ParcelleActionsProps {
  parcelleId: string;
}

export default function ParcelleActions({ parcelleId }: ParcelleActionsProps) {
  const router = useRouter();

  const handleGeneratePDF = () => {
    // Logique de génération PDF
    alert(`Génération PDF pour la parcelle ${parcelleId}`);
  };

  return (
    <section className="mt-6 flex flex-wrap gap-4">
      <Button variant="primary" icon="📍">
        Localiser
      </Button>
      <Button 
        variant="success" 
        icon="📄"
        onClick={handleGeneratePDF}
      >
        Générer PDF
      </Button>
      <Button 
        variant="secondary" 
        onClick={() => router.push('/dashboard')}
      >
        Retour au tableau de bord
      </Button>
    </section>
  );
}