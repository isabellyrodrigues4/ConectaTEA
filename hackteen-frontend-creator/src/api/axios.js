// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// sempre adiciona o token do localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("conectatea_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
