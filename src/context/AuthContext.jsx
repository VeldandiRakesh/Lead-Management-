import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('leadflow_token');
      if (token) {
        try {
          // Fetch current user session details
          const response = await api.get('/auth/me');
          if (response.data?.success) {
            setUser(response.data.data);
          } else {
            handleLocalClear();
          }
        } catch (error) {
          console.error('[AuthContext] Verification of session failed:', error.message);
          handleLocalClear();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const handleLocalClear = () => {
    localStorage.removeItem('leadflow_token');
    localStorage.removeItem('leadflow_user');
    setUser(null);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data?.success) {
        const { token, user: userData } = response.data.data;
        
        // Save locally
        localStorage.setItem('leadflow_token', token);
        localStorage.setItem('leadflow_user', JSON.stringify(userData));
        setUser(userData);
        setLoading(false);
        return userData;
      } else {
        setLoading(false);
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      // Notify backend to clear cookies
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore failure on logout call
    } finally {
      handleLocalClear();
    }
  };

  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('leadflow_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
