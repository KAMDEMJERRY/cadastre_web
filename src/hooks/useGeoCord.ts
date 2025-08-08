/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useLotissementActions.ts (exemple d'implémentation)
import { useState } from 'react';

export function useLotissementActions() {
  const [isLoading, setIsLoading] = useState(false);


  const exportToGoogleMaps = (lotissement: any) => {
    try {
      if (!lotissement.geom) {
        alert('Aucune donnée géométrique disponible');
        return;
      }

      const geoData = typeof lotissement.geom === 'string' 
        ? JSON.parse(lotissement.geom) 
        : lotissement.geom;

      // Extraire les coordonnées
      let coordinates = [];
      if (geoData.type === 'Feature' && geoData.geometry) {
        coordinates = geoData.geometry.coordinates;
      } else if (geoData.type === 'Polygon') {
        coordinates = geoData.coordinates;
      }

      if (coordinates?.[0]) {
        // Calculer le centre
        let centerLat = 0, centerLng = 0, count = 0;
        coordinates[0].forEach(([lng, lat]: [number, number]) => {
          centerLng += lng;
          centerLat += lat;
          count++;
        });
        centerLat /= count;
        centerLng /= count;

        // Ouvrir Google Maps
        const url = `https://www.google.com/maps?q=${centerLat},${centerLng}`;
        window.open(url, '_blank');
      }
    } catch (error) {
      alert('Erreur lors de l\'ouverture de Google Maps');
    }
  };

  const exportCoordinates = (lotissement: any) => {
    try {
      if (!lotissement.geom) {
        alert('Aucune donnée géométrique disponible');
        return;
      }

      const geoData = typeof lotissement.geom === 'string' 
        ? JSON.parse(lotissement.geom) 
        : lotissement.geom;

      // Créer un fichier téléchargeable
      const dataStr = JSON.stringify(geoData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${lotissement.nom.replace(/\s+/g, '_')}_coordinates.geojson`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Erreur lors de l\'export des coordonnées');
    }
  };

  return {
    exportToGoogleMaps,
    exportCoordinates,
    isLoading,
    setIsLoading
  };
}

// Exemple d'utilisation dans le composant parent
/*
import { useLotissementActions } from '@/hooks/useLotissementActions';

function ParentComponent() {
  const { deleteLotissement } = useLotissementActions();

  return (
    <LotissementsTab 
      lotissements={lotissements}
      getLotissements={getLotissements}
      onDeleteLotissement={deleteLotissement}
    />
  );
}
*/