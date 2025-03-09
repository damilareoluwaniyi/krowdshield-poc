import { createContext, useState, useEffect } from 'react';

// Define user type
type User = {
  id: string;
  username: string;
  role: 'individual' | 'business';
  safetyScore?: number;
};

// Define context type
type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUserScore: (points: number) => void;
  isAuthenticated: boolean;
};

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUserScore: () => {},
  isAuthenticated: false,
});

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored user on mount
  useEffect(() => {
    // In a real app, we would check AsyncStorage or SecureStore here
    // For this demo, we'll just use a mock user if needed
    const checkAuth = async () => {
      // Mock implementation
      const mockUser = null; // No stored user by default
      if (mockUser) {
        setUser(mockUser);
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    // In a real app, we would store the user in AsyncStorage or SecureStore
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // In a real app, we would clear AsyncStorage or SecureStore
  };

  // Update user's safety score
  const updateUserScore = (points: number) => {
    if (user && user.role === 'individual') {
      setUser({
        ...user,
        safetyScore: (user.safetyScore || 0) + points,
      });
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