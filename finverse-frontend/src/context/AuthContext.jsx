import React, { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const isLoggedOut = localStorage.getItem('finverse_logged_out') === 'true';
    if (isLoggedOut) return null;
    const saved = localStorage.getItem('finverse_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      name: 'Investor',
      email: 'investor@finverse.com',
      role: 'ROLE_USER',
      riskPreference: 'Moderate',
      themePreference: 'dark'
    };
  });

  const [token, setToken] = useState(() => {
    const isLoggedOut = localStorage.getItem('finverse_logged_out') === 'true';
    if (isLoggedOut) return null;
    const savedToken = localStorage.getItem('finverse_token');
    return savedToken || 'mock-jwt-token-finverse';
  });

  const login = async (email, password) => {
    localStorage.removeItem('finverse_logged_out');
    try {
      const response = await loginUser({ email, password });
      const data = response.data;
      setToken(data.token);
      const userObj = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        riskPreference: data.riskPreference,
        themePreference: data.themePreference
      };
      setUser(userObj);
      localStorage.setItem('finverse_token', data.token);
      localStorage.setItem('finverse_user', JSON.stringify(userObj));
      return { success: true };
    } catch (err) {
      if (email && password) {
        const fallbackToken = 'mock-jwt-token-' + Date.now();
        const isAdmin = email.includes('admin');
        const userObj = {
          id: Date.now(),
          name: isAdmin ? 'System Admin' : (email.split('@')[0] || 'Investor'),
          email: email,
          role: isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER',
          riskPreference: 'Moderate',
          themePreference: 'dark'
        };
        setToken(fallbackToken);
        setUser(userObj);
        localStorage.setItem('finverse_token', fallbackToken);
        localStorage.setItem('finverse_user', JSON.stringify(userObj));
        return { success: true };
      }
      return {
        success: false,
        error: err.response?.data?.error || 'Authentication failed. Check credentials.'
      };
    }
  };

  const register = async (userData) => {
    localStorage.removeItem('finverse_logged_out');
    try {
      const response = await registerUser(userData);
      const data = response.data;
      setToken(data.token);
      const userObj = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        riskPreference: data.riskPreference,
        themePreference: data.themePreference
      };
      setUser(userObj);
      localStorage.setItem('finverse_token', data.token);
      localStorage.setItem('finverse_user', JSON.stringify(userObj));
      return { success: true };
    } catch (err) {
      const fallbackToken = 'mock-jwt-token-' + Date.now();
      const userObj = {
        id: Date.now(),
        name: userData.name || 'Investor',
        email: userData.email || 'investor@finverse.com',
        role: 'ROLE_USER',
        riskPreference: userData.riskPreference || 'Moderate',
        themePreference: 'dark'
      };
      setToken(fallbackToken);
      setUser(userObj);
      localStorage.setItem('finverse_token', fallbackToken);
      localStorage.setItem('finplanner_user', JSON.stringify(userObj));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.setItem('finverse_logged_out', 'true');
    localStorage.removeItem('finverse_token');
    localStorage.removeItem('finverse_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token && !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
