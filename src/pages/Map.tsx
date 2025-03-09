import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Map as MapIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock incidents with coordinates
const mockIncidents = [
  {
    id: 'inc-1',
    type: 'Theft',
    description: 'Laptop stolen from coffee shop',
    location: 'Downtown',
    coordinates: [40.7128, -74.006],
    severity: 'medium',
  },
  {
    id: 'inc-2',
    type: 'Suspicious Activity',
    location: 'Central Park',
    coordinates: [40.7829, -73.9654],
    description: 'Suspicious person in the area',
    severity: 'low',
  },
];

function HeatmapLayer({ points }: { points: number[][] }) {
  const map = useRef(null);
  const heatLayer = useRef(null);

  useEffect(() => {
    if (!map.current) return;

    if (!heatLayer.current) {
      heatLayer.current = L.heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        gradient: {
          0.4: '#3B82F6',
          0.6: '#F59E0B',
          0.8: '#EF4444'
        }
      }).addTo(map.current);
    } else {
      heatLayer.current.setLatLngs(points);
    }

    return () => {
      if (heatLayer.current) {
        heatLayer.current.remove();
      }
    };
  }, [points]);

  return null;
}

export default function MapView() {
  const navigate = useNavigate();
  const heatmapPoints = mockIncidents.map(incident => [
    ...incident.coordinates,
    incident.severity === 'high' ? 1 : incident.severity === 'medium' ? 0.6 : 0.3
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="flex items-center gap-3">
          <MapIcon className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-display font-bold text-slate-900">Safety Heat Map</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="h-[600px]">
          <MapContainer
            center={[40.7128, -74.006]}
            zoom={13}
            className="h-full w-full rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <HeatmapLayer points={heatmapPoints} />
            {mockIncidents.map((incident) => (
              <Marker
                key={incident.id}
                position={incident.coordinates as [number, number]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium text-slate-900">{incident.type}</h3>
                    <p className="text-sm text-slate-600 mt-1">{incident.description}</p>
                    <p className="text-sm text-slate-500 mt-1">{incident.location}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Incident Density</h3>
          <div className="h-2 bg-gradient-to-r from-blue-500 via-amber-500 to-red-500 rounded-full" />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-600">Low</span>
            <span className="text-xs text-slate-600">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}