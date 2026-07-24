"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0a2920",
          color: "#fff",
          borderRadius: "12px",
          padding: "14px 20px",
          fontSize: "14px",
          fontWeight: 600,
          border: "1px solid rgba(255,255,255,0.1)",
        },
        success: {
          iconTheme: {
            primary: "#8EC894",
            secondary: "#0a2920",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#0a2920",
          },
        },
      }}
    />
  );
}

