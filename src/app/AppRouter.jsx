import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { AppShell } from "../components/layout/AppShell";

const AuthPage = lazy(() => import("../pages/AuthPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ArchivePage = lazy(() => import("../pages/ArchivePage"));
const TrashPage = lazy(() => import("../pages/TrashPage"));
const StudioPage = lazy(() => import("../pages/StudioPage"));
const TimelinePage = lazy(() => import("../pages/TimelinePage"));

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading workspace..." />}>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="archive" element={<ArchivePage />} />
          <Route path="trash" element={<TrashPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="timeline" element={<TimelinePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
