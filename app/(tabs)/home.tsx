import { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { DataContext } from '@/context/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, TriangleAlert as AlertTriangle, ChevronDown, MapPin, Clock, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

function IncidentCard({ incident, isExpanded, onToggle }) {
  const [animation] = useState(new Animated.Value(0));
  const router = useRouter();

  const toggleAnimation = () => {
    Animated.spring(animation, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: true,
    }).start();
    onToggle();
  };

  const rotateIcon = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const expandHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const handleViewOnMap = (e) => {
    e.stopPropagation(); // Prevent card expansion when clicking the button
    if (incident.coordinates) {
      router.push({
        pathname: '/map',
        params: {
          lat: incident.coordinates.latitude,
          lng: incident.coordinates.longitude,
          id: incident.id,
        },
      });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.incidentCard}
      onPress={toggleAnimation}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0)']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.incidentHeader}>
        <View style={styles.incidentHeaderLeft}>
          <View style={[
            styles.severityIndicator, 
            { backgroundColor: getSeverityColor(incident.severity) }
          ]} />
          <Text style={styles.incidentType}>{incident.type}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
          <ChevronDown size={20} color="#64748B" />
        </Animated.View>
      </View>

      <Text style={styles.incidentDescription} numberOfLines={isExpanded ? undefined : 2}>
        {incident.description}
      </Text>

      <Animated.View style={[
        styles.expandedContent,
        { height: expandHeight, opacity: animation }
      ]}>
        <View style={styles.detailRow}>
          <MapPin size={16} color="#64748B" />
          <Text style={styles.detailText}>{incident.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color="#64748B" />
          <Text style={styles.detailText}>
            {incident.time} - {incident.date}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <User size={16} color="#64748B" />
          <Text style={styles.detailText}>
            Reported by {incident.reportedBy}
          </Text>
        </View>

        {incident.coordinates && (
          <TouchableOpacity 
            style={styles.viewOnMapButton}
            onPress={handleViewOnMap}
          >
            <MapPin size={14} color="#3B82F6" />
            <Text style={styles.viewOnMapText}>View on Map</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const { incidents } = useContext(DataContext);
  const [expandedId, setExpandedId] = useState(null);
  const router = useRouter();

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety Feed</Text>
        <View style={styles.scoreContainer}>
          <Shield size={20} color="#3B82F6" />
          <Text style={styles.scoreText}>{user?.safetyScore || 0} pts</Text>
        </View>
      </View>
      
      {incidents.length === 0 ? (
        <View style={styles.emptyState}>
          <AlertTriangle size={48} color="#94A3B8" />
          <Text style={styles.emptyStateTitle}>No Incidents Yet</Text>
          <Text style={styles.emptyStateText}>
            When incidents are reported, they will appear here.
          </Text>
          <TouchableOpacity 
            style={styles.reportButton}
            onPress={() => router.push('/report')}
          >
            <Text style={styles.reportButtonText}>Report an Incident</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <IncidentCard
              incident={item}
              isExpanded={expandedId === item.id}
              onToggle={() => toggleExpanded(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1E293B',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
    color: '#1E293B',
  },
  listContent: {
    padding: 16,
  },
  incidentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  incidentType: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E293B',
  },
  incidentDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: 12,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  viewOnMapButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  viewOnMapText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  reportButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  reportButtonText: {
    fontFamily: 'Inter-Medium',
    color: '#fff',
    fontSize: 16,
  },
});