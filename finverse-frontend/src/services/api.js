import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for JWT Bearer Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('finverse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Comprehensive API Calls
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);

export const getAssets = (search = '') => api.get(`/assets?search=${encodeURIComponent(search)}`);
export const getAssetBySymbol = (symbol) => api.get(`/assets/${symbol}`);

export const getMarketOverview = () => api.get('/market/overview');
export const getAssetHistory = (symbol) => api.get(`/market/${symbol}/history`);

export const requestPrediction = (data) => api.post('/predictions', data);
export const getPredictionsForSymbol = (symbol) => api.get(`/predictions/${symbol}`);

export const getPortfolio = () => api.get('/portfolio');
export const addPortfolioPosition = (data) => api.post('/portfolio', data);
export const deletePortfolioPosition = (id) => api.delete(`/portfolio/${id}`);

export const getWatchlist = () => api.get('/watchlist');
export const addToWatchlist = (assetId) => api.post('/watchlist', { assetId });
export const removeFromWatchlist = (id) => api.delete(`/watchlist/${id}`);

export const getAlerts = () => api.get('/alerts');
export const createAlert = (data) => api.post('/alerts', data);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);

export const getDashboardData = () => api.get('/dashboard');
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data) => api.put('/users/profile', data);
export const getAdminStats = () => api.get('/admin/stats');

export default api;
