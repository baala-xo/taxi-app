
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


const defaultIcon = L.icon({
    iconUrl: "/marker-icon.png",
    iconRetinaUrl: "/marker-icon-2x.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


interface MapProps {
  center: [number, number];
  pickup: [number, number] | null;
  destination: [number, number] | null;
  onMapClick: (latlng: L.LatLng) => void;
}


const MapEvents = ({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};


const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    map.flyTo(center, map.getZoom());
    return null;
}

const Map: React.FC<MapProps> = ({ center, pickup, destination, onMapClick }) => {
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full rounded-lg z-0"
    >
      <ChangeView center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMapClick={onMapClick} />

      
      {pickup && (
        <Marker position={pickup} icon={defaultIcon}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination} icon={defaultIcon}>
          <Popup>Destination</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;