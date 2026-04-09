import { AxiosError } from "axios";
import { axiosInstance } from "@/app/lib/api/axiosInstance";
import { ApiEndpoints } from "@/app/lib/api/endpoints";
import type { AuthUser } from "@/app/store/slices/authSlice";

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser | null;
};

const parseError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message;
  }
  return "Something went wrong.";
};

const extractAuthData = (payload: unknown): AuthResponse => {
  const source = payload as Record<string, unknown>;
  const data = (source?.data as Record<string, unknown> | undefined) ?? source;

  const token =
    (data?.token as string | undefined) ??
    (data?.accessToken as string | undefined) ??
    (source?.token as string | undefined) ??
    "";

  const user =
    ((data?.user as AuthUser | undefined) ??
      (data?.customer as AuthUser | undefined) ??
      (source?.user as AuthUser | undefined) ??
      null) || null;

  if (!token) {
    throw new Error("Token missing in auth response");
  }

  return { token, user };
};

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(ApiEndpoints.login, payload);
      return extractAuthData(response.data);
    } catch (error) {
      throw new Error(parseError(error));
    }
  },
  async signup(payload: SignupPayload): Promise<AuthResponse | null> {
    try {
      const response = await axiosInstance.post(ApiEndpoints.signup, payload);
      try {
        return extractAuthData(response.data);
      } catch {
        return null;
      }
    } catch (error) {
      throw new Error(parseError(error));
    }
  },
};
