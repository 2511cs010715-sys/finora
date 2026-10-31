import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ai_assistant_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('ai_assistant_token');
        localStorage.removeItem('ai_assistant_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Conversation endpoints
export const conversationAPI = {
  getConversations: () => api.get('/conversations'),
  createConversation: (data) => api.post('/conversations', data),
  getConversationById: (id) => api.get(`/conversations/${id}`),
  updateTitle: (id, title) => api.patch(`/conversations/${id}`, { title }),
  deleteConversation: (id) => api.delete(`/conversations/${id}`),
};

// Chat & Message endpoints
export const chatAPI = {
  sendMessage: (payload) => api.post('/chat', payload),
  regenerateMessage: (payload) => api.post('/chat/regenerate', payload),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
};

export default api;
