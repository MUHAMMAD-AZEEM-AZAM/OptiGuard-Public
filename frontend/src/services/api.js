import axios from 'axios';
import { baseURL } from '../config/config';

// Create axios instance
const api = axios.create({
  baseURL: baseURL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (!config.data || !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && 
        (error.response?.data?.tokenExpired || error.response?.data?.needsLogin)) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Main functions
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/signin', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Signin failed'
    );
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Registration failed'
    );
  }
};

export const verifyOTP = async (userId, otp) => {
  try {
    const response = await api.post('/auth/verify-email', { userId, otp });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('OTP verification error:', error.response?.data || error.message);
    throw error;
  }
};

export const resendOTP = async (userId) => {
  try {
    const response = await api.post('/auth/resend-otp', { userId });
    return response.data;
  } catch (error) {
    console.error('Resend OTP error:', error.response?.data || error.message);
    throw error;
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;

  } catch (error) {
    console.error("Upload error:", error.response);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }

    // Gracefully return message for display
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message
      };
    }

    return {
      success: false,
      message: 'Something went wrong during image upload.'
    };
  }
};


export const getUserHistory = async () => {
  try {
    const response = await api.get('/api/history');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔸 Clear all history
export const clearUserHistory = async () => {
  try {
    const response = await api.delete('/api/history'); // no params
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔹 Delete single history item using query param
export const deleteHistoryItem = async (id) => {
  try {
    const response = await api.delete(`/api/history`, {
      params: { historyId: id }, // sending as query param
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addFeedback = async (data) => {
  try {
    const response = await fetch(`${baseURL}/api/history/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add feedback');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Use in your API calls
export const someApiCall = async () => {
  try {
    const response = await api.get('/some-endpoint');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const googleAuth = async (credential) => {
  try {
    const response = await fetch(`${baseURL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ token: credential })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Google authentication failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to authenticate with Google');
  }
};

export const setPassword = async (userId, password) => {
    try {
        const response = await fetch(`${baseURL}/auth/set-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to set password');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const contactUs = async (data) => {
  console.log(data)
    try {
        const response = await fetch(`${baseURL}/user/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send message');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const feedback = async (data) => {
  console.log(data)
    try {
        const response = await fetch(`${baseURL}/user/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to submit feedback');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const newsletterSubscribe = async (data) => {
  try {
    const response = await api.post('/user/subscribe', data); // Make sure to pass `data` if needed

    // Axios doesn't have response.ok — use status check instead
    if (response.status !== 200) {
      throw new Error(response.data?.message || 'Failed to subscribe to newsletter');
    }

    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to authenticate with Google');
  }
}


export default api;
