import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

export default function HeatmapLayer({ points, radius = 25, blur = 20, max = 5}) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius, blur, max
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map, radius, blur, max]);

  return null;
}
