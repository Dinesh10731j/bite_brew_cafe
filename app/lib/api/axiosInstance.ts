import axios, { AxiosError } from "axios";
import { AUTH_TOKEN_KEY } from "@/app/lib/api/constants";
import { logout } from "@/app/store/slices/authSlice";
import { store } from "@/app/store/store";

const resolveBaseUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? "https://bite-brew-backend.onrender.com";
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

// ─────────────────────────────────────────────────────────────
// AI Menu Recommendation Service axios instance
// Points to the AI microservice (default deployed on Render)
// ─────────────────────────────────────────────────────────────
const resolveAiBaseUrl = (): string => {
  const configured =
    process.env.NEXT_PUBLIC_AI_RECOMMEND_URL ??
    process.env.NEXT_PUBLIC_AI_BASE_URL ??
    "https://bite-brew-menu-recommendation-system.onrender.com";
  return configured.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
};

const aiBaseURL = resolveAiBaseUrl();

export const recommendationAxiosInstance = axios.create({
  baseURL: aiBaseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

recommendationAxiosInstance.interceptors.request.use((config) => {
  const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;
  if (apiKey) {
    config.headers["X-API-Key"] = apiKey;
  }
  return config;
});
