import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type User = {
  id: string;
  username: string;
  role: 'individual' | 'business';
  safetyScore?: number;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string, isBusinessAccount: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUserScore: (points: number) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  updateUserScore: async () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored session
    const checkAuth = async () => {
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const storedUser = localStorage.getItem('mockUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string, isBusinessAccount: boolean) => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      // Mock login
      const mockUser: User = {
        id: `user-${Date.now()}`,
        username,
        role: isBusinessAccount ? 'business' : 'individual',
        safetyScore: 50,
      };
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
    } else {
      // Real Supabase login
      const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      });

      if (error) throw error;

      if (authUser) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
    }
  };

  const logout = async () => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      localStorage.removeItem('mockUser');
    } else {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserScore = async (points: number) => {
    if (!user || user.role !== 'individual') return;

    const newScore = (user.safetyScore || 0) + points;

    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      const updatedUser = { ...user, safetyScore: newScore };
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } else {
      const { data: updatedUser } = await supabase
        .from('users')
        .update({ safety_score: newScore })
        .eq('id', user.id)
        .select()
        .single();

      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserScore,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);