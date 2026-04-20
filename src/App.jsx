import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

// Pages
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Profile } from "./pages/Profile";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ className: 'bg-darkBg text-white border border-white/10' }} />
        <BrowserRouter>

          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute allowedRoles={['freelancer']}>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
