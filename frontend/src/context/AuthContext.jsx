import React, { createContext, useContext, useState, useEffect } from 'react';
import useCustomSnackbar from '../hooks/useCustomSnackbar';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess } = useCustomSnackbar();

  useEffect(() => {
    // Check for stored auth data on component mount
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken, newUser, rememberMe = false) => {
    setToken(newToken);
    setUser(newUser);
    
    // Store in either localStorage or sessionStorage based on rememberMe
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', newToken);
    storage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // Clear both storages to be safe
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('results');
    showSuccess('Successfully logged out');
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
