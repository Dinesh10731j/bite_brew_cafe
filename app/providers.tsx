"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/app/lib/api/constants";
import { authApi } from "@/app/features/auth/api";
import { hydrateAuth, logout, setCurrentUser, type AuthUser } from "@/app/store/slices/authSlice";
import { store } from "@/app/store/store";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    let user: AuthUser | null = null;
    if (rawUser) {
      try {
        user = JSON.parse(rawUser) as AuthUser;
      } catch {
        user = null;
      }
    }

    if (token || user) {
      store.dispatch(hydrateAuth({ token, user }));
    }

    authApi
      .getCurrentUser()
      .then((currentUser) => {
        if (currentUser) {
          store.dispatch(hydrateAuth({ token, user: currentUser }));
          store.dispatch(setCurrentUser(currentUser));
        } else if (!token && !user) {
          store.dispatch(logout());
        }
      })
      .catch(() => {
        if (token || user) {
          store.dispatch(logout());
        }
      });
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
