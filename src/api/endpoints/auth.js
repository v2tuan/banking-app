import apiClient from '../client';

export const authAPI = {
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  logout: () => {
    return apiClient.post('/auth/logout');
  },

  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  },

  refreshToken: (refreshToken) => {
    return apiClient.post('/auth/refresh', { refreshToken });
  },
};

export default authAPI;