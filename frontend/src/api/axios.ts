
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor — handle authentication failures
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url?.split("?")[0] ?? "";

    const isLoginRequest = requestUrl.endsWith("/auth/login");

    // Only invalidate the session for unauthorized
    // requests other than the login endpoint.
    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");

      // Avoid unnecessary reload if already on login page.
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
