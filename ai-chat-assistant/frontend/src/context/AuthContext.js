import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ai_assistant_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('ai_assistant_token');
      const savedUser = localStorage.getItem('ai_assistant_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          // Refresh profile in background
          const res = await authAPI.getProfile();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('ai_assistant_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('ai_assistant_token', res.data.token);
        localStorage.setItem('ai_assistant_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const res = await authAPI.register({ name, email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('ai_assistant_token', res.data.token);
        localStorage.setItem('ai_assistant_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your details.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ai_assistant_token');
    localStorage.removeItem('ai_assistant_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
