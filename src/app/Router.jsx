import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Skeleton } from "../components/ui/FormElements";
import { RouteGuard } from "../components/shared/RouteGuard";
import { AnimatePresence } from "framer-motion";

const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage"));
const EscrowDetailPage = lazy(() => import("../features/escrow/EscrowDetailPage"));
const CreateEscrowPage = lazy(() => import("../features/escrow/CreateEscrowPage"));
const EscrowExplorerPage = lazy(() => import("../features/escrow/EscrowExplorerPage"));
const DisputeCenterPage = lazy(() => import("../features/disputes/DisputeCenterPage"));
const ProfilePage = lazy(() => import("../features/profile/ProfilePage"));
const AuthPage = lazy(() => import("../features/auth/AuthPage"));
const SystemsPage = lazy(() => import("../features/systems/SystemsPage"));
const LandingPage = lazy(() => import("../features/marketing/LandingPage"));
const PricingPage = lazy(() => import("../features/marketing/PricingPage"));
const WalletPage = lazy(() => import("../features/wallet/WalletPage"));

function PageLoader() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 lg:col-span-2" /><Skeleton className="h-64" />
      </div>
    </div>
  );
}

export function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<RouteGuard><DashboardPage /></RouteGuard>} />
          <Route path="/escrows" element={<RouteGuard><DashboardPage /></RouteGuard>} />
          <Route path="/escrows/:id" element={<RouteGuard><EscrowDetailPage /></RouteGuard>} />
          <Route path="/explore" element={<EscrowExplorerPage />} />
          <Route path="/create" element={<RouteGuard requiredPermission="create_escrow"><CreateEscrowPage /></RouteGuard>} />
          <Route path="/disputes" element={<RouteGuard><DisputeCenterPage /></RouteGuard>} />
          <Route path="/wallet" element={<RouteGuard><WalletPage /></RouteGuard>} />
          <Route path="/systems" element={<RouteGuard><SystemsPage /></RouteGuard>} />
          <Route path="/profile" element={<RouteGuard><ProfilePage /></RouteGuard>} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
