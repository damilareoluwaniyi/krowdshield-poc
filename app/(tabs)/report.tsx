import { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '@/context/AuthContext';
import { DataContext } from '@/context/DataContext';
import { MapPin, Camera, TriangleAlert as AlertTriangle } from 'lucide-react-native';

const incidentTypes = [
  { id: 'theft', label: 'Theft', icon: 'package' },
  { id: 'assault', label: 'Assault', icon: 'alert-triangle' },
  { id: 'suspicious', label: 'Suspicious Activity', icon: 'eye' },
  { id: 'vandalism', label: 'Vandalism', icon: 'tool' },
  { id: 'other', label: 'Other', icon: 'more-horizontal' },
];

const severityLevels = [
  { id: 'low', label: 'Low', color: '#2ecc71' },
  { id: 'medium', label: 'Medium', color: '#f39c12' },
  { id: 'high', label: 'High', color: '#e74c3c' },
];

export default function ReportScreen() {
  const router = useRouter();
  const { user, updateUserScore } = useContext(AuthContext);
  const { addIncident } = useContext(DataContext);
  
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock getting current location
  const getCurrentLocation = () => {
    // In a real app, we would use Expo Location here
    const mockLocations = [
      'Downtown, Main St & 5th Ave',
      'Central Park, East Entrance',
      'Financial District, Wall St',
      'Midtown, 42nd St & Broadway',
      'Chinatown, Canal St'
    ];
    setLocation(mockLocations[Math.floor(Math.random() * mockLocations.length)]);
  };

  const handleSubmit = () => {
    if (!incidentType || !description || !location || !severity) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Create new incident
    const newIncident = {
      id: `inc-${Date.now()}`,
      type: incidentTypes.find(t => t.id === incidentType)?.label || incidentType,
      description,
      location,
      severity,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      reportedBy: user?.username || 'Anonymous',
      coordinates: {
        latitude: 40.7128 + (Math.random() * 0.02 - 0.01),
        longitude: -74.006 + (Math.random() * 0.02 - 0.01),
      }
    };

    // Add incident to context
    addIncident(newIncident);
    
    // Update user's safety score
    updateUserScore(10);
    
    // Show success message and navigate back
    Alert.alert(
      'Incident Reported',
      'Thank you for helping keep the community safe! You earned 10 safety points.',
      [{ text: 'OK', onPress: () => router.push('/home') }]
    );
    
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <AlertTriangle size={24} color="#e74c3c" />
          <Text style={styles.headerTitle}>Report an Incident</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Incident Type</Text>
        <View style={styles.typeContainer}>
          {incidentTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeButton,
                incidentType === type.id && styles.typeButtonSelected
              ]}
              onPress={() => setIncidentType(type.id)}
            >
              <Text 
                style={[
                  styles.typeButtonText,
                  incidentType === type.id && styles.typeButtonTextSelected
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Severity</Text>
        <View style={styles.severityContainer}>
          {severityLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.severityButton,
                severity === level.id && { backgroundColor: level.color },
              ]}
              onPress={() => setSeverity(level.id)}
            >
              <Text 
                style={[
                  styles.severityButtonText,
                  severity === level.id && styles.severityButtonTextSelected
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Describe what happened..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={styles.locationInput}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <MapPin size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.photoButton}
          onPress={() => Alert.alert('Camera', 'This would open the camera in a real app')}
        >
          <Camera size={20} color="#3498db" />
          <Text style={styles.photoButtonText}>Add Photo Evidence</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#3498db',
  },
  typeButtonText: {
    color: '#7f8c8d',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  severityContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  severityButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 4,
  },
  severityButtonText: {
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  severityButtonTextSelected: {
    color: '#fff',
  },
  descriptionInput: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    height: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  locationInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  locationButton: {
    backgroundColor: '#3498db',
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginLeft: 8,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  photoButtonText: {
    color: '#3498db',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});