import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  verifyBiometric: (data) => api.post('/auth/verify-biometric', data)
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  getBalance: () => api.get('/users/balance'),
  updateSettings: (data) => api.put('/users/settings', data),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
  getContacts: () => api.get('/users/contacts')
};

// Transaction API
export const transactionAPI = {
  sendMoney: (data) => api.post('/transactions/send', data),
  getTransactions: (params) => api.get('/transactions', { params }),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  parseCommand: (command) => api.post('/transactions/parse-command', { command })
};

export default api;
