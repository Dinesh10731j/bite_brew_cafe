import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/app/lib/api/constants";

export type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: AuthUser | null; token?: string | null }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token ?? null;
      state.isAuthenticated = true;
      state.error = null;

      if (typeof window !== "undefined") {
        if (action.payload.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
        } else {
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        if (action.payload.user) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload.user));
        }
      }
    },
    hydrateAuth(state, action: PayloadAction<{ user: AuthUser | null; token?: string | null }>) {
      state.user = action.payload.user;
      state.token = action.payload.token ?? null;
      state.isAuthenticated = Boolean(action.payload.token || action.payload.user);
      state.error = null;
    },
    setCurrentUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload));
        } else {
          localStorage.removeItem(AUTH_USER_KEY);
        }
      }
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    },
  },
});

export const { loginStart, loginSuccess, hydrateAuth, setCurrentUser, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
