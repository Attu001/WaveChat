import axios from "axios"
import { base_url } from "../api"


export const api=axios.create({
    baseURL:base_url,
    timeout:15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

