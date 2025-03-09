import { NavLink } from 'react-router-dom';
import { Home, Map, Bell, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user } = useAuth();
  const isBusinessUser = user?.role === 'business';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-4">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 text-sm ${
                isActive ? 'text-blue-500' : 'text-slate-600'
              }`
            }
          >
            <Home size={20} />
            <span>{isBusinessUser ? 'Locations' : 'Feed'}</span>
          </NavLink>

          {!isBusinessUser && (
            <NavLink 
              to="/report" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 text-sm ${
                  isActive ? 'text-blue-500' : 'text-slate-600'
                }`
              }
            >
              <Bell size={20} />
              <span>Report</span>
            </NavLink>
          )}

          <NavLink 
            to="/map" 
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 text-sm ${
                isActive ? 'text-blue-500' : 'text-slate-600'
              }`
            }
          >
            <Map size={20} />
            <span>Map</span>
          </NavLink>

          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 text-sm ${
                isActive ? 'text-blue-500' : 'text-slate-600'
              }`
            }
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}