import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store";

export function RouteGuard({ children, requiredPermission }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="glass rounded-2xl p-8 max-w-md text-center space-y-3">
          <p className="text-4xl">🔒</p>
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-sm text-gray-400">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
