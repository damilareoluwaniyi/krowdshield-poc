import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataContext } from '@/context/DataContext';
import { TriangleAlert as AlertTriangle, ArrowLeft, MapPin, Building } from 'lucide-react-native';

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { locations, incidents } = useContext(DataContext);
  const [location, setLocation] = useState(null);
  const [locationIncidents, setLocationIncidents] = useState([]);
  
  useEffect(() => {
    // Find the location by ID
    const foundLocation = locations.find(loc => loc.id === id);
    setLocation(foundLocation);
    
    // Filter incidents for this location (in a real app, this would be more sophisticated)
    // Here we're just randomly assigning some incidents to this location
    const filteredIncidents = incidents.filter(() => Math.random() > 0.5);
    setLocationIncidents(filteredIncidents);
  }, [id, locations, incidents]);
  
  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Location Details</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading location details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Location Details</Text>
      </View>
      
      <View style={styles.locationHeader}>
        <View style={styles.locationIcon}>
          <Building size={24} color="#fff" />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{location.name}</Text>
          <View style={styles.locationAddressContainer}>
            <MapPin size={16} color="#7f8c8d" />
            <Text style={styles.locationAddress}>{location.address}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{location.safetyScore}</Text>
          <Text style={styles.statLabel}>Safety Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{locationIncidents.length}</Text>
          <Text style={styles.statLabel}>Incidents</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {locationIncidents.filter(inc => inc.severity === 'high').length}
          </Text>
          <Text style={styles.statLabel}>High Severity</Text>
        </View>
      </View>
      
      <View style={styles.incidentsContainer}>
        <Text style={styles.sectionTitle}>Recent Incidents</Text>
        
        {locationIncidents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No incidents reported at this location.</Text>
          </View>
        ) : (
          <FlatList
            data={locationIncidents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.incidentCard}>
                <View style={styles.incidentHeader}>
                  <View style={[styles.severityIndicator, { 
                    backgroundColor: 
                      item.severity === 'high' ? '#e74c3c' : 
                      item.severity === 'medium' ? '#f39c12' : '#2ecc71'
                  }]} />
                  <Text style={styles.incidentType}>{item.type}</Text>
                  <Text style={styles.incidentTime}>{item.time}</Text>
                </View>
                <Text style={styles.incidentDescription}>{item.description}</Text>
                <View style={styles.incidentFooter}>
                  <Text style={styles.incidentReporter}>Reported by {item.reportedBy}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  locationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  locationAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationAddress: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  incidentsContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  listContent: {
    paddingBottom: 16,
  },
  incidentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  incidentTime: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  incidentDescription: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 12,
  },
  incidentFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 8,
  },
  incidentReporter: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  emptyState: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#7f8c8d',
  },
});