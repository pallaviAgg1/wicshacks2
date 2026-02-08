// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { AlertTriangle, Accessibility, DoorOpen, Droplets, Music, ShieldAlert, Info, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ACL Zilker Park coordinates
const ACL_CENTER = [30.2669, -97.7729];

// Festival landmarks
const FESTIVAL_FEATURES = {
  stages: [
    { name: "American Express Stage", position: [30.2680, -97.7750], capacity: "high" },
    { name: "Honda Stage", position: [30.2655, -97.7710], capacity: "medium" },
    { name: "T-Mobile Stage", position: [30.2690, -97.7700], capacity: "medium" },
    { name: "Miller Lite Stage", position: [30.2645, -97.7760], capacity: "low" },
    { name: "BMI Stage", position: [30.2675, -97.7680], capacity: "low" },
  ],
  accessibility: [
    { name: "ADA Viewing - Main", position: [30.2678, -97.7745], type: "ada" },
    { name: "ADA Viewing - Honda", position: [30.2658, -97.7715], type: "ada" },
    { name: "Wheelchair Rental", position: [30.2660, -97.7770], type: "rental" },
    { name: "Accessible Restrooms", position: [30.2665, -97.7735], type: "restroom" },
  ],
  exits: [
    { name: "Main Entrance/Exit", position: [30.2640, -97.7730], type: "main" },
    { name: "North Exit", position: [30.2700, -97.7720], type: "exit" },
    { name: "East Exit", position: [30.2670, -97.7660], type: "exit" },
    { name: "ADA Entrance", position: [30.2642, -97.7745], type: "ada_exit" },
  ],
  medical: [
    { name: "Medical Tent - Central", position: [30.2668, -97.7730] },
    { name: "Medical Tent - North", position: [30.2695, -97.7715] },
  ],
  water: [
    { name: "Water Station 1", position: [30.2672, -97.7755] },
    { name: "Water Station 2", position: [30.2660, -97.7695] },
    { name: "Water Station 3", position: [30.2685, -97.7720] },
  ]
};

// Simulated crowd density zones
const CROWD_ZONES = [
  { center: [30.2680, -97.7750], radius: 80, density: "high", color: "#ef4444" },
  { center: [30.2655, -97.7710], radius: 60, density: "medium", color: "#f59e0b" },
  { center: [30.2690, -97.7700], radius: 50, density: "medium", color: "#f59e0b" },
  { center: [30.2645, -97.7760], radius: 40, density: "low", color: "#22c55e" },
];

const createCustomIcon = (color, icon) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      <span style="color: white; font-size: 16px;">${icon}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

function LocationMarker({ onLocationFound }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ watch: true, enableHighAccuracy: true });
    map.on('locationfound', (e) => {
      setPosition(e.latlng);
      onLocationFound?.(e.latlng);
    });
  }, [map, onLocationFound]);

  return position ? (
    <Marker
      position={position}
      icon={L.divIcon({
        className: 'user-marker',
        html: `<div style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 4px rgba(59,130,246,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })}
    >
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}

export default function FestivalMap({
  crowdReports = [],
  showCrowdDensity = true,
  showAccessibility = true,
  showExits = true,
  showStages = true,
  showWater = true,
  showMedical = true,
  onLocationFound,
  userLocation
}) {


  const getReportIcon = (type) => {
    const icons = {
      mud: { color: '#92400e', icon: '💧' },
      crowd_dense: { color: '#dc2626', icon: '👥' },
      obstacle: { color: '#f59e0b', icon: '⚠️' },
      flooding: { color: '#0ea5e9', icon: '🌊' },
      uneven_terrain: { color: '#78716c', icon: '⛰️' },
      blocked_path: { color: '#ef4444', icon: '🚫' },
      other: { color: '#6b7280', icon: '📍' },
    };
    return icons[type] || icons.other;
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <MapContainer
        center={ACL_CENTER}
        zoom={17}
        className="w-full h-full z-0"
        zoomControl={false}
        style={{
          filter: 'invert(1) hue-rotate(290deg) invert(1)'
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <LocationMarker onLocationFound={onLocationFound} />

        {/* Crowd Density Circles */}
        {showCrowdDensity && CROWD_ZONES.map((zone, idx) => (
          <Circle
            key={`density-${idx}`}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.3,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-center">
                <Badge className={`${zone.density === 'high' ? 'bg-red-500' : zone.density === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}>
                  {zone.density.toUpperCase()} DENSITY
                </Badge>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Stages */}
        {showStages && FESTIVAL_FEATURES.stages.map((stage, idx) => (
          <Marker
            key={`stage-${idx}`}
            position={stage.position}
            icon={createCustomIcon('#9333ea', '🎵')}
          >
            <Popup>
              <div className="font-semibold">{stage.name}</div>
              <Badge className={`mt-1 ${stage.capacity === 'high' ? 'bg-red-500' : stage.capacity === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}>
                {stage.capacity} crowd
              </Badge>
            </Popup>
          </Marker>
        ))}

        {/* Accessibility Features */}
        {showAccessibility && FESTIVAL_FEATURES.accessibility.map((feature, idx) => (
          <Marker
            key={`ada-${idx}`}
            position={feature.position}
            icon={createCustomIcon('#2563eb', '♿')}
          >
            <Popup>
              <div className="font-semibold text-blue-600">{feature.name}</div>
              <div className="text-sm text-gray-600">Accessibility Feature</div>
            </Popup>
          </Marker>
        ))}

        {/* Exits */}
        {showExits && FESTIVAL_FEATURES.exits.map((exit, idx) => (
          <Marker
            key={`exit-${idx}`}
            position={exit.position}
            icon={createCustomIcon('#16a34a', '🚪')}
          >
            <Popup>
              <div className="font-semibold text-green-600">{exit.name}</div>
              <div className="text-sm">
                {exit.type === 'ada_exit' && <Badge className="bg-blue-500">ADA Accessible</Badge>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Medical */}
        {showMedical && FESTIVAL_FEATURES.medical.map((med, idx) => (
          <Marker
            key={`med-${idx}`}
            position={med.position}
            icon={createCustomIcon('#dc2626', '🏥')}
          >
            <Popup>
              <div className="font-semibold text-red-600">{med.name}</div>
              <div className="text-sm">24/7 Medical Staff</div>
            </Popup>
          </Marker>
        ))}

        {/* Water Stations */}
        {showWater && FESTIVAL_FEATURES.water.map((water, idx) => (
          <Marker
            key={`water-${idx}`}
            position={water.position}
            icon={createCustomIcon('#0ea5e9', '💧')}
          >
            <Popup>
              <div className="font-semibold text-cyan-600">{water.name}</div>
              <div className="text-sm">Free Water Refill</div>
            </Popup>
          </Marker>
        ))}

        {/* User Reports */}
        {crowdReports.filter(r => r.status === 'active').map((report, idx) => {
          const iconConfig = getReportIcon(report.report_type);
          return (
            <Marker
              key={`report-${idx}`}
              position={[report.latitude, report.longitude]}
              icon={createCustomIcon(iconConfig.color, iconConfig.icon)}
            >
              <Popup>
                <div className="font-semibold capitalize">{report.report_type.replace('_', ' ')}</div>
                {report.description && <div className="text-sm text-gray-600">{report.description}</div>}
                <Badge className={`mt-1 ${report.severity === 'high' ? 'bg-red-500' : report.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}>
                  {report.severity} severity
                </Badge>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>


    </div>
  );
}