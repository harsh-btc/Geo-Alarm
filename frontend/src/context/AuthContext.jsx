import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('geoalarm_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('geoalarm_token'));
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback((userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('geoalarm_user', JSON.stringify(userData));
    localStorage.setItem('geoalarm_token', tokenData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('geoalarm_user');
    localStorage.removeItem('geoalarm_token');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await getMe();
      setUser(data.user);
      localStorage.setItem('geoalarm_user', JSON.stringify(data.user));
    } catch { /* silent */ }
  }, []);

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (token) {
        try {
          const { data } = await getMe();
          setUser(data.user);
          localStorage.setItem('geoalarm_user', JSON.stringify(data.user));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    verify();
  }, []); // eslint-disable-line

  return (
    <AuthContext.Provider value={{ user, token, loading, persistAuth, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
