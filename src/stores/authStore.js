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
          const res = await authAPI.login(credentials);
          const token = res.data.access_token;
          const user = res.data.user;

          localStorage.setItem('access_token', token);

          set({
            user: user,
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
    const res = await authAPI.register(userData);
    const token = res.data.access_token;
    const user = res.data.user;

    localStorage.setItem('access_token', token);

    set({
      user: user,
      isAuthenticated: true,
      isLoading: false
    });

    return { success: true };
  } catch (error) {
    const message =
      error.response?.data?.message || error.message;

    set({ error: message, isLoading: false });
    return { success: false, error: message };
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