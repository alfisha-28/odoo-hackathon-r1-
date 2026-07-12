import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import AuthPage from './features/auth/pages/AuthPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import AssetDirectoryPage from './features/assets/pages/AssetDirectoryPage';
import RegisterAssetPage from './features/assets/pages/RegisterAssetPage';
import OrganizationSetupPage from './features/organization/pages/OrganizationSetupPage';
import AllocationPage from './features/allocation/pages/AllocationPage';
import ResourceBookingPage from './features/booking/pages/ResourceBookingPage';
import MaintenancePage from './features/maintenance/pages/MaintenancePage';
import AuditPage from './features/audit/pages/AuditPage';
import DashboardLayout from './shared/components/DashboardLayout';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/assets',
        element: <Navigate to="/assets/directory" replace />,
      },
      {
        path: '/assets/directory',
        element: <AssetDirectoryPage />,
      },
      {
        path: '/assets/register',
        element: <RegisterAssetPage />,
      },
      {
        path: '/allocations',
        element: <AllocationPage />,
      },
      {
        path: '/organization',
        element: <OrganizationSetupPage />,
      },
      {
        path: '/bookings',
        element: <ResourceBookingPage />,
      },
      {
        path: '/maintenance',
        element: <MaintenancePage />,
      },
      {
        path: '/audit',
        element: <AuditPage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
