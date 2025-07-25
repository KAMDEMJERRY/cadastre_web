'use client';

import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { rueCoordinates } from '@/app/dashboard/admin/rues/data';

export default function RuesMap() {
  return (
    <div className="h-96 w-full bg-gray-100 rounded-lg overflow-hidden relative">
      <MapContainer
        center={[3.848, 11.502]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {rueCoordinates.map((rue, index) => (
          <Polyline
            key={index}
            positions={rue.coordinates}
            color={rue.color || '#3388ff'}
            weight={5}
          />
        ))}
      </MapContainer>
    </div>
  );
}