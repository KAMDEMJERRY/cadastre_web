'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Correction pour les icônes manquantes dans Leaflet
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function LotissementsMap() {
  useEffect(() => {
    // Définir l'icône par défaut
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden relative z-0">
      <MapContainer
        center={[3.848, 11.502]} // Coordonnées de Yaoundé
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[3.848, 11.502]}>
          <Popup>Cité Verte</Popup>
        </Marker>
        <Marker position={[3.853, 11.508]}>
          <Popup>Mvog-Ada</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}