'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface ParcelleMapProps {
  coordinates: [number, number][];
}

export default function ParcelleMap({ coordinates }: ParcelleMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      // Initialiser la carte
      mapRef.current = L.map(mapContainer.current).setView(
        [3.848, 11.502], // Yaoundé par défaut
        15
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapRef.current);

      // Dessiner le polygone de la parcelle
      if (coordinates.length > 0) {
        const polygon = L.polygon(coordinates, { color: 'blue' }).addTo(mapRef.current);
        mapRef.current.fitBounds(polygon.getBounds());
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordinates]);

  return (
    <section className="mb-8">
      <div 
        ref={mapContainer} 
        className="h-96 w-full bg-gray-200 rounded-lg"
      />
    </section>
  );
}