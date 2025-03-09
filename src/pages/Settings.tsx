import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Moon, 
  LogOut,
  ChevronRight,
  Camera
} from 'lucide-react';

type NotificationPreference = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export default function Settings() {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([
    {
      id: 'new-incidents',
      label: 'New Incidents',
      description: 'Get notified when new incidents are reported in your area',
      enabled: true,
    },
    {
      id: 'high-severity',
      label: 'High Severity Alerts',
      description: 'Immediate notifications for high-severity incidents',
      enabled: true,
    },
    {
      id: 'safety-score',
      label: 'Safety Score Updates',
      description: 'Get notified when your safety score changes',
      enabled: false,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotificationPreferences(prefs =>
      prefs.map(pref =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-display font-bold text-slate-900">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-slate-200 shadow-sm">
              <Camera className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-medium text-slate-900">{user?.username}</h2>
            <p className="text-sm text-slate-500">
              {user?.role === 'business' ? 'Business Account' : 'Individual Account'}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-slate-900">Safety Score</span>
            </div>
            <span className="font-medium text-slate-900">{user?.safetyScore || 0} points</span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-medium text-slate-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          {notificationPreferences.map((pref) => (
            <div key={pref.id} className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900">{pref.label}</h3>
                <p className="text-sm text-slate-500">{pref.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={pref.enabled}
                  onChange={() => toggleNotification(pref.id)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* App Preferences */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-medium text-slate-900">App Preferences</h2>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-slate-600" />
            <span className="text-slate-900">Dark Mode</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isDarkMode}
              onChange={(e) => setIsDarkMode(e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card space-y-2">
        <button className="w-full p-4 text-left hover:bg-slate-50 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-900">Privacy Policy</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </button>
        <button className="w-full p-4 text-left hover:bg-slate-50 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-slate-900">Terms of Service</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </button>
        <button 
          onClick={logout}
          className="w-full p-4 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </div>
        </button>
      </div>
    </div>
  );
}