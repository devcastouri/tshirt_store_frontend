import axios from 'axios';
import { supabase } from '../config/supabase';

// Get API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Is the backend server running?');
      throw new Error('Unable to connect to the server. Please make sure the backend server is running.');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

// Log API configuration on initialization
console.log('API Configuration:', {
  baseURL: API_URL,
  environment: process.env.NODE_ENV
});

const apiService = {
  // Product API calls
  getProducts: async () => {
    try {
      console.log('Fetching products from:', `${api.defaults.baseURL}/products`);
      const response = await api.get('/products');
      console.log('Products response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get Products Error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw new Error(error.message || 'Failed to fetch products');
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get Product Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Create Product Error:', error);
      throw new Error('Failed to create product');
    }
  },

  updateProduct: async (id, productData) => {
    try {
      // If productData is FormData, don't set Content-Type header
      const config = productData instanceof FormData ? {
        headers: {
          // Let the browser set the correct Content-Type with boundary
          'Content-Type': undefined
        }
      } : {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      console.log('Sending update request:', {
        id,
        isFormData: productData instanceof FormData,
        hasImage: productData instanceof FormData ? productData.has('image') : false
      });

      const response = await api.put(`/products/${id}`, productData, config);
      return response.data;
    } catch (error) {
      console.error('Update Product Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to update product');
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete Product Error:', error);
      throw new Error('Failed to delete product');
    }
  },

  // Auth API calls
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (!user) {
        throw new Error('No user found');
      }

      // Get user role from our database
      const response = await api.get(`/users/email/${user.email}`);
      return {
        data: {
          user: {
            ...user,
            ...response.data.data.user
          }
        }
      };
    } catch (error) {
      console.error('Get Current User Error:', error);
      throw new Error(error.message || 'Failed to get current user');
    }
  },

  login: async (credentials) => {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw new Error(error.message || 'Authentication failed');
      }

      if (!data.session) {
        throw new Error('No session data received');
      }

      // Store the session token
      localStorage.setItem('token', data.session.access_token);

      return {
        data: {
          session: data.session,
          user: data.user
        }
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout Error:', error);
      throw new Error('Failed to logout');
    }
  },

  // Image upload API call
  deleteProductImage: async (productId, imageUrl) => {
    try {
      console.log('Deleting image:', { productId, imageUrl });
      const response = await api.delete(`/products/${productId}/images`, {
        data: { imageUrl }
      });
      return response.data;
    } catch (error) {
      console.error('Delete Image Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete image');
    }
  }
};

export default apiService;