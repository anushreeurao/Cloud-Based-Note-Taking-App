import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useUIStore } from "../store/useUIStore";
import { AuthProvider } from "../contexts/AuthContext";

export function AppProviders({ children }) {
  const { theme, mood } = useUIStore();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.mood = mood;
  }, [theme, mood]);

  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(7, 12, 30, 0.85)",
            color: "#e8eeff",
            border: "1px solid rgba(110, 155, 255, 0.35)",
            backdropFilter: "blur(12px)",
          },
        }}
      />
    </AuthProvider>
  );
}
