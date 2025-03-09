import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, Camera } from 'lucide-react';

const incidentTypes = [
  { id: 'theft', label: 'Theft' },
  { id: 'assault', label: 'Assault' },
  { id: 'suspicious', label: 'Suspicious Activity' },
  { id: 'vandalism', label: 'Vandalism' },
  { id: 'other', label: 'Other' },
];

const severityLevels = [
  { id: 'low', label: 'Low', color: 'bg-emerald-500' },
  { id: 'medium', label: 'Medium', color: 'bg-amber-500' },
  { id: 'high', label: 'High', color: 'bg-red-500' },
];

export default function Report() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    description: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Navigate back to home
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Bell className="w-6 h-6 text-red-500" />
        <h1 className="text-2xl font-display font-bold text-slate-900">Report an Incident</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Incident Type</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {incidentTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`p-3 text-center rounded-lg border ${
                  formData.type === type.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setFormData({ ...formData, type: type.id })}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Severity</label>
          <div className="flex gap-2">
            {severityLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                className={`flex-1 p-3 rounded-lg border ${
                  formData.severity === level.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setFormData({ ...formData, severity: level.id })}
              >
                <div className={`w-2 h-2 rounded-full ${level.color} mx-auto mb-1`} />
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea
            id="description"
            rows={4}
            className="input"
            placeholder="Describe what happened..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="location" className="label">Location</label>
          <div className="flex gap-2">
            <input
              id="location"
              type="text"
              className="input flex-1"
              placeholder="Enter location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <button
              type="button"
              className="button-secondary flex items-center gap-2"
              onClick={() => {
                // Mock getting current location
                setFormData({
                  ...formData,
                  location: 'Current Location',
                });
              }}
            >
              <MapPin className="w-4 h-4" />
              <span>Use Current</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          className="w-full p-4 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700"
        >
          <div className="flex items-center justify-center gap-2">
            <Camera className="w-5 h-5" />
            <span>Add Photo Evidence</span>
          </div>
        </button>

        <button
          type="submit"
          className="button w-full py-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}