import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
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
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  }
};

// Hospitals API
export const hospitalsAPI = {
  getAllHospitals: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/hospitals?${params.toString()}`);
    return response.data;
  },

  getHospitalById: async (id) => {
    const response = await api.get(`/hospitals/${id}`);
    return response.data;
  },

  getCities: async () => {
    const response = await api.get('/hospitals/meta/cities');
    return response.data;
  },

  getTypes: async () => {
    const response = await api.get('/hospitals/meta/types');
    return response.data;
  },

  getFeaturedHospitals: async () => {
    const response = await api.get('/hospitals/featured/list');
    return response.data;
  },

  getNearbyHospitals: async (latitude, longitude, radius = 10) => {
    const response = await api.get(`/hospitals/location/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
    return response.data;
  }
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
    const response = await api.get('/doctors/meta/specialties');
    return response.data;
  }
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

  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};

// AI Symptom Analysis API
export const aiAPI = {
  analyzeSymptoms: async (data) => {
    const response = await api.post('/ai/analyze-symptoms', data);
    return response.data;
  },

  getSpecialtyInfo: async (specialty) => {
    const response = await api.get(`/ai/specialty/${specialty}`);
    return response.data;
  }
};

export default api;
