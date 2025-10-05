import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('healthcareToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('healthcareToken');
      localStorage.removeItem('healthcareUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
};

// Doctors API
export const doctorsAPI = {
  getAllDoctors: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/doctors?${params.toString()}`);
    return response.data;
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  getSpecialties: async () => {
    const response = await api.get('/specialties');
    return response.data;
  },

  getCities: async () => {
    const response = await api.get('/cities');
    return response.data;
  },
};

// Appointments API
export const appointmentsAPI = {
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.delete(`/appointments/${appointmentId}`);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  analyzeSymptoms: async (symptomsData) => {
    const response = await api.post('/ai/analyze-symptoms', symptomsData);
    return response.data;
  },

  getSpecialties: async () => {
    const response = await api.get('/ai/specialties');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
