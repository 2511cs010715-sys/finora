import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const AI_BASE_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('finplanner_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// REST API Endpoints
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);

export const getIncome = () => api.get('/income');
export const addIncome = (data) => api.post('/income', data);
export const updateIncome = (id, data) => api.put(`/income/${id}`, data);
export const deleteIncome = (id) => api.delete(`/income/${id}`);

export const getExpenses = () => api.get('/expenses');
export const addExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export const getGoals = () => api.get('/goals');
export const createGoal = (data) => api.post('/goals', data);
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);
export const addGoalContribution = (id, amount) => api.post(`/goals/${id}/contribution`, { amount });

export const getInvestments = () => api.get('/investments');
export const addInvestment = (data) => api.post('/investments', data);
export const updateInvestment = (id, data) => api.put(`/investments/${id}`, data);
export const deleteInvestment = (id) => api.delete(`/investments/${id}`);

export const getReminders = () => api.get('/reminders');
export const createReminder = (data) => api.post('/reminders', data);
export const updateReminder = (id, data) => api.put(`/reminders/${id}`, data);
export const deleteReminder = (id) => api.delete(`/reminders/${id}`);

export const getDashboardData = () => api.get('/dashboard');
export const analyzeAiFinances = (data) => axios.post(`${AI_BASE_URL}/analyze`, data);
export const checkAffordabilityAi = (itemPrice = 500, category = 'Food') => axios.get(`${AI_BASE_URL}/ai/affordability?item_price=${itemPrice}&category=${encodeURIComponent(category)}`);
export const getMonthlyReport = (month = '') => api.get(`/reports/monthly?month=${encodeURIComponent(month)}`);

export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);

export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data) => api.put('/users/profile', data);
export const getAdminStats = () => api.get('/admin/stats');

export default api;
