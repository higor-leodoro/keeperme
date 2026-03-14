import axios from "axios";

import { getToken } from "@/utils/local.storage";

export const api = axios.create({
  // baseURL: "https://keeperme-api.onrender.com/",
  baseURL: "http://localhost:3001/",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
