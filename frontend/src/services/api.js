import axios from "axios";

// Use VITE_API_URL for production, fallback to localhost for development
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://blockport-global.onrender.com/api/v1"
    : "http://127.0.0.1:8000/api/v1");

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
  resetPassword: (email) => api.post("/auth/reset-password", { email }),
  refreshToken: () => api.post("/auth/refresh-token"),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (data) => api.put("/users/me", data),
  updatePassword: (data) => api.put("/users/me/password", data),
  getNotifications: () => api.get("/users/me/notifications"),
  updateNotificationSettings: (settings) =>
    api.put("/users/me/notifications/settings", settings),
};

// Subscription API
export const subscriptionAPI = {
  getCurrentPlan: () => api.get("/subscriptions/current"),
  getPlans: () => api.get("/subscriptions/plans"),
  subscribe: (planId, paymentMethod) =>
    api.post("/subscriptions/subscribe", { planId, paymentMethod }),
  cancelSubscription: () => api.post("/subscriptions/cancel"),
  updatePaymentMethod: (paymentMethod) =>
    api.put("/subscriptions/payment-method", { paymentMethod }),
  getBillingHistory: () => api.get("/subscriptions/billing-history"),
  downloadInvoice: (invoiceId) =>
    api.get(`/subscriptions/invoices/${invoiceId}`, { responseType: "blob" }),
};

// Contract API
export const contractAPI = {
  getContracts: (filters) => api.get("/contracts", { params: filters }),
  getContract: (id) => api.get(`/contracts/${id}`),
  createContract: (data) => api.post("/contracts", data),
  updateContract: (id, data) => api.put(`/contracts/${id}`, data),
  deleteContract: (id) => api.delete(`/contracts/${id}`),
  signContract: (id) => api.post(`/contracts/${id}/sign`),
  getContractTemplates: () => api.get("/contracts/templates"),
};

// Escrow API
export const escrowAPI = {
  getEscrows: (filters) => api.get("/escrows", { params: filters }),
  getEscrow: (id) => api.get(`/escrows/${id}`),
  createEscrow: (data) => api.post("/escrows", data),
  updateEscrow: (id, data) => api.put(`/escrows/${id}`, data),
  releaseFunds: (id) => api.post(`/escrows/${id}/release`),
  disputeEscrow: (id, reason) => api.post(`/escrows/${id}/dispute`, { reason }),
  getEscrowHistory: (id) => api.get(`/escrows/${id}/history`),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get("/analytics/dashboard"),
  getTransactionStats: (period) =>
    api.get("/analytics/transactions", { params: { period } }),
  getRevenueStats: (period) =>
    api.get("/analytics/revenue", { params: { period } }),
  getUserStats: () => api.get("/analytics/users"),
  exportReport: (type, filters) =>
    api.get("/analytics/export", {
      params: { type, ...filters },
      responseType: "blob",
    }),
};

// Enterprise API
export const enterpriseAPI = {
  submitInquiry: (data) => api.post("/enterprise/inquiries", data),
  requestDemo: (data) => api.post("/enterprise/demo-request", data),
  getCustomQuote: (requirements) => api.post("/enterprise/quote", requirements),
};

// Support API
export const supportAPI = {
  createTicket: (data) => api.post("/support/tickets", data),
  getTickets: () => api.get("/support/tickets"),
  getTicket: (id) => api.get(`/support/tickets/${id}`),
  updateTicket: (id, data) => api.put(`/support/tickets/${id}`, data),
  addTicketMessage: (id, message) =>
    api.post(`/support/tickets/${id}/messages`, { message }),
  getFAQs: () => api.get("/support/faqs"),
};

// Document API
export const documentAPI = {
  uploadDocument: (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    return api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getDocuments: () => api.get("/documents"),
  deleteDocument: (id) => api.delete(`/documents/${id}`),
  shareDocument: (id, users) => api.post(`/documents/${id}/share`, { users }),
};

export default api;
