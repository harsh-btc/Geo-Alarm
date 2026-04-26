import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

// Dynamically import Leaflet to avoid SSR issues
let L;

export default function MapPicker({ selectedLocation, onLocationSelect, userPosition }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const userMarkerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Dynamically load Leaflet
    import('leaflet').then((leaflet) => {
      L = leaflet.default;

      if (mapInstanceRef.current) return;

      // Default center: world center or user position
      const center = userPosition
        ? [userPosition.lat, userPosition.lng]
        : [20, 0];

      const map = L.map(containerRef.current, {
        center,
        zoom: userPosition ? 13 : 2,
        zoomControl: true,
        attributionControl: false,
      });

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap ©CartoDB',
        maxZoom: 19,
      }).addTo(map);

      // Click to place marker
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        placeMarker(map, lat, lng, selectedLocation?.radius || 200);
        if (onLocationSelect) {
          onLocationSelect({ lat, lng });
        }
      });

      mapInstanceRef.current = map;

      // If there's already a selected location, show it
      if (selectedLocation) {
        placeMarker(map, selectedLocation.lat, selectedLocation.lng, selectedLocation.radius || 200);
      }

      // Show user position
      if (userPosition) {
        addUserMarker(map, userPosition.lat, userPosition.lng);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update radius circle when radius changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation || !L) return;
    if (circleRef.current) {
      circleRef.current.setRadius(selectedLocation.radius || 200);
    }
  }, [selectedLocation?.radius]);

  // Update user position marker
  useEffect(() => {
    if (!mapInstanceRef.current || !userPosition || !L) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userPosition.lat, userPosition.lng]);
    } else {
      addUserMarker(mapInstanceRef.current, userPosition.lat, userPosition.lng);
    }
  }, [userPosition?.lat, userPosition?.lng]);

  function placeMarker(map, lat, lng, radius) {
    // Remove existing
    if (markerRef.current) map.removeLayer(markerRef.current);
    if (circleRef.current) map.removeLayer(circleRef.current);

    // Custom icon
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width: 32px; height: 32px;
        background: linear-gradient(135deg, #00d4ff, #7c3aed);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 0 15px rgba(0,212,255,0.6);
        display:flex; align-items:center; justify-content:center;
      "><div style="transform:rotate(45deg); color:white; font-size:12px;">📍</div></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);
    const circle = L.circle([lat, lng], {
      radius,
      color: '#00d4ff',
      fillColor: '#00d4ff',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '6, 4',
    }).addTo(map);

    markerRef.current = marker;
    circleRef.current = circle;
  }

  function addUserMarker(map, lat, lng) {
    const icon = L.divIcon({
      className: '',
      html: `<div style="position:relative; width:20px; height:20px;">
        <div style="
          position:absolute; inset:0; border-radius:50%;
          background: rgba(16,217,138,0.3);
          animation: pulse-ring 1.5s ease-out infinite;
        "></div>
        <div style="
          position:absolute; inset:4px; border-radius:50%;
          background: #10d98a;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(16,217,138,0.8);
        "></div>
      </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);
    userMarkerRef.current = marker;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
      />
      {/* Overlay hint */}
      <div style={{
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(8,12,20,0.85)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-full)',
        padding: '6px 14px',
        fontSize: '12px', color: 'var(--text-secondary)',
        display: 'flex', alignItems: 'center', gap: '6px',
        pointerEvents: 'none', whiteSpace: 'nowrap',
        backdropFilter: 'blur(10px)',
        zIndex: 500,
      }}>
        <MapPin size={12} color="var(--accent)" />
        Click on the map to set alarm location
      </div>
    </div>
  );
}
