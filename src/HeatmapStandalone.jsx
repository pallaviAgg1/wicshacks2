import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import detectionsByFrame from "./detections.json";

function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    const layer = L.heatLayer(points, { radius: 25, blur: 20 }).addTo(map);
    return () => map.removeLayer(layer);
  }, [points, map]);
  return null;
}

export default function HeatmapStandalone() {
  const points = Object.values(detectionsByFrame).flat().map(p => [
    p.lat,
    p.lon,
    p.weight || 1
  ]);

  return (
    <MapContainer
      center={[30.26582, -97.76914]}
      zoom={17}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <HeatmapLayer points={points} />
    </MapContainer>
  );
}
