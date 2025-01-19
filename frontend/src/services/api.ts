import axios, { AxiosInstance } from 'axios';
import { User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (email: string, password: string, username: string) => {
        const response = await api.post('/auth/register', { email, password, username });
        return response.data;
    },

    googleLogin: () => {
        window.location.href = `${API_URL}/auth/google`;
    },

    facebookLogin: () => {
        window.location.href = `${API_URL}/auth/facebook`;
    }
};

export const user = {
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (data: Partial<User>) => {
        const response = await api.patch('/users/profile', data);
        return response.data;
    },

    submitCarbonFootprint: async (data: any) => {
        const response = await api.post('/users/carbon-footprint', data);
        return response.data;
    },

    getCarbonFootprintHistory: async () => {
        const response = await api.get('/users/carbon-footprint/history');
        return response.data;
    }
};

export const challenges = {
    getAll: async () => {
        const response = await api.get('/challenges');
        return response.data;
    },

    getByCategory: async (category: string) => {
        const response = await api.get(`/challenges/category/${category}`);
        return response.data;
    }
};

export default api; 