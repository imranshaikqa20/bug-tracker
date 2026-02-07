import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: false, // JWT, no cookies
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Network / server down
    if (!error.response) {
      console.error("Network error or server not reachable");
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 🔐 Token expired / invalid → force logout
    if (status === 401) {
      console.warn("JWT expired or unauthorized. Redirecting to login...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    // 🚫 Forbidden → DO NOT logout (role-based access)
    if (status === 403) {
      console.warn("Forbidden action: insufficient permissions");
      // Let component handle it (alert / toast)
    }

    return Promise.reject(error);
  }
);

export default api;
