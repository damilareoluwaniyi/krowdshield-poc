import { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { DataContext } from '@/context/DataContext';
import { MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import map components only for web platform
let MapContainer, TileLayer, Marker, Popup, useMap;

if (Platform.OS === 'web') {
  const ReactLeaflet = require('react-leaflet');
  MapContainer = ReactLeaflet.MapContainer;
  TileLayer = ReactLeaflet.TileLayer;
  Marker = ReactLeaflet.Marker;
  Popup = ReactLeaflet.Popup;
  useMap = ReactLeaflet.useMap;
}

// Leaflet CSS loader component
function LeafletCSS() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      return () => document.head.removeChild(link);
    }
  }, []);
  
  return null;
}

// Custom heat map component for react-leaflet
function HeatmapLayer({ points }) {
  const map = useMap();
  const heatRef = useRef();
  
  useEffect(() => {
    if (Platform.OS === 'web') {
      const L = require('leaflet');
      require('leaflet.heat');
      
      if (!heatRef.current) {
        heatRef.current = L.heatLayer(points, {
          radius: 25,
          blur: 15,
          maxZoom: 10,
          gradient: {
            0.4: '#3B82F6',
            0.6: '#F59E0B',
            0.8: '#EF4444'
          }
        }).addTo(map);
      } else {
        heatRef.current.setLatLngs(points);
      }
    }
  }, [points, map]);
  
  return null;
}

// Function to handle URL parameters and center map on incident
function MapController({ lat, lng, id }) {
  const map = useMap();
  
  useEffect(() => {
    if (lat && lng) {
      map.setView([parseFloat(lat), parseFloat(lng)], 16);
      
      // Find and open popup for the incident if ID is provided
      if (id) {
        const markers = document.querySelectorAll('.leaflet-marker-icon');
        markers.forEach(marker => {
          if (marker.getAttribute('data-incident-id') === id) {
            marker.click();
          }
        });
      }
    }
  }, [lat, lng, id, map]);

  return null;
}

// Web map component
function WebMap({ incidents, heatmapPoints, center, selectedIncident, setSelectedIncident, focusParams }) {
  return (
    <View style={styles.mapContainer}>
      <LeafletCSS />
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <HeatmapLayer points={heatmapPoints} />
        
        {incidents.map(incident => (
          <Marker
            key={incident.id}
            position={[incident.coordinates.latitude, incident.coordinates.longitude]}
            eventHandlers={{
              click: () => setSelectedIncident(incident)
            }}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `<div class="marker" data-incident-id="${incident.id}"></div>`,
            })}
          >
            {selectedIncident === incident && (
              <Popup>
                <div>
                  <h3 style={{ margin: '0 0 8px', color: '#1E293B', fontSize: '16px' }}>
                    {incident.type}
                  </h3>
                  <p style={{ margin: '0 0 4px', color: '#64748B', fontSize: '14px' }}>
                    {incident.description}
                  </p>
                  <p style={{ margin: '0', color: '#94A3B8', fontSize: '12px' }}>
                    {incident.time} - {incident.date}
                  </p>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
        
        {focusParams && (
          <MapController
            lat={focusParams.lat}
            lng={focusParams.lng}
            id={focusParams.id}
          />
        )}
      </MapContainer>
    </View>
  );
}

export default function MapScreen() {
  const { incidents } = useContext(DataContext);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const params = useLocalSearchParams();
  
  // Convert incidents to heat map points
  const heatmapPoints = incidents
    .filter(incident => incident.coordinates)
    .map(incident => [
      incident.coordinates.latitude,
      incident.coordinates.longitude,
      // Weight based on severity
      incident.severity === 'high' ? 1 :
      incident.severity === 'medium' ? 0.6 : 0.3
    ]);
  
  // Center map on average coordinates
  const center = heatmapPoints.length > 0
    ? [
        heatmapPoints.reduce((sum, point) => sum + point[0], 0) / heatmapPoints.length,
        heatmapPoints.reduce((sum, point) => sum + point[1], 0) / heatmapPoints.length
      ]
    : [40.7128, -74.006]; // Default to NYC
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety Heat Map</Text>
        <Text style={styles.headerSubtitle}>
          {incidents.length} incidents reported
        </Text>
      </View>
      
      {Platform.OS === 'web' ? (
        <WebMap
          incidents={incidents}
          heatmapPoints={heatmapPoints}
          center={center}
          selectedIncident={selectedIncident}
          setSelectedIncident={setSelectedIncident}
          focusParams={params.lat && params.lng ? params : null}
        />
      ) : (
        <View style={styles.fallbackContainer}>
          <MapPin size={48} color="#3B82F6" />
          <Text style={styles.fallbackText}>
            Please use the web version to view the heat map
          </Text>
        </View>
      )}
      
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Incident Density</Text>
        <LinearGradient
          colors={['#3B82F6', '#F59E0B', '#EF4444']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.legendGradient}
        />
        <View style={styles.legendLabels}>
          <Text style={styles.legendLabel}>Low</Text>
          <Text style={styles.legendLabel}>Medium</Text>
          <Text style={styles.legendLabel}>High</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1e293b',
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  legend: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  legendTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 12,
  },
  legendGradient: {
    height: 8,
    borderRadius: 4,
  },
  legendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fallbackText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    textAlign: 'center',
  },
  '@global': Platform.select({
    web: {
      '.custom-marker': {
        background: 'none',
        border: 'none',
      },
      '.marker': {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#3B82F6',
        border: '2px solid #fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
      },
      '.marker:hover': {
        transform: 'scale(1.1)',
      },
    },
    default: {},
  }),
});