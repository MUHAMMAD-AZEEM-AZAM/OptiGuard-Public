// Base URLs for different environments
const configs = {
  development: {
    baseURL: 'http://localhost:5000',
  },
  production: {
    baseURL: 'https://your-production-api.com', // Update this with your production API URL
  },
  test: {
    baseURL: 'http://localhost:5000',
  },
};

// Get current environment, default to development if not set
const environment = import.meta.env.VITE_NODE_ENV || 'development';

// Export the configuration for the current environment
export const config = configs[environment];

// Export commonly used values directly
export const baseURL = config.baseURL; 