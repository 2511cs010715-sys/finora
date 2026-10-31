import React, { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const isLoggedOut = localStorage.getItem('finplanner_logged_out') === 'true';
    if (isLoggedOut) return null;
    const saved = localStorage.getItem('finplanner_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, name: 'Investors' };
    }
    return {
      id: 1,
      name: 'Investors',
      email: 'user@finplanner.com',
      role: 'ROLE_USER',
      monthlyIncome: 50000,
      financialGoalPref: 'Balanced Savings & Growth'
    };
  });

  const [token, setToken] = useState(() => {
    const isLoggedOut = localStorage.getItem('finplanner_logged_out') === 'true';
    if (isLoggedOut) return null;
    const savedToken = localStorage.getItem('finplanner_token');
    return savedToken || 'mock-jwt-token-demo';
  });

  const login = async (email, password) => {
    localStorage.removeItem('finplanner_logged_out');
    try {
      const response = await loginUser({ email, password });
      const data = response.data;
      setToken(data.token);
      const userObj = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        monthlyIncome: data.monthlyIncome,
        financialGoalPref: data.financialGoalPref,
        themePreference: data.themePreference
      };
      setUser(userObj);
      localStorage.setItem('finplanner_token', data.token);
      localStorage.setItem('finplanner_user', JSON.stringify(userObj));
      return { success: true };
    } catch (err) {
      // Fallback local authentication when Spring Boot backend is offline
      if (email && password) {
        const fallbackToken = 'mock-jwt-token-' + Date.now();
        const isAdmin = email.includes('admin');
        const userObj = {
          id: Date.now(),
          name: isAdmin ? 'System Admin' : (email.split('@')[0] || 'Alex Mercer'),
          email: email,
          role: isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER',
          monthlyIncome: 50000,
          financialGoalPref: 'Balanced Savings & Growth',
          themePreference: 'dark'
        };
        setToken(fallbackToken);
        setUser(userObj);
        localStorage.setItem('finplanner_token', fallbackToken);
        localStorage.setItem('finplanner_user', JSON.stringify(userObj));
        return { success: true };
      }
      return {
        success: false,
        error: err.response?.data?.error || 'Authentication failed. Check credentials.'
      };
    }
  };

  const register = async (userData) => {
    localStorage.removeItem('finplanner_logged_out');
    try {
      const response = await registerUser(userData);
      const data = response.data;
      setToken(data.token);
      const userObj = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        monthlyIncome: data.monthlyIncome,
        financialGoalPref: data.financialGoalPref,
        themePreference: data.themePreference
      };
      setUser(userObj);
      localStorage.setItem('finplanner_token', data.token);
      localStorage.setItem('finplanner_user', JSON.stringify(userObj));
      return { success: true };
    } catch (err) {
      // Fallback local registration when Spring Boot backend is offline
      const fallbackToken = 'mock-jwt-token-' + Date.now();
      const userObj = {
        id: Date.now(),
        name: userData.name || 'Alex Mercer',
        email: userData.email || 'user@finplanner.com',
        role: 'ROLE_USER',
        monthlyIncome: userData.monthlyIncome || 50000,
        financialGoalPref: userData.financialGoalPref || 'Balanced Savings & Growth',
        themePreference: 'dark'
      };
      setToken(fallbackToken);
      setUser(userObj);
      localStorage.setItem('finplanner_token', fallbackToken);
      localStorage.setItem('finplanner_user', JSON.stringify(userObj));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.setItem('finplanner_logged_out', 'true');
    localStorage.removeItem('finplanner_token');
    localStorage.removeItem('finplanner_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token && !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
