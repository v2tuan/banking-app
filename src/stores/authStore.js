import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authAPI from '@/api/endpoints/auth';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.login(credentials);
          localStorage.setItem('access_token', data.access_token);
          set({ 
            user: data.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.register(userData);
          localStorage.setItem('access_token', data.access_token);
          set({ 
            user: data.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);