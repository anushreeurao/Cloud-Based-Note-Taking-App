import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth, googleProvider } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      loginWithGoogle: async () => {
        try {
          await signInWithPopup(auth, googleProvider);
          toast.success("Welcome back.");
        } catch (error) {
          if (error?.code !== "auth/popup-closed-by-user") {
            toast.error("Google sign-in failed.");
          }
        }
      },
      logout: async () => {
        await signOut(auth);
        toast.success("You are signed out.");
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider.");
  }

  return context;
}
