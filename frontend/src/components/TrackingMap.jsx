import { useEffect, useRef } from 'react';
import { haversineDistance, formatDistance } from '../utils/haversine';

let L;

export default function TrackingMap({ alarms, userPosition }) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const alarmLayersRef = useRef({});

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      L = leaflet.default;
      if (mapInstanceRef.current) return;

      const center = userPosition
        ? [userPosition.lat, userPosition.lng]
        : [20, 0];

      const map = L.map(containerRef.current, {
        center,
        zoom: userPosition ? 13 : 2,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      renderAlarms(map);
      if (userPosition) updateUserMarker(map, userPosition);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !L) return;
    renderAlarms(mapInstanceRef.current);
  }, [alarms]);

  useEffect(() => {
    if (!mapInstanceRef.current || !userPosition || !L) return;
    updateUserMarker(mapInstanceRef.current, userPosition);
  }, [userPosition?.lat, userPosition?.lng]);

  function renderAlarms(map) {
    if (!L || !alarms) return;

    // Clear old layers
    Object.values(alarmLayersRef.current).forEach((layer) => {
      map.removeLayer(layer.marker);
      map.removeLayer(layer.circle);
    });
    alarmLayersRef.current = {};

    alarms.forEach((alarm) => {
      if (!alarm.isActive) return;

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #00d4ff, #7c3aed);
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 0 12px rgba(0,212,255,0.5);
          display:flex; align-items:center; justify-content:center;
          font-size: 12px;
        ">🔔</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const dist = userPosition
        ? haversineDistance(userPosition.lat, userPosition.lng, alarm.latitude, alarm.longitude)
        : null;

      const popupContent = `
        <div style="font-family: DM Sans, sans-serif; min-width: 180px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${alarm.locationName}</div>
          <div style="color: #8892a4; font-size: 12px;">Radius: ${alarm.radius}m</div>
          ${dist ? `<div style="color: #00d4ff; font-size: 12px; margin-top: 4px;">Your distance: ${formatDistance(dist)}</div>` : ''}
        </div>
      `;

      const marker = L.marker([alarm.latitude, alarm.longitude], { icon })
        .addTo(map)
        .bindPopup(popupContent);

      const isNear = dist !== null && dist <= alarm.radius;
      const circle = L.circle([alarm.latitude, alarm.longitude], {
        radius: alarm.radius,
        color: isNear ? '#10d98a' : '#00d4ff',
        fillColor: isNear ? '#10d98a' : '#00d4ff',
        fillOpacity: isNear ? 0.12 : 0.06,
        weight: isNear ? 2 : 1.5,
        dashArray: '6, 4',
      }).addTo(map);

      alarmLayersRef.current[alarm._id] = { marker, circle };
    });
  }

  function updateUserMarker(map, pos) {
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([pos.lat, pos.lng]);
    } else {
      const icon = L.divIcon({
        className: '',
        html: `<div style="position:relative; width:24px; height:24px;">
          <div style="position:absolute; inset:0; border-radius:50%; background:rgba(16,217,138,0.3); animation: pulse-ring 1.5s ease-out infinite;"></div>
          <div style="position:absolute; inset:5px; border-radius:50%; background:#10d98a; border:2px solid white; box-shadow:0 0 10px rgba(16,217,138,0.8);"></div>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker = L.marker([pos.lat, pos.lng], { icon }).addTo(map).bindPopup('📍 You are here');
      userMarkerRef.current = marker;
    }
    map.setView([pos.lat, pos.lng], map.getZoom());
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />
  );
}
