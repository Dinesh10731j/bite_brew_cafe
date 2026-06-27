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

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
};

type AuthResponse = {
  token: string | null;
  user: AuthUser | null;
};

const parseError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as
      | { message?: string | string[]; error?: string }
      | undefined;

    const message = responseData?.message;
    if (Array.isArray(message) && message.length > 0) {
      return message[0];
    }
    if (typeof message === "string" && message.trim()) {
      return message;
    }
    if (responseData?.error) {
      return responseData.error;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
};

const findStringByKeys = (obj: unknown, keys: string[]): string | null => {
  const record = asRecord(obj);
  if (!record) {
    return null;
  }

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  for (const value of Object.values(record)) {
    const nested = findStringByKeys(value, keys);
    if (nested) {
      return nested;
    }
  }

  return null;
};

const normalizeName = (record: Record<string, unknown>): string | undefined => {
  const rawName = typeof record.name === "string" ? record.name.trim() : undefined;
  const fullName = typeof record.fullName === "string" ? record.fullName.trim() : undefined;
  const firstName = typeof record.firstName === "string" ? record.firstName.trim() : typeof record.first_name === "string" ? record.first_name.trim() : undefined;
  const lastName = typeof record.lastName === "string" ? record.lastName.trim() : typeof record.last_name === "string" ? record.last_name.trim() : undefined;
  const username = typeof record.username === "string" ? record.username.trim() : undefined;

  if (rawName) return rawName;
  if (fullName) return fullName;
  if (firstName || lastName) return [firstName, lastName].filter(Boolean).join(" ");
  if (username) return username;
  return undefined;
};

const findUser = (obj: unknown): AuthUser | null => {
  const record = asRecord(obj);
  if (!record) {
    return null;
  }

  const name = normalizeName(record);
  if (name || record.email || record.id) {
    return {
      id: typeof record.id === "string" ? record.id : undefined,
      name,
      email: typeof record.email === "string" ? record.email : undefined,
      firstName: typeof record.firstName === "string" ? record.firstName : typeof record.first_name === "string" ? record.first_name : undefined,
      lastName: typeof record.lastName === "string" ? record.lastName : typeof record.last_name === "string" ? record.last_name : undefined,
      fullName: typeof record.fullName === "string" ? record.fullName : undefined,
      username: typeof record.username === "string" ? record.username : undefined,
    };
  }

  const directUser = record.user ?? record.customer ?? record.data;
  const userRecord = asRecord(directUser);
  if (userRecord) {
    const resolvedName = normalizeName(userRecord);
    if (resolvedName || userRecord.email || userRecord.id) {
      return {
        id: typeof userRecord.id === "string" ? userRecord.id : undefined,
        name: resolvedName,
        email: typeof userRecord.email === "string" ? userRecord.email : undefined,
        firstName: typeof userRecord.firstName === "string" ? userRecord.firstName : typeof userRecord.first_name === "string" ? userRecord.first_name : undefined,
        lastName: typeof userRecord.lastName === "string" ? userRecord.lastName : typeof userRecord.last_name === "string" ? userRecord.last_name : undefined,
        fullName: typeof userRecord.fullName === "string" ? userRecord.fullName : undefined,
        username: typeof userRecord.username === "string" ? userRecord.username : undefined,
      };
    }
  }

  for (const value of Object.values(record)) {
    const nested = findUser(value);
    if (nested) {
      return nested;
    }
  }

  return null;
};

const extractAuthData = (payload: unknown): AuthResponse => {
  const token = findStringByKeys(payload, ["token", "accessToken", "access_token", "jwt"]);
  const user = findUser(payload);
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

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await axiosInstance.get(ApiEndpoints.me);
      return findUser(response.data);
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
    try {
      const response = await axiosInstance.post(ApiEndpoints.forgotPassword, payload);
      const message = findStringByKeys(response.data, ["message"]);
      return message ?? "Reset email sent successfully.";
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<string> {
    try {
      const response = await axiosInstance.post(ApiEndpoints.resetPassword, payload);
      const message = findStringByKeys(response.data, ["message"]);
      return message ?? "Password reset successful.";
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(ApiEndpoints.logout);
    } catch (error) {
      // Ignore errors - client-side cleanup happens anyway
      console.warn("Logout API error:", parseError(error));
    }
  },
};

