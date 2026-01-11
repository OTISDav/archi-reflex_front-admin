import axios from "axios";

const api = axios.create({
  baseURL: "https://archi-reflex-backend.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    // <-- ici on met Token au lieu de Bearer
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
