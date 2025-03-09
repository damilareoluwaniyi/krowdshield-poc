import { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataContext } from '@/context/DataContext';
import { ChartBar as BarChart2, TrendingUp, TriangleAlert as AlertTriangle, Package, Eye } from 'lucide-react-native';

// Mock chart component
function MockBarChart({ data, title }) {
  const maxValue = Math.max(...data.values);
  
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chart}>
        {data.labels.map((label, index) => (
          <View key={index} style={styles.barContainer}>
            <View 
              style={[
                styles.bar, 
                { 
                  height: (data.values[index] / maxValue) * 100, 
                  backgroundColor: data.colors[index] 
                }
              ]} 
            />
            <Text style={styles.barLabel}>{label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.chartNote}>
        (In a real app, this would use a proper charting library)
      </Text>
    </View>
  );
}

export default function AnalyticsScreen() {
  const { incidents, locations } = useContext(DataContext);
  
  // Calculate incident types
  const incidentTypes = incidents.reduce((acc, incident) => {
    acc[incident.type] = (acc[incident.type] || 0) + 1;
    return acc;
  }, {});
  
  // Calculate incident severity
  const incidentSeverity = incidents.reduce((acc, incident) => {
    acc[incident.severity] = (acc[incident.severity] || 0) + 1;
    return acc;
  }, { high: 0, medium: 0, low: 0 });
  
  // Prepare chart data
  const typeChartData = {
    labels: Object.keys(incidentTypes).slice(0, 5),
    values: Object.values(incidentTypes).slice(0, 5),
    colors: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6']
  };
  
  const severityChartData = {
    labels: ['High', 'Medium', 'Low'],
    values: [
      incidentSeverity.high || 0, 
      incidentSeverity.medium || 0, 
      incidentSeverity.low || 0
    ],
    colors: ['#e74c3c', '#f39c12', '#2ecc71']
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView>
        <View style={styles.header}>
          <BarChart2 size={24} color="#3498db" />
          <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <AlertTriangle size={20} color="#e74c3c" />
            <Text style={styles.statValue}>{incidents.length}</Text>
            <Text style={styles.statLabel}>Total Incidents</Text>
          </View>
          
          <View style={styles.statCard}>
            <Eye size={20} color="#3498db" />
            <Text style={styles.statValue}>{locations.length}</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#2ecc71" />
            <Text style={styles.statValue}>
              {Math.round(incidents.length / Math.max(1, locations.length))}
            </Text>
            <Text style={styles.statLabel}>Avg per Location</Text>
          </View>
        </View>
        
        <MockBarChart 
          data={typeChartData} 
          title="Incidents by Type" 
        />
        
        <MockBarChart 
          data={severityChartData} 
          title="Incidents by Severity" 
        />
        
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Key Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightText}>
              {incidents.length > 0 
                ? `Most common incident type: ${typeChartData.labels[0]}`
                : 'No incidents reported yet'
              }
            </Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightText}>
              {incidents.length > 0 
                ? `${Math.round((incidentSeverity.high / incidents.length) * 100)}% of incidents are high severity`
                : 'No incidents reported yet'
              }
            </Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightText}>
              {locations.length > 0 && incidents.length > 0
                ? `Location with most incidents: ${locations[0].name}`
                : 'Add more locations to see insights'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
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
    marginVertical: 8,
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  chart: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#7f8c8d',
  },
  chartNote: {
    fontSize: 10,
    color: '#95a5a6',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  insightsContainer: {
    padding: 16,
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  insightText: {
    fontSize: 14,
    color: '#34495e',
  },
});