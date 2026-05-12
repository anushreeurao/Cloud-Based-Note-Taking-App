import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoadingScreen } from "../components/common/LoadingScreen";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen label="Booting your workspace..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
