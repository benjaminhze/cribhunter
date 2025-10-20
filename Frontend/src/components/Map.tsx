import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../context/ThemeContext';
interface MapProps {
  lat: number;
  lng: number;
  address: string;
}
const Map: React.FC<MapProps> = ({
  lat,
  lng,
  address
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  // Read theme to keep existing dependencies intact, but map tiles will not change with theme
  const { theme } = useTheme();
  useEffect(() => {
    if (!mapRef.current) return;
    // Initialize map only if it doesn't exist
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([lat, lng], 15);
      // Always use light tile layer regardless of theme
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      });
      tileLayer.addTo(map);
      // Add marker
      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(address).openPopup();
      mapInstanceRef.current = map;
    } else {
      // If map already exists, just update the view and marker
      mapInstanceRef.current.setView([lat, lng], 15);
      // Clear existing layers
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.TileLayer || layer instanceof L.Marker) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });
      // Always use light tile layer regardless of theme
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      });
      tileLayer.addTo(mapInstanceRef.current);
      // Add marker
      const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current);
      marker.bindPopup(address).openPopup();
    }
    // Cleanup function
    return () => {
      // We don't destroy the map on unmount to prevent re-initialization issues
      // If needed, this could be changed to destroy the map
    };
  }, [lat, lng, address, theme]);
  return <div ref={mapRef} className="w-full h-full" />;
};
export default Map;