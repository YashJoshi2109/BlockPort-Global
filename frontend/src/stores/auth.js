import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Create form data
          const formData = new URLSearchParams();
          formData.append("username", email);
          formData.append("password", password);

          const response = await api.post("/api/v1/auth/test-login", formData);
          const { access_token, refresh_token, user } = response.data;

          set({
            token: access_token,
            refreshToken: refresh_token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set default authorization header
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;
        } catch (error) {
          console.error("Login error:", error.response?.data || error.message);
          set({
            error: error.response?.data?.detail || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const registrationData = {
            email: userData.email,
            password: userData.password,
            confirm_password: userData.confirmPassword,
            username: userData.username,
            full_name: userData.fullName || userData.username,
            role: userData.role?.toLowerCase() || "user",
          };

          const response = await api.post(
            "/api/v1/auth/register",
            registrationData
          );
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.detail || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
        delete api.defaults.headers.common["Authorization"];
      },

      refreshAccessToken: async () => {
        try {
          const response = await api.post("/api/v1/auth/refresh", {
            refresh_token: useAuthStore.getState().refreshToken,
          });
          const { access_token } = response.data;
          set({ token: access_token });
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;
        } catch (error) {
          useAuthStore.getState().logout();
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await useAuthStore.getState().refreshAccessToken();
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export default useAuthStore;
