import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Skeleton } from "../components/ui/FormElements";

const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage"));
const EscrowDetailPage = lazy(() => import("../features/escrow/EscrowDetailPage"));
const CreateEscrowPage = lazy(() => import("../features/escrow/CreateEscrowPage"));
const DisputeCenterPage = lazy(() => import("../features/disputes/DisputeCenterPage"));
const ProfilePage = lazy(() => import("../features/profile/ProfilePage"));
const AuthPage = lazy(() => import("../features/auth/AuthPage"));

function PageLoader() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/escrows" element={<DashboardPage />} />
        <Route path="/escrows/:id" element={<EscrowDetailPage />} />
        <Route path="/create" element={<CreateEscrowPage />} />
        <Route path="/disputes" element={<DisputeCenterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Suspense>
  );
}
