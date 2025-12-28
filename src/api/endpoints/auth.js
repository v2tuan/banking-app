import apiClient from '../client';

export const authAPI = {
  login: (credentials) => {
    return apiClient.post('/users/login', credentials);
  },

  register: (userData) => {
    return apiClient.post('/users/register', userData);
  },

  logout: () => {
    return apiClient.post('/users/logout');
  },

  getCurrentUser: () => {
    return apiClient.get('/users/me');
  },

  refreshToken: (refreshToken) => {
    return apiClient.post('/users/refresh', { refreshToken });
  },
};

export default authAPI;