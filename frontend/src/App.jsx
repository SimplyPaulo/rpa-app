import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';
import AuthPage from './pages/Auth/Auth';
import ReportProblem from './pages/ReportProblem/ReportProblem';
import Confirmation from './pages/Confirmation/Confirmation';
import MyReports from './pages/MyReports/MyReports';
import CompanyDashboard from './pages/CompanyDashboard/CompanyDashboard';
import QRCodePage from './pages/QRCode/QRCode';

/**
 * Redirects authenticated users away from the login page.
 * Client → /report, Company → /dashboard
 */
function PublicRoute({ children }) {
  const { isAuthenticated, isCompany, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to={isCompany ? '/dashboard' : '/report'} replace />;
  }
  return children;
}

/**
 * Root application component with routing configuration.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public: Auth page ──────────────────────── */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* ── Protected: App pages with layout ───────── */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Client pages */}
            <Route path="/report" element={<ReportProblem />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/my-reports" element={<MyReports />} />

            {/* Company pages */}
            <Route path="/dashboard" element={<CompanyDashboard />} />

            {/* Shared pages */}
            <Route path="/qrcode" element={<QRCodePage />} />
          </Route>

          {/* ── Catch-all redirect ─────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
