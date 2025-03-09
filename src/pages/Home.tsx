import { useAuth } from '@/contexts/AuthContext';
import { Shield, AlertTriangle as TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type Incident = {
  id: string;
  type: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  time: string;
  date: string;
  reportedBy: string;
};

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
  },
];

function IncidentCard({ incident }: { incident: Incident }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-3 h-3 rounded-full ${getSeverityColor(incident.severity)}`} />
        <h3 className="text-lg font-medium text-slate-900">{incident.type}</h3>
      </div>
      
      <p className={`text-slate-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
        {incident.description}
      </p>
      
      <div className={`mt-3 space-y-2 ${isExpanded ? 'block' : 'hidden'}`}>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-medium">Location:</span>
          {incident.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-medium">Time:</span>
          {incident.time} - {incident.date}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-medium">Reported by:</span>
          {incident.reportedBy}
        </div>
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 text-sm text-blue-500 hover:text-blue-600"
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-slate-900">Safety Feed</h1>
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
          <Shield className="w-5 h-5 text-blue-500" />
          <span className="font-medium">{user?.safetyScore || 0} pts</span>
        </div>
      </div>

      {mockIncidents.length === 0 ? (
        <div className="text-center py-12">
          <TriangleAlert className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-display font-semibold text-slate-900 mb-2">
            No Incidents Yet
          </h2>
          <p className="text-slate-600 mb-6">
            When incidents are reported, they will appear here.
          </p>
          <Link to="/report" className="button">
            Report an Incident
          </Link>
        </div>
      ) : (
        <div>
          {mockIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}