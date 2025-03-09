import { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { config } from '@/lib/config';
import { supabase } from '@/lib/supabase';

// Define types
type Incident = {
  id: string;
  type: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  time: string;
  date: string;
  reportedBy: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

type Location = {
  id: string;
  name: string;
  address: string;
  safetyScore: number;
  recentIncidents: number;
};

type DataContextType = {
  incidents: Incident[];
  locations: Location[];
  addIncident: (incident: Incident) => Promise<void>;
  addLocation: (location: Location) => Promise<void>;
};

// Create context with default values
export const DataContext = createContext<DataContextType>({
  incidents: [],
  locations: [],
  addIncident: async () => {},
  addLocation: async () => {},
});

// Mock data
const mockIncidents: Incident[] = [
  {
    id: 'inc-1',
    type: 'Theft',
    description: 'Laptop stolen from coffee shop',
    location: 'Downtown, Main St & 5th Ave',
    severity: 'medium',
    time: '10:30 AM',
    date: '2025-03-15',
    reportedBy: 'john_doe',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  },
  {
    id: 'inc-2',
    type: 'Suspicious Activity',
    description: 'Person looking into parked cars',
    location: 'Central Park, East Entrance',
    severity: 'low',
    time: '2:15 PM',
    date: '2025-03-15',
    reportedBy: 'safety_first',
    coordinates: {
      latitude: 40.7641,
      longitude: -73.9733,
    },
  },
  {
    id: 'inc-3',
    type: 'Assault',
    description: 'Verbal altercation that escalated',
    location: 'Financial District, Wall St',
    severity: 'high',
    time: '8:45 PM',
    date: '2025-03-14',
    reportedBy: 'city_watcher',
    coordinates: {
      latitude: 40.7068,
      longitude: -74.0089,
    },
  },
];

const mockLocations: Location[] = [
  {
    id: 'loc-1',
    name: 'Downtown Office',
    address: '123 Main St, Suite 500',
    safetyScore: 85,
    recentIncidents: 2,
  },
  {
    id: 'loc-2',
    name: 'Retail Store - North',
    address: '789 Market Ave',
    safetyScore: 92,
    recentIncidents: 1,
  },
  {
    id: 'loc-3',
    name: 'Warehouse District',
    address: '456 Industrial Blvd',
    safetyScore: 68,
    recentIncidents: 4,
  },
];

// Data provider component
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // Initialize data based on environment
  useEffect(() => {
    if (config.useMockData) {
      setIncidents(mockIncidents);
      setLocations(mockLocations);
    } else {
      // Load data from Supabase
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      // Load incidents
      const { data: incidentData, error: incidentError } = await supabase
        .from('incidents')
        .select('*');
      
      if (incidentError) throw incidentError;
      if (incidentData) setIncidents(incidentData as Incident[]);

      // Load locations
      const { data: locationData, error: locationError } = await supabase
        .from('locations')
        .select('*');
      
      if (locationError) throw locationError;
      if (locationData) setLocations(locationData as Location[]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Add a new incident
  const addIncident = async (incident: Incident) => {
    if (config.useMockData) {
      setIncidents((prev) => [incident, ...prev]);
    } else {
      try {
        const { error } = await supabase
          .from('incidents')
          .insert(incident);
        
        if (error) throw error;
        
        // Reload data to get updated list
        await loadData();
      } catch (error) {
        console.error('Error adding incident:', error);
        throw error;
      }
    }
  };

  // Add a new location
  const addLocation = async (location: Location) => {
    if (config.useMockData) {
      setLocations((prev) => [location, ...prev]);
    } else {
      try {
        const { error } = await supabase
          .from('locations')
          .insert(location);
        
        if (error) throw error;
        
        // Reload data to get updated list
        await loadData();
      } catch (error) {
        console.error('Error adding location:', error);
        throw error;
      }
    }
  };

  // Simulate real-time incident updates in mock mode
  useEffect(() => {
    if (!config.useMockData) return;

    const interval = setInterval(() => {
      // 10% chance of a new random incident every 30 seconds
      if (Math.random() < 0.1) {
        const types = ['Theft', 'Vandalism', 'Suspicious Activity', 'Assault', 'Other'];
        const locations = [
          'Downtown, Main St & 5th Ave',
          'Central Park, East Entrance',
          'Financial District, Wall St',
          'Midtown, 42nd St & Broadway',
          'Chinatown, Canal St'
        ];
        const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
        const reporters = ['john_doe', 'safety_first', 'city_watcher', 'alert_citizen', 'neighborhood_watch'];
        
        const newIncident: Incident = {
          id: `inc-auto-${Date.now()}`,
          type: types[Math.floor(Math.random() * types.length)],
          description: `Automated incident report for demonstration purposes`,
          location: locations[Math.floor(Math.random() * locations.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString(),
          reportedBy: reporters[Math.floor(Math.random() * reporters.length)],
          coordinates: {
            latitude: 40.7128 + (Math.random() * 0.1 - 0.05),
            longitude: -74.006 + (Math.random() * 0.1 - 0.05),
          },
        };
        
        addIncident(newIncident);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [config.useMockData]);

  return (
    <DataContext.Provider
      value={{
        incidents,
        locations,
        addIncident,
        addLocation,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}