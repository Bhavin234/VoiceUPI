import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [language, setLanguage] = useState('en-IN');
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const loadUserData = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data.data);
      setBalance(response.data.data.balance);
      setLanguage(response.data.data.language || 'en-IN');
    } catch (error) {
      console.error('Failed to load user data:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setBalance(userData.balance);
    setLanguage(userData.language || 'en-IN');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setBalance(0);
  };

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    if (user) {
      const updatedUser = { ...user, language: newLanguage };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    balance,
    language,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
    updateBalance,
    updateLanguage,
    refreshUserData: loadUserData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
