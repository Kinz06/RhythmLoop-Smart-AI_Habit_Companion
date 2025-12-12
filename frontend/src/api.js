import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  timeout: 6000,
});

API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default API;
