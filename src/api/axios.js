import axios from "axios";

const api = axios.create({
  baseURL: "https://archi-reflex-backend.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token"); // ton JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // <-- JWT
  }
  return config;
});

export default api;
