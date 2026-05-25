import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * Provides authentication state and actions to the entire app.
 * Stores JWT token and user info in localStorage for persistence.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('rpa_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('rpa_user');
        localStorage.removeItem('rpa_token');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Save auth data after successful login or registration.
   */
  const login = (authResponse) => {
    const userData = {
      userId: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
    };
    localStorage.setItem('rpa_token', authResponse.token);
    localStorage.setItem('rpa_user', JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * Clear auth data and redirect to login.
   */
  const logout = () => {
    localStorage.removeItem('rpa_token');
    localStorage.removeItem('rpa_user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isCompany = user?.role === 'Company';

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, isCompany, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context from any component.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
