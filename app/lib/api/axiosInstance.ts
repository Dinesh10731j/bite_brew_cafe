import axios, { AxiosError } from "axios";
import { AUTH_TOKEN_KEY } from "@/app/lib/api/constants";
import { logout } from "@/app/store/slices/authSlice";
import { store } from "@/app/store/store";

const resolveBaseUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:7000";
  const trimmed = configured.replace(/\/+$/, "");
  return trimmed.replace(/\/api\/v1\/bite-brew$/, "");
};

const baseURL = resolveBaseUrl();

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) ?? store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);
