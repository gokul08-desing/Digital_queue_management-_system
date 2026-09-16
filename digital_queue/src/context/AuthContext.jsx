import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredJwt, setStoredJwt } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dq_user');
      const token = getStoredJwt();
      return (saved && token) ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dq_user');
    }
  }, [user]);

  // Validate stored JWT on startup with /api/auth/me
  useEffect(() => {
    const token = getStoredJwt();
    if (token) {
      api.getCurrentUser()
        .then((userData) => {
          if (userData) {
            setUser(userData);
          }
        })
        .catch((err) => {
          if (err.status === 401) {
            logout();
          }
        });
    }
  }, []);

  const login = async (phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.loginUser(phone, password);
      if (res && res.user) {
        setUser(res.user);
      }
      return res;
    } catch (err) {
      setError(err.message || 'Login failed. Check phone and password.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async () => {
    return login('9876543210', 'Demo@123');
  };

  const logout = () => {
    setStoredJwt(null);
    setUser(null);
    localStorage.removeItem('dq_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!getStoredJwt(),
        login,
        loginAsDemo,
        logout,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
